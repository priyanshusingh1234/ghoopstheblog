import siteMetadata from "@/src/utils/siteMetaData";
import { Metadata } from "next";
import SignUpClient from "./SignUpClient";

// ✅ Optional: Static metadata for SEO
export const metadata = {
  title: `Sign Up | ${siteMetadata.title}`,
  description: "Create your account and join our growing community!",
  openGraph: {
    title: `Sign Up | ${siteMetadata.title}`,
    description: "Create your account and join our growing community!",
    url: `${siteMetadata.siteUrl}/sign-up`,
    siteName: siteMetadata.title,
    images: [
      {
        url: `${siteMetadata.siteUrl}/apple-icon.png`,
        width: 800,
        height: 600,
        alt: "Sign Up",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Sign Up | ${siteMetadata.title}`,
    description: "Create your account and join our growing community!",
    images: [`${siteMetadata.siteUrl}/apple-icon.png`],
  },
};

// ✅ Render the client component
export default function SignUpPage() {
  return <SignUpClient />;
}
