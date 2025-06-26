"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/utils/firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);

        // Get user info from /users
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        // Get verification status from /authors
        const authorRef = doc(db, "authors", currentUser.uid);
        const authorSnap = await getDoc(authorRef);

        let userInfo = {};
        if (userSnap.exists()) {
          userInfo = userSnap.data();
        } else {
          userInfo = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "Anonymous",
            photoURL: currentUser.photoURL || "",
            createdAt: new Date(),
          };
          await setDoc(userRef, userInfo);
        }

        const authorInfo = authorSnap.exists() ? authorSnap.data() : {};

        setUserData({
          ...userInfo,
          isAuthor: authorInfo?.is_verified === true,
        });

        // Get application status
        const appRef = doc(db, "authorApplications", currentUser.uid);
        const appSnap = await getDoc(appRef);
        if (appSnap.exists()) {
          setApplicationStatus(appSnap.data().status); // pending / approved / rejected
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  if (!user || !userData) return null;

  return (
    <main className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />

        <div>
          <p className="text-lg font-semibold flex items-center gap-2">
            {user.displayName || "Anonymous User"}

            {userData.isAuthor && (
              <span
                title="Verified Author"
                className="inline-flex items-center gap-1 text-sm text-green-600 font-semibold bg-green-100 dark:bg-green-800 dark:text-green-300 px-2 py-0.5 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-green-600 dark:text-green-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.285 6.709l-11.01 11.01-5.657-5.657 1.414-1.414 4.243 4.243 9.596-9.596z" />
                </svg>
                Verified
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {userData.isAuthor ? (
          <p className="text-green-500">✅ You are an approved author!</p>
        ) : applicationStatus === "pending" ? (
          <p className="text-yellow-500">
            🕒 Your author application is under review.
          </p>
        ) : applicationStatus === "rejected" ? (
          <p className="text-red-500">
            ❌ Your author application was rejected.
          </p>
        ) : (
          <Link href="/apply-author">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4">
              Apply to Become an Author
            </button>
          </Link>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/edit-profile" className="text-blue-600 hover:underline">
          Edit Profile
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
