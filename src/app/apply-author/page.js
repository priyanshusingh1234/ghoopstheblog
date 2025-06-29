"use client";

import { useState } from "react";
import { auth, db } from "@/src/utils/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ApplyAuthorPage() {
  const [why, setWhy] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Save application
    const applicationRef = doc(db, "authorApplications", user.uid);
    await setDoc(applicationRef, {
      uid: user.uid,
      email: user.email,
      why,
      portfolio,
      status: "pending",
      submittedAt: new Date(),
    });

    // 🔹 Add entry to authors collection (used in blog display)
    const authorRef = doc(db, "authors", user.uid);
    await setDoc(authorRef, {
      uid: user.uid,
      email: user.email,
      is_verified: false,
      joinedAt: new Date(),
    });

    setSubmitted(true);
    setWhy("");
    setPortfolio("");
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
        <div className="bg-zinc-800 rounded-xl p-8 max-w-md w-full shadow-lg text-center">
          <h1 className="text-2xl font-bold text-green-400 mb-3">
            ✅ Application Submitted
          </h1>
          <p className="text-gray-300">
            Thank you! We’ll review your application and get back to you soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
      <div className="bg-zinc-800 rounded-xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Apply to Become an Author
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Why do you want to become an author?
            </label>
            <textarea
              className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Explain your motivation..."
              required
              rows={4}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Your Portfolio / Blog URL
            </label>
            <input
              type="url"
              className="w-full p-3 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-portfolio.com"
              required
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2.5 rounded-md transition-all text-white font-semibold ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}
