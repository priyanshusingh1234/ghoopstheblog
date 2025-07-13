// Make sure you are on Next.js 13+ App Router

export async function POST(req) {
  const { fileId } = await req.json();

  if (!fileId) {
    return new Response(JSON.stringify({ error: "Missing fileId" }), { status: 400 });
  }

  const privateKey = "private_SS5MyMq/zlKyWSvEupu77XlQOk0="; // 🔒 your ImageKit private API key
  const encodedKey = Buffer.from(privateKey + ":").toString("base64");

  const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${encodedKey}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), { status: res.status });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
