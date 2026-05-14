export const dynamic = 'force-dynamic';

import { getBlogsFromDB } from "@/lib/server-data";
import { BlogDetailClient } from "./BlogDetailClient";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogs = await getBlogsFromDB();
  const blog = blogs.find((b) => b.id === Number(id));
  if (!blog) notFound();
  return <BlogDetailClient blog={blog} />;
}
