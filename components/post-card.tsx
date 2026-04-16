"use client";

import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const href = `/blog/${post.year}/${post.month}/${post.slug}`;
  const formattedDate = format(new Date(post.date), "yyyy년 M월 d일", { locale: ko });

  return (
    <article className="group">
      <div className="py-6 border-b border-[var(--border)] transition-all">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
          >
            {post.category}
          </Link>
          <time className="text-xs text-[var(--muted-foreground)]">{formattedDate}</time>
        </div>
        <Link href={href} className="block">
          <h2 className="text-lg font-bold mb-1.5 group-hover:text-[var(--accent)] transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>
        {post.summary && (
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
            {post.summary}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
