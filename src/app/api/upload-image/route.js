// /api/upload-image/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const fileName = formData.get("fileName");

  if (!file || !fileName) {
    return NextResponse.json({ error: "Missing file or fileName" }, { status: 400 });
  }

  // 🔐 Generate signature
  const token = crypto.randomBytes(16).toString("hex");
  const expire = Math.floor(Date.now() / 1000) + 60 * 10;
  const signature = crypto
    .createHmac("sha1", IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("fileName", fileName);
  uploadForm.append("publicKey", IMAGEKIT_PUBLIC_KEY);
  uploadForm.append("signature", signature);
  uploadForm.append("expire", expire.toString());
  uploadForm.append("token", token);
  uploadForm.append("useUniqueFileName", "true");

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: uploadForm,
  });

  const text = await uploadRes.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json({
      url: json.url,
      fileId: json.fileId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "ImageKit upload failed", response: text },
      { status: 500 }
    );
  }
}
