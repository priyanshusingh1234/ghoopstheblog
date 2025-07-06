// src/app/api/report/route.js
import { db } from "@/src/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { slug, reason } = body;

    if (!slug || !reason) {
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
    }

    await addDoc(collection(db, "reportedArticles"), {
      slug,
      reason,
      createdAt: serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error reporting article:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
