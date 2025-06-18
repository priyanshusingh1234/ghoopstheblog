"use client";
import Giscus from "@giscus/react";
import React, { useState } from "react";


export default function GiscusComment() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-12 text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in">
      <p className="mb-6">
        Have questions, feedback, or want to discuss the article? Drop a comment below!
      </p>

      <div className="border border-dark dark:border-light rounded-lg p-4">
        <Giscus
          id="comments"
          repo="priyanshusingh1234/ghoopstheblog"
          repoId="R_kgDOOvvWBw"
          category="General"
          categoryId="DIC_kwDOOvvWB84CrqEm"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="en"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {loaded && (
        <p className="mt-4 text-green-500">💬 Comments loaded successfully!</p>
      )}
    </div>
  );
}
