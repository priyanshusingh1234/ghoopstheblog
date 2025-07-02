import { createClient } from '@supabase/supabase-js';
import { blogs } from "@/.velite/generated";
import Link from "next/link";
import Image from "next/image";
import siteMetadata from "@/src/utils/siteMetaData";

// 🔐 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🕒 Timeout helper
function withTimeout(promise, ms = 5000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Supabase Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// 🔍 SEO Metadata
export async function generateMetadata() {
  const title = "Trending Posts | " + siteMetadata.title;
  const description = "See the most popular blog posts based on views.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteMetadata.siteUrl}/trending`,
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteMetadata.socialBanner],
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/trending`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function TrendingPage() {
  let views = [];

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("views")
        .select("*")
        .order("count", { ascending: false })
        .limit(10)
    );

    if (error) {
      console.error("❌ Supabase error:", error.message);
    } else {
      views = data;
    }
  } catch (err) {
    console.error("❌ Supabase timeout or error:", err.message);
  }

  // 📈 Merge views with blog data
  const trendingBlogs = views
    .map((v) => {
      const blog = blogs.find((b) => b.slug === v.slug);
      return blog ? { ...blog, views: v.count } : null;
    })
    .filter(Boolean);

  return (
    <main className="min-h-screen p-6 bg-light dark:bg-dark text-dark dark:text-light">
      <h1 className="text-3xl font-bold mb-8 text-center">🔥 Trending Posts</h1>

      {trendingBlogs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No trending posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trendingBlogs.map((blog) => {
            const imageUrl = blog.image?.src?.startsWith("http")
              ? blog.image.src
              : blog.image?.src
                ? siteMetadata.siteUrl + blog.image.src
                : siteMetadata.socialBanner;

            return (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group">
                <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-800 transition hover:shadow-2xl relative">
                  
                  {/* 👁 View Count Badge */}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
                    👁 {blog.views || 0}
                  </div>

                  {/* 🖼 Blog Image */}
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>

                  {/* 📝 Blog Info */}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:underline">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {blog.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
