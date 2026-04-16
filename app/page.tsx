import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 5);
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="space-y-16 py-8">
      {/* 히어로 */}
      <section className="flex items-center gap-6">
        <Image
          src="/my-new-blog/blogicon.png"
          alt="devlog 아이콘"
          width={80}
          height={80}
          className="rounded-2xl shadow-md flex-shrink-0"
        />
        <div>
          <h1 className="text-3xl font-bold mb-3">
            안녕하세요 ✦ <span className="text-[var(--accent)]">devlog</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
            개발과 배움을 기록하는 공간입니다. AI 도구, 웹 개발, 그리고 새로운 것들을 탐구합니다.
          </p>
        </div>
      </section>

      {/* 최신 포스트 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">최신 포스트</h2>
          <Link href="/blog" className="text-sm text-[var(--accent)] hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* 카테고리 */}
      <section>
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {cat.name}
              <span className="bg-[var(--accent)] text-white text-xs px-1.5 py-0.5 rounded-full">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 태그 */}
      <section>
        <h2 className="text-xl font-bold mb-4">태그</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className="px-3 py-1 rounded-md border border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-60">{tag.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
