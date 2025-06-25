"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ correct for App Router
import { auth } from "@/src/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login"); // ✅ replace instead of push
      } else {
        setUser(currentUser);
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

  if (!user) return null;

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
          <p className="text-lg font-semibold">
            {user.displayName || "Anonymous User"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
     <Link href="/edit-profile" className="text-blue-600 hover:underline">
  Edit Profile
</Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
