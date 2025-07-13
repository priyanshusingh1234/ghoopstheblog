// components/RemirrorEditor.js
"use client";

import {
  Remirror,
  ThemeProvider,
  useRemirror,
  EditorComponent,
  useRemirrorContext,
} from "@remirror/react";

import { BoldExtension } from "@remirror/extension-bold";
import { ItalicExtension } from "@remirror/extension-italic";
import { UnderlineExtension } from "@remirror/extension-underline";
import { HeadingExtension } from "@remirror/extension-heading";

function EditorToolbar() {
  const { commands } = useRemirrorContext();

  return (
    <div className="flex gap-2 mb-3 bg-gray-100 p-2 rounded border">
      <button
        type="button"
        onClick={() => commands.toggleBold()}
        className="px-2 py-1 rounded bg-white border hover:bg-gray-200 font-bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => commands.toggleItalic()}
        className="px-2 py-1 rounded bg-white border hover:bg-gray-200 italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => commands.toggleUnderline()}
        className="px-2 py-1 rounded bg-white border hover:bg-gray-200 underline"
      >
        U
      </button>
      <button
        type="button"
        onClick={() => commands.toggleHeading({ level: 2 })}
        className="px-2 py-1 rounded bg-white border hover:bg-gray-200"
      >
        H2
      </button>
    </div>
  );
}

export default function RemirrorEditor({ onChange }) {
  const extensions = () => [
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new HeadingExtension(),
  ];

  const { manager, state } = useRemirror({
    extensions,
    content: "<p>Start writing...</p>",
    stringHandler: "html",
  });

  return (
    <ThemeProvider>
      <Remirror manager={manager} state={state} onChange={({ helpers }) => onChange(helpers.getHTML())}>
        <div className="border rounded p-3 bg-white min-h-[300px]">
          <EditorToolbar />
          <EditorComponent />
        </div>
      </Remirror>
    </ThemeProvider>
  );
}
