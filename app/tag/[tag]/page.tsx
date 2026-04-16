import { getPostsByTag, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({ tag: encodeURIComponent(t.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)} | devlog` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tagName = decodeURIComponent(tag);
  const posts = getPostsByTag(tagName);
  if (posts.length === 0) notFound();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-[var(--muted-foreground)] font-normal">#</span>
        {tagName}
      </h1>
      <p className="text-[var(--muted-foreground)] text-sm mb-8">
        {posts.length}개 포스트
      </p>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
