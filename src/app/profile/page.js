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
import { blogs as allBlogs } from "@/.velite/generated";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

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

        const liked = [];
        const authored = [];

        for (const blog of allBlogs) {
          const likeRef = doc(db, "blogs", blog.slug, "likes", currentUser.uid);
          const likeSnap = await getDoc(likeRef);
          if (likeSnap.exists()) {
            liked.push(blog);
          }

          if (blog.author === currentUser.uid) {
            authored.push(blog);
          }
        }

        setLikedPosts(liked);
        setUserPosts(authored);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => router.replace("/"))
      .catch((err) => console.error("Logout failed:", err));
  };

  if (loading || !user || !userData)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );

  const visiblePosts = showAll ? likedPosts : likedPosts.slice(0, 3);

  return (
    <main className="max-w-6xl mx-auto p-6 mt-10 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
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
                      className="w-4 h-4"
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

          {likedPosts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">❤️ Liked Posts</h2>
              <ul className="space-y-4">
                {visiblePosts.map((post) => (
                  <li key={post.slug} className="p-4 border rounded-md">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500">{post.description}</p>
                  </li>
                ))}
              </ul>
              {likedPosts.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {showAll ? "Show Less" : "Show All"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          {userPosts.length > 0 && (
            <aside className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">📝 Your Posts</h2>
              <ul className="space-y-4">
                {userPosts.map((post) => (
                  <li key={post.slug} className="border p-4 rounded-md">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500">{post.description}</p>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
