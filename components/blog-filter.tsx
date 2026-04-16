"use client";

import { useState } from "react";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";

interface Props {
  posts: PostMeta[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

export function BlogFilter({ posts, categories, tags }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeTag && !p.tags.includes(activeTag)) return false;
    return true;
  });

  const toggle = (
    value: string,
    current: string | null,
    setter: (v: string | null) => void,
    other: (v: string | null) => void
  ) => {
    setter(current === value ? null : value);
    other(null);
  };

  return (
    <div className="space-y-8">
      {/* 카테고리 필터 */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
          카테고리
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => toggle(cat.name, activeCategory, setActiveCategory, setActiveTag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.name
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--accent-light)] text-[var(--accent)] hover:opacity-80"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* 태그 필터 */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
          태그
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => toggle(tag.name, activeTag, setActiveTag, setActiveCategory)}
              className={`px-3 py-1 rounded-md text-sm transition-colors border ${
                activeTag === tag.name
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-light)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div>
        {(activeCategory || activeTag) && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              {filtered.length}개 포스트
            </p>
            <button
              onClick={() => { setActiveCategory(null); setActiveTag(null); }}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {filtered.length === 0 && (
            <p className="text-[var(--muted-foreground)] text-center py-12">
              포스트가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
