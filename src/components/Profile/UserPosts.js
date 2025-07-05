"use client";

import { useEffect, useState } from "react";
import { blogs } from "@/.velite/generated";
import Link from "next/link";

export default function UserPosts({ uid }) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const authored = blogs.filter((post) => post.author === uid);
    setUserPosts(authored);
  }, [uid]);

  if (userPosts.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        No posts written by this user yet.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">📝 Your Posts</h2>
      <ul className="space-y-4">
        {userPosts.map((post) => (
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
    </div>
  );
}
