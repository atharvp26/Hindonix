export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getBlogsFromDB } from "@/lib/server-data";
import { BlogsClient } from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog - Architectural Hardware Insights",
  description:
    "Articles and insights from Hindonix on architectural hardware, door handles, door knobs, materials, and finishes.",
};

export default async function BlogsPage() {
  const blogs = await getBlogsFromDB();
  return <BlogsClient initialBlogs={blogs} />;
}
