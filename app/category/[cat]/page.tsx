import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({ cat: encodeURIComponent(c.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  return { title: `${decodeURIComponent(cat)} | devlog` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const categoryName = decodeURIComponent(cat);
  const posts = getPostsByCategory(categoryName);
  if (posts.length === 0) notFound();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
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
