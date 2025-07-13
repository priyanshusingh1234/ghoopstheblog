// app/community/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/utils/firebase";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Community Discussions</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <Link key={post.id} href={`/community/${post.slug}`} className="block border p-4 rounded hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-600">
              {post.tags?.join(", ")} • {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
            </p>
            <p className="text-gray-800 mt-2 line-clamp-2">{post.content}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
