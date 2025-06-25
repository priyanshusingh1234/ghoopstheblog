"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to get an article approved?",
    answer:
      "We usually review submissions within 24–48 hours. You'll be notified via email once your article is approved or if changes are required.",
  },
  {
    question: "What are the article approval criteria?",
    answer:
      "We evaluate content based on originality, clarity, relevance, and adherence to our writing guidelines. Plagiarism or AI-generated spam will lead to rejection.",
  },
  {
    question: "Can I edit my article after submission?",
    answer:
      "No. Once submitted, articles can only be edited after review. If changes are needed, we'll reach out to you before publishing.",
  },
  {
    question: "Will I be credited as the author?",
    answer:
      "Yes. Your name (and profile picture if available) will appear on your published article. Verified authors get a badge as well.",
  },
  {
    question: "How do I become a verified author?",
    answer:
      "Writers with consistently high-quality submissions or who are invited by admins can earn the verified badge.",
  },
  {
    question: "What formatting is supported?",
    answer:
      "We support Markdown formatting. You can use headings, bold, italic, lists, links, and code blocks in your article.",
  },
];

export default function FaqsWriter() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Writer FAQs</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900"
          >
            <button
              onClick={() => toggle(i)}
              className="flex justify-between items-center w-full p-4 text-left text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              {faq.question}
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
