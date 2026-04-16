import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";
import { BlogFilter } from "@/components/blog-filter";

export const metadata = {
  title: "Blog | devlog",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <BlogFilter posts={posts} categories={categories} tags={tags} />
    </div>
  );
}
