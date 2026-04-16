import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  published: boolean;
  slug: string;
  year: string;
  month: string;
}

export interface Post extends PostMeta {
  content: string;
}

// content/posts 아래 모든 .md 파일 경로 수집
function getAllMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

// 파일 경로 → { year, month, slug } 추출
function parseFilePath(filePath: string): {
  year: string;
  month: string;
  slug: string;
} {
  const relative = path.relative(POSTS_DIR, filePath);
  const parts = relative.replace(/\\/g, "/").split("/");
  // 예: 2026/04/my-post.md
  const year = parts[0];
  const month = parts[1];
  const slug = parts[2].replace(/\.md$/, "");
  return { year, month, slug };
}

// 단일 파일 → PostMeta 파싱
function parsePostMeta(filePath: string): PostMeta | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const { year, month, slug } = parseFilePath(filePath);
    return {
      title: data.title ?? slug,
      date: data.date ?? `${year}-${month}-01`,
      category: data.category ?? "미분류",
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary ?? "",
      published: data.published !== false,
      slug,
      year,
      month,
    };
  } catch {
    return null;
  }
}

// 전체 포스트 목록 (published만, 날짜 역순)
export function getAllPosts(): PostMeta[] {
  const files = getAllMdFiles(POSTS_DIR);
  const posts = files
    .map((f) => parsePostMeta(f))
    .filter((p): p is PostMeta => p !== null && p.published)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  return posts;
}

// 단일 포스트 (Markdown → HTML 변환 포함)
export async function getPostBySlug(
  year: string,
  month: string,
  slug: string
): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, year, month, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: mdContent } = matter(raw);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: { dark: "github-dark", light: "github-light" },
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(mdContent);

  const content = processed.toString();

  return {
    title: data.title ?? slug,
    date: data.date ?? `${year}-${month}-01`,
    category: data.category ?? "미분류",
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: data.summary ?? "",
    published: data.published !== false,
    slug,
    year,
    month,
    content,
  };
}

// 모든 태그 목록 (포스트 수 포함)
export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 모든 카테고리 목록 (포스트 수 포함)
export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 태그로 필터
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

// 카테고리로 필터
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

// 월별 아카이브 목록
export function getArchiveByMonth(): { year: string; month: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    const key = `${post.year}/${post.month}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => {
      const [year, month] = key.split("/");
      return { year, month, count };
    })
    .sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`));
}

// generateStaticParams용 — 전체 포스트 경로
export function getAllPostParams() {
  return getAllPosts().map((p) => ({
    year: p.year,
    month: p.month,
    slug: p.slug,
  }));
}

// About 페이지 Markdown → HTML
export async function getAboutContent(): Promise<string> {
  const filePath = path.join(process.cwd(), "content/about.md");
  if (!fs.existsSync(filePath)) return "";
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content: mdContent } = matter(raw);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(mdContent);

  return processed.toString();
}
