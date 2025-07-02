"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/src/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function LikeButton({ slug }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const docRef = doc(db, "likes", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikes(docSnap.data().count || 0);
      } else {
        await setDoc(docRef, { count: 0 });
      }
    };
    fetchLikes();
  }, [slug]);

  const handleLike = async () => {
    const docRef = doc(db, "likes", slug);
    const newCount = liked ? likes - 1 : likes + 1;

    setLiked(!liked);
    setLikes(newCount);

    await updateDoc(docRef, {
      count: newCount,
    });
  };

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border transition-all duration-300 ${
        liked
          ? "bg-rose-600 border-rose-700 text-white"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
      }`}
    >
      {/* Animated Heart Icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        key={liked ? "filled" : "outline"}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-5 h-5"
        fill={liked ? "currentColor" : "none"}
        stroke={liked ? "currentColor" : "gray"}
        viewBox="0 0 24 24"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21C12 21 5 14.75 5 9.75C5 6.5 7.5 4 10.5 4C12 4 13.5 5 14 6C14.5 5 16 4 17.5 4C20.5 4 23 6.5 23 9.75C23 14.75 16 21 16 21H12Z"
        />
      </motion.svg>

      {/* Text */}
      <span className="text-sm font-medium">{liked ? "Liked" : "Like"}</span>

      {/* Count */}
      <AnimatePresence>
        <motion.span
          key={likes}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 5, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm"
        >
          {likes}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
