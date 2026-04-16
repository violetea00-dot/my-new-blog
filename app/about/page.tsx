import { getAboutContent } from "@/lib/posts";

export const metadata = {
  title: "About | devlog",
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <article
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
