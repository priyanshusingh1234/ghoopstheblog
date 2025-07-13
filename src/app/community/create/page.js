"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import slugify from "slugify";
import dynamic from "next/dynamic";

const RemirrorEditor = dynamic(() => import("@/src/components/RemirrorEditor"), { ssr: false });

export default function CreateCommunityPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !content || !title) return alert("Please complete the form");

    const slug = slugify(title, { lower: true, strict: true });

    const post = {
      title,
      content,
      slug,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()),
      createdAt: Timestamp.now(),
      userId: user.uid,
      likes: 0,
      commentsCount: 0,
    };

    try {
      setLoading(true);
      await addDoc(collection(db, "communityPosts"), post);
      router.push("/community");
    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Community Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <RemirrorEditor onChange={setContent} />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </main>
  );
}
