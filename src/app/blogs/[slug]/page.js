import { blogs } from "@/.velite/generated";
import siteMetadata from "@/src/utils/siteMetaData";
import { slug as slugify } from "github-slugger";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BlogDetails from "@/src/components/Blog/BlogDetails";
import RenderMdx from "@/src/components/Blog/RenderMdx";
import Tag from "@/src/components/Elements/Tag";
import GiscusComment from "@/src/components/GiscusComment/GiscusComment";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import LikeButton from "@/src/components/LikeButton/LikeButton"; // ✅ Added

function TableOfContentsItem({ item, level = "two" }) {
  return (
    <li className="py-1">
      <a
        href={item.url}
        data-level={level}
        className="data-[level=two]:pl-0 data-[level=two]:pt-2 data-[level=two]:border-t border-solid border-dark/40 data-[level=three]:pl-4 sm:data-[level=three]:pl-6 flex items-center justify-start"
      >
        {level === "three" && (
          <span className="flex w-1 h-1 rounded-full bg-dark mr-2" />
        )}
        <span className="hover:underline">{item.title}</span>
      </a>
      {item.items?.length > 0 && (
        <ul className="mt-1">
          {item.items.map((subItem) => (
            <TableOfContentsItem key={subItem.url} item={subItem} level="three" />
          ))}
        </ul>
      )}
    </li>
  );
}

function getRandomBlog(currentSlug) {
  const otherBlogs = blogs.filter((b) => b.slug !== currentSlug);
  const randomIndex = Math.floor(Math.random() * otherBlogs.length);
  return otherBlogs[randomIndex];
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const blog = blogs.find((blog) => blog.slug === slug);
  if (!blog) return;

  const publishedAt = new Date(blog.publishedAt).toISOString();
  const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  let imageList = [siteMetadata.socialBanner];
  if (blog.image?.src) {
    imageList = [blog.image.src.startsWith("http") ? blog.image.src : siteMetadata.siteUrl + blog.image.src];
  }

  const ogImages = imageList.map((img) => ({
    url: img.includes("http") ? img : siteMetadata.siteUrl + img,
  }));

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: siteMetadata.siteUrl + "/blogs/" + blog.slug,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: [blog.author || siteMetadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: ogImages.map((img) => img.url),
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blogs/${slug}`,
    },
  };
}

export default async function BlogPage({ params }) {
  const slug = params?.slug;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) notFound();

  const randomBlog = getRandomBlog(slug);

  const imageUrl = blog.image?.src?.startsWith("http")
    ? blog.image.src
    : siteMetadata.siteUrl + blog.image?.src;

  const randomBlogImage = randomBlog.image?.src?.startsWith("http")
    ? randomBlog.image.src
    : siteMetadata.siteUrl + (randomBlog.image?.src || siteMetadata.socialBanner);

  let authorName = "Unknown Author";
  let isVerified = false;

  if (blog.author) {
    const authorRef = doc(db, "authors", blog.author);
    const authorSnap = await getDoc(authorRef);
    if (authorSnap.exists()) {
      const data = authorSnap.data();
      authorName = data.email || "Unknown Author";
      isVerified = data.is_verified || false;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    image: [imageUrl],
    datePublished: new Date(blog.publishedAt).toISOString(),
    dateModified: new Date(blog.updatedAt || blog.publishedAt).toISOString(),
    author: [
      {
        "@type": "Person",
        name: authorName,
        url: siteMetadata.siteUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
          <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Tag
              name={blog.tags[0]}
              link={`/categories/${slugify(blog.tags[0])}`}
              className="px-6 text-sm py-2"
            />
            <h1 className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6">
              {blog.title}
            </h1>

            {/* ✅ Like and Meta Info */}
            <div className="mt-3 text-light text-sm flex items-center justify-center gap-3">
              <span>By {authorName}</span>
              {isVerified && (
                <span title="Verified Author" className="inline-block w-5 h-5">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="#22c55e" />
                    <path d="M35 52 l12 12 20 -24" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}

              {/* 🔥 Like Button at top beside author */}
              <LikeButton slug={slug} />
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
          <Image
            src={imageUrl}
            alt={blog.title}
            width={blog.image?.width || 1200}
            height={blog.image?.height || 600}
            className="aspect-square w-full h-full object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        <BlogDetails blog={blog} slug={slug} />

        <div className="grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            <details className="border border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-y-auto" open>
              <summary className="text-lg font-semibold capitalize cursor-pointer">Table Of Content</summary>
              <ul className="mt-4 font-in text-base">
                {blog.toc.map((item) => (
                  <TableOfContentsItem key={item.url} item={item} />
                ))}
              </ul>
            </details>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <RenderMdx blog={blog} />
          </div>
        </div>

        <div className="mt-24 px-5 md:px-10">
          <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
          <Link
            href={`/blogs/${randomBlog.slug}`}
            className="group block relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
          >
            <Image
              src={randomBlogImage}
              alt={randomBlog.title}
              width={randomBlog.image?.width || 1200}
              height={randomBlog.image?.height || 600}
              className="w-full h-[250px] object-cover object-center transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition" />
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h3 className="text-xl font-semibold">{randomBlog.title}</h3>
              <p className="text-sm opacity-80 mt-1">{randomBlog.description}</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 px-5 md:px-10">
          <GiscusComment />
        </div>
      </article>
    </>
  );
}
