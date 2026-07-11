export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getBlogsFromDB } from "@/lib/server-data";
import { BlogDetailClient } from "./BlogDetailClient";
import { notFound } from "next/navigation";

function excerptFrom(content: string, maxLength: number): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blogs = await getBlogsFromDB();
  const blog = blogs.find((b) => b.id === Number(id));
  if (!blog) return {};

  const title = excerptFrom(blog.content, 60);
  const description = excerptFrom(blog.content, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogs = await getBlogsFromDB();
  const blog = blogs.find((b) => b.id === Number(id));
  if (!blog) notFound();
  return <BlogDetailClient blog={blog} />;
}
