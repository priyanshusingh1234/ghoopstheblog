"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/src/utils/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function LikeButton({ slug }) {
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0); // ✅ Default to 0 instead of null

  // ✅ Watch login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ✅ Fetch likes count + like status
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Get total likes
        const likesSnap = await getDocs(collection(db, "blogs", slug, "likes"));
        setLikesCount(likesSnap.size);

        // Check if current user liked
        if (user) {
          const likeRef = doc(db, "blogs", slug, "likes", user.uid);
          const likeSnap = await getDoc(likeRef);
          setLiked(likeSnap.exists());
        } else {
          setLiked(false);
        }
      } catch (err) {
        console.error("🔥 Error fetching likes:", err);
      }
    };

    fetchData();
  }, [slug, user]);

  // ✅ Toggle like/unlike
  const toggleLike = async () => {
    if (!user) return alert("Please sign in to like this post.");

    const likeRef = doc(db, "blogs", slug, "likes", user.uid);
    try {
      if (liked) {
        await deleteDoc(likeRef);
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await setDoc(likeRef, { liked: true });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("🔥 Error toggling like:", err);
    }
  };

  return (
    <motion.button
      onClick={toggleLike}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow transition ${
        liked
          ? "bg-red-600 text-white border-red-600"
          : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
      }`}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        key={liked ? "filled" : "outline"}
        className="w-5 h-5"
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21C12 21 5 14.75 5 9.75C5 6.5 7.5 4 10.5 4C12 4 13.5 5 14 6C14.5 5 16 4 17.5 4C20.5 4 23 6.5 23 9.75C23 14.75 16 21 16 21H12Z"
        />
      </motion.svg>
      <span className="text-sm font-medium">{liked ? "Liked" : "Like"}</span>
      <span className="text-sm font-semibold">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
    </motion.button>
  );
}
