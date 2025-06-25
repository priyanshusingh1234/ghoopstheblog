import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { title, body, user } = await req.json();

    if (!title || !body) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const userDetails = user
      ? `\n\nSubmitted by:\nName: ${user.name}\nEmail: ${user.email}`
      : "\n\nSubmitted by: Anonymous";

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "kpk22128@gmail.com",
      subject: `📝 New Article Submission: ${title}`,
      text: `${body}${userDetails}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Send error:", error);
    return Response.json({ error: "Failed to send" }, { status: 500 });
  }
}
