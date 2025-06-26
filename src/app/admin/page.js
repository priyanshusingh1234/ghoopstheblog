"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/src/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ADMIN_EMAILS } from "@/src/utils/constants";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Logged in user:", currentUser?.email);
      console.log("Allowed admins:", ADMIN_EMAILS);

      if (currentUser) {
        setUser(currentUser);

        // ✅ only fetch data if admin
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          const snapshot = await getDocs(collection(db, "authorApplications"));
          const pending = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((app) => app.status === "pending");
          setApplications(pending);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const approveAuthor = async (uid, email) => {
    try {
      await updateDoc(doc(db, "authorApplications", uid), {
        status: "approved",
      });

      await setDoc(doc(db, "authors", uid), {
        uid,
        email,
        is_verified: true,
        approvedAt: new Date(),
      });

      setApplications((prev) => prev.filter((app) => app.id !== uid));
      alert(`✅ Approved ${email}`);
    } catch (err) {
      console.error("Error approving:", err);
      alert("Failed to approve.");
    }
  };

  // 🌀 Loading
  if (loading) return <div className="p-6 text-white">Loading...</div>;

  // 🚫 Access check (AFTER loading!)
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="bg-zinc-800 p-6 rounded-xl text-center shadow">
          <h1 className="text-xl font-bold mb-2">🚫 Access Denied</h1>
          <p className="text-gray-400">
            You are not authorized to view this page.
          </p>
        </div>
      </main>
    );
  }

  // ✅ Show dashboard
  return (
    <main className="min-h-screen p-6 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Author Approvals</h1>

      {applications.length === 0 ? (
        <p className="text-gray-400">🎉 No pending applications.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-zinc-800 rounded-lg p-4 shadow border border-zinc-700"
            >
              <p className="font-semibold text-lg text-green-300">
                {app.email}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <strong>Why:</strong> {app.why}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <strong>Portfolio:</strong>{" "}
                <a
                  href={app.portfolio}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                >
                  {app.portfolio}
                </a>
              </p>

              <button
                onClick={() => approveAuthor(app.id, app.email)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
