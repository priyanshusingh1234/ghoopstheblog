"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/utils/firebase";
import ReactMarkdown from "react-markdown";
import Head from "next/head";

export default function SubmitArticlePage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const insertAtCursor = (value) => {
    const textarea = document.getElementById("markdown-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = body;
    const before = text.substring(0, start);
    const after = text.substring(end);
    setBody(before + value + after);
    setTimeout(() => textarea.focus(), 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setStatus("Please verify CAPTCHA.");
      return;
    }
    setStatus("Sending...");

    const res = await fetch("/api/send-article", {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        user: user
          ? {
              email: user.email,
              name: user.displayName || "Anonymous",
            }
          : null,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setTitle("");
      setBody("");
      setStatus("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } else {
      setStatus("Failed to submit your article. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Submit an Article | GhoopsTheBlog</title>
        <meta name="description" content="Submit original articles to GhoopsTheBlog using our markdown editor." />
      </Head>

      <main className="max-w-3xl mx-auto mt-16 px-6 py-10 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-3xl shadow-2xl relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Submit Your Article</h1>

        {showSuccess && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-full shadow-lg animate-fadeIn z-50">
            Article submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter a clear title"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Content</label>

            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap mb-2">
              <button type="button" onClick={() => insertAtCursor("# ")} className="toolbar-btn">H1</button>
              <button type="button" onClick={() => insertAtCursor("## ")} className="toolbar-btn">H2</button>
              <button type="button" onClick={() => insertAtCursor("**bold**")} className="toolbar-btn">Bold</button>
              <button type="button" onClick={() => insertAtCursor("*italic*")} className="toolbar-btn">Italic</button>
              <button type="button" onClick={() => insertAtCursor("[text](url)")} className="toolbar-btn">Link</button>
              <button type="button" onClick={() => insertAtCursor("```\ncode\n```")} className="toolbar-btn">Code</button>
            </div>

            <textarea
              id="markdown-editor"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              placeholder="Write your article using markdown..."
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="previewToggle"
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview(!showPreview)}
              className="w-4 h-4"
            />
            <label htmlFor="previewToggle" className="text-sm">Show Preview</label>
          </div>

          {showPreview && (
            <div className="p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-sm prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{body || "*Nothing to preview.*"}</ReactMarkdown>
            </div>
          )}

          <div className="mt-4">
            <label className="block mb-2 font-semibold">CAPTCHA</label>
            <div className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600">
              <input
                type="checkbox"
                id="captcha"
                onChange={(e) => setCaptchaVerified(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="captcha" className="text-sm">I am not a robot</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 flex justify-center items-center gap-2"
            disabled={status === "Sending..."}
          >
            {status === "Sending..." && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {status === "Sending..." ? "Submitting..." : "Submit Article"}
          </button>

          {status && status !== "Sending..." && (
            <p className="text-center text-red-500 text-sm font-medium mt-2">{status}</p>
          )}
        </form>

        {user && (
          <div className="mt-8 text-sm text-center text-zinc-500">
            Logged in as <span className="font-medium underline underline-offset-2 decoration-blue-500">{user.displayName || user.email}</span>
          </div>
        )}
      </main>

      <style jsx>{`
        .toolbar-btn {
          background: #f1f1f1;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.8rem;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        .toolbar-btn:hover {
          background-color: #e4e4e4;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
