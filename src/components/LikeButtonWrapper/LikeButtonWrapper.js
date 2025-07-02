"use client";
import LikeButton from "../LikeButton/LikeButton";

export default function LikeButtonWrapper({ slug }) {
  if (!slug) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full border shadow text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21C12 21 5 14.75 5 9.75C5 6.5 7.5 4 10.5 4C12 4 13.5 5 14 6C14.5 5 16 4 17.5 4C20.5 4 23 6.5 23 9.75C23 14.75 16 21 16 21H12Z"
          />
        </svg>
        <span>Like</span>
        <span className="font-semibold">...</span>
      </button>
    );
  }

  return <LikeButton slug={slug} />;
}
