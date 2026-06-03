"use client";

import Link from "next/link";
import { ImageDisplay } from "@/components/ImageDisplay";
import { type Blog } from "@/lib/data";

interface BlogsClientProps {
  initialBlogs: Blog[];
}

export function BlogsClient({ initialBlogs }: BlogsClientProps) {
  return (
    <main className="min-h-screen">
      <section className="relative w-full overflow-hidden lg:aspect-[2500/500]">
        <img
          src="https://res.cloudinary.com/dlt9vf8qk/image/upload/v1780418023/Blogs_nfwxdu.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative lg:absolute lg:inset-0 flex items-center justify-center pt-24 pb-10 lg:py-0">
          <div className="container mx-auto px-4 lg:px-8 lg:pt-16">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block font-semibold text-sm tracking-wider mb-4" style={{ color: '#ffffff' }}>Blogs</span>
              <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>Latest Insights &amp; Articles</h1>
              <p className="text-sm lg:text-lg" style={{ color: '#ffffff' }}>Explore our latest blog posts and stay updated with industry insights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {initialBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blogs published yet.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {initialBlogs.map((blog, index) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <ImageDisplay src={blog.image} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 lg:p-8">
                    <p className="text-foreground leading-relaxed line-clamp-3">{blog.content}</p>
                    <p className="text-accent text-sm font-medium mt-4">Read more →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
