"use client";
import { useState } from "react";

export default function ReportButton({ slug }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!reason.trim()) return;

        try {
            const res = await fetch("/api/report", {
                method: "POST",
                body: JSON.stringify({ slug, reason }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to submit report.");

            setSubmitted(true);
            setReason("");
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-medium transition"
            >
                🚩 Report Article
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold mb-3 text-black dark:text-white">
                            Report this article
                        </h2>

                        {!submitted ? (
                            <>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="What's the issue with this article?"
                                    className="w-full border rounded p-3 mb-4 dark:bg-gray-800 dark:text-white"
                                    rows={4}
                                />

                                {error && (
                                    <p className="text-sm text-red-500 mb-2">{error}</p>
                                )}

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-green-600 font-medium">
                                ✅ Report submitted. Thank you!
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
