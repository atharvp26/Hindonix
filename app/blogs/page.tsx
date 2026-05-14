export const dynamic = 'force-dynamic';

import { getBlogsFromDB } from "@/lib/server-data";
import { BlogsClient } from "./BlogsClient";

export default async function BlogsPage() {
  const blogs = await getBlogsFromDB();
  return <BlogsClient initialBlogs={blogs} />;
}
