import siteMetadata from "@/src/utils/siteMetaData";
import LoginClient from "./LoginClient"; // ✅ Direct import works because it's a client component

export const metadata = {
  title: "Login | " + siteMetadata.title,
  description: "Access your account by logging into the platform.",
  openGraph: {
    title: "Login | " + siteMetadata.title,
    description: "Access your account by logging into the platform.",
    url: `${siteMetadata.siteUrl}/login`,
    images: [siteMetadata.socialBanner],
  },
  twitter: {
    title: "Login | " + siteMetadata.title,
    description: "Access your account by logging into the platform.",
    images: [siteMetadata.socialBanner],
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <LoginClient />
    </main>
  );
}
