"use client";
import { useEffect, useState } from "react";
import { blogs } from "@/.velite/generated";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPosts from "../components/Home/FeaturedPosts";
import RecentPosts from "../components/Home/RecentPosts";
import AuthModal from "@/src/components/AuthModal.js/AuthModal";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  // 💡 Auto-open modal on page load
  useEffect(() => {
    setShowAuth(true);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center relative">
      {/* 🔐 Modal will open automatically */}
      <HomeCoverSection blogs={blogs} />
      <FeaturedPosts blogs={blogs} />
      <RecentPosts blogs={blogs} />

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
