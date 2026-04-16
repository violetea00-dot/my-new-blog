import { getPostBySlug, getAllPostParams } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export async function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const post = await getPostBySlug(year, month, slug);
  if (!post) return {};
  return { title: `${post.title} | devlog` };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>;
}) {
  const { year, month, slug } = await params;
  const post = await getPostBySlug(year, month, slug);
  if (!post) notFound();

  const dateFormatted = format(new Date(post.date), "yyyy년 M월 d일", { locale: ko });

  return (
    <div className="py-8">
      {/* 뒤로가기 */}
      <Link href="/blog" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] mb-8 inline-block">
        ← 목록으로
      </Link>

      {/* 헤더 */}
      <header className="mb-10">
        <Link
          href={`/category/${encodeURIComponent(post.category)}`}
          className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-full"
        >
          {post.category}
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-3 leading-snug">{post.title}</h1>
        <p className="text-[var(--muted-foreground)] text-sm">{dateFormatted}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 본문 */}
      <article
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
