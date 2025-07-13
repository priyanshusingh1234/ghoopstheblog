"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/src/utils/firebase";
import {
  FaReply,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";

export default function CommunityPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [collapsedComments, setCollapsedComments] = useState({});
  const commentFormRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            displayName: u.displayName || "",
            photoURL: u.photoURL || "",
            email: u.email,
            createdAt: Timestamp.now(),
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      const q = query(collection(db, "communityPosts"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const postDoc = snap.docs[0];
        setPost({ id: postDoc.id, ...postDoc.data(), ref: postDoc.ref });

        const commentsRef = collection(postDoc.ref, "comments");
        const cQuery = query(commentsRef, orderBy("createdAt", "asc"));

        const unsub = onSnapshot(cQuery, async (snap) => {
          const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setComments(all);

          const uids = [...new Set(all.map((c) => c.userId))];
          const newMap = {};
          for (const uid of uids) {
            if (!userMap[uid]) {
              const userSnap = await getDoc(doc(db, "users", uid));
              if (userSnap.exists()) {
                newMap[uid] = userSnap.data();
              }
            }
          }
          setUserMap((prev) => ({ ...prev, ...newMap }));
        });

        setLoading(false);
        return () => unsub();
      }
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    await addDoc(collection(post.ref, "comments"), {
      text: commentText,
      userId: user.uid,
      createdAt: Timestamp.now(),
      parentId: null,
    });

    setCommentText("");
    commentFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReplySubmit = async (parentId) => {
    const replyText = replyTextMap[parentId];
    if (!user || !replyText?.trim()) return;

    await addDoc(collection(post.ref, "comments"), {
      text: replyText,
      userId: user.uid,
      createdAt: Timestamp.now(),
      parentId,
    });

    setReplyTextMap((prev) => ({ ...prev, [parentId]: "" }));
    setReplyTo(null);
  };

  const handleEdit = async () => {
    if (!editText.trim() || !editingComment) return;

    const ref = doc(db, `communityPosts/${post.id}/comments/${editingComment}`);
    await updateDoc(ref, {
      text: editText,
      updatedAt: Timestamp.now(),
    });

    setEditingComment(null);
    setEditText("");
  };

  const handleDelete = async (id) => {
    if (confirm("Delete comment?")) {
      const ref = doc(db, `communityPosts/${post.id}/comments/${id}`);
      await deleteDoc(ref);
    }
  };

  const toggleCollapse = (commentId) => {
    setCollapsedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (parentId = null, depth = 0) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((c) => {
        const author = userMap[c.userId] || {};
        const isUser = user?.uid === c.userId;
        const hasReplies = comments.some((comment) => comment.parentId === c.id);
        const isCollapsed = collapsedComments[c.id];

        return (
          <div
            key={c.id}
            className={`mt-3 ${depth > 0 ? "border-l-2 border-gray-200 dark:border-gray-700 pl-4" : ""}`}
          >
            <div className="flex items-start gap-3">
              <img
                src={author.photoURL || "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt="avatar"
              />
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/community/user/${author.displayName || "user"}`}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {author.displayName || "User"}
                    </Link>
                    {hasReplies && (
                      <button
                        onClick={() => toggleCollapse(c.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                        aria-label={isCollapsed ? "Expand replies" : "Collapse replies"}
                      >
                        {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(c.createdAt.seconds * 1000).toLocaleString()}
                    {c.updatedAt && " (edited)"}
                  </span>
                </div>

                {editingComment === c.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full mt-2 p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleEdit}
                        className="text-sm px-3 py-1 rounded bg-green-600 text-white flex items-center gap-1"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 flex items-center gap-1"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{c.text}</p>
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => {
                          setReplyTo(c.id);
                          setReplyTextMap((prev) => ({ ...prev, [c.id]: "" }));
                        }}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                      >
                        <FaReply /> Reply
                      </button>
                      {isUser && (
                        <>
                          <button
                            onClick={() => {
                              setEditingComment(c.id);
                              setEditText(c.text);
                            }}
                            className="text-xs flex items-center gap-1 text-yellow-600 hover:text-yellow-800 dark:hover:text-yellow-400"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {replyTo === c.id && (
                  <div className="mt-3">
                    <textarea
                      value={replyTextMap[c.id] || ""}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                      className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Write your reply..."
                      rows="3"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReplySubmit(c.id)}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => setReplyTo(null)}
                        className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {hasReplies && !isCollapsed && (
              <div className="ml-4">
                {renderComments(c.id, depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!post) return <div className="p-6 text-red-600">Post not found</div>;

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
        <span>
          {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
        </span>
        {post.tags?.length > 0 && (
          <>
            <span>•</span>
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none">{post.content}</div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleSubmit} ref={commentFormRef} className="mb-6">
            <textarea
              className="w-full border p-3 rounded dark:bg-gray-800 dark:border-gray-700"
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 transition-colors"
              disabled={!commentText.trim()}
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                log in
              </Link>{" "}
              to comment.
            </p>
          </div>
        )}

        <div className="space-y-4">{renderComments()}</div>
      </section>
    </main>
  );
}