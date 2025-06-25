// src/app/submit/page.js
import SubmitArticleClient from "./SubmitArticleClient";

export const metadata = {
  title: "Submit an Article | GhoopsTheBlog",
  description: "Submit original articles to GhoopsTheBlog using our markdown editor.",
  alternates: {
    canonical: "https://ghoopstheblog.vercel.app/submit",
  },
  openGraph: {
    title: "Submit an Article | GhoopsTheBlog",
    description: "Write and submit your original articles to GhoopsTheBlog using our easy markdown editor.",
    url: "https://ghoopstheblog.vercel.app/submit",
    siteName: "GhoopsTheBlog",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Submit an Article | GhoopsTheBlog",
    description: "Share your thoughts with the world by submitting your articles to GhoopsTheBlog.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubmitPage() {
  return <SubmitArticleClient />;
}
