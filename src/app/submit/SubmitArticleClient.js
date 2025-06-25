"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/utils/firebase";
import ReactMarkdown from "react-markdown";
import FaqsWriter from "@/src/components/FaqsWriter/FaqsWriter";

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
      if (!currentUser) window.location.href = "/login";
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const insertAtCursor = (value) => {
    const textarea = document.getElementById("markdown-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = body.substring(0, start);
    const after = body.substring(end);
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

          <div className="flex gap-2 flex-wrap mb-2">
            {[
              { label: "H1", syntax: "# " },
              { label: "H2", syntax: "## " },
              { label: "Bold", syntax: "**bold**" },
              { label: "Italic", syntax: "*italic*" },
              { label: "Link", syntax: "[text](url)" },
              { label: "Code", syntax: "```\ncode\n```" },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => insertAtCursor(btn.syntax)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition border border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                {btn.label}
              </button>
            ))}
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
      <FaqsWriter/>
    </main>
  );
}
