"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import slugify from "slugify";

export default function CreateCommunityPostPage() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/login"); // Redirect to login if not signed in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post.");

    const slug = slugify(title, { lower: true, strict: true });

    const post = {
      title,
      content,
      slug,
      tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
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
      console.error("Error adding post:", err);
      alert("Failed to post. Try again.");
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
          placeholder="Post title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post..."
          className="w-full p-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated, e.g., firebase,react)"
          className="w-full p-2 border rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
