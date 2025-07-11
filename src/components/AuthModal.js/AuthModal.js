"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/src/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthModal({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) return;

    const viewCount = parseInt(localStorage.getItem("authModalViews") || "0");
    if (viewCount < 2 && isOpen) {
      setShouldShow(true);
      localStorage.setItem("authModalViews", (viewCount + 1).toString());
      document.body.style.overflow = "hidden";
    } else {
      onClose();
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, user, onClose]);

  if (!isOpen || !shouldShow || user) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="relative bg-white dark:bg-zinc-900 text-black dark:text-white p-8 md:p-12 rounded-2xl w-[95%] max-w-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Welcome to GhoopsTheBlog 🚀
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-6">
              Dive into hand-picked content curated for developers, tech
              enthusiasts, and curious minds.
            </p>

            <div className="flex justify-center gap-6 mt-8">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-300 px-6 py-2 rounded-lg transition-all font-medium shadow"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
