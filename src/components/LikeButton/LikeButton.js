"use client";

import { useEffect } from "react";

export default function LikeButton({ identifier }) {
  useEffect(() => {
    // Load LikeBtn script only once
    if (!window.LikeBtn) {
      const script = document.createElement("script");
      script.src = "//w.likebtn.com/js/w/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-2">
      <span
        className="likebtn-wrapper"
        data-theme="custom"
        data-identifier={identifier}
        data-counter_show="true"
        data-counter_clickable="true"
      ></span>
    </div>
  );
}
