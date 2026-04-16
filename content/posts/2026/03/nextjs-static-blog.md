---
title: "Next.js App Router로 정적 블로그 만들기"
date: "2026-03-25"
category: "웹개발"
tags: ["Next.js", "TypeScript", "Tailwind", "정적사이트"]
summary: "Next.js output export 옵션을 활용해 GitHub Pages에 배포 가능한 정적 블로그를 만드는 과정을 정리합니다."
published: true
---

## 왜 Next.js인가?

정적 블로그 생성기로는 Jekyll, Hugo, Astro 등이 있지만, 이미 React와 Next.js에 익숙하다면 **Next.js의 `output: 'export'` 옵션**이 가장 편합니다.

## 핵심 설정

### next.config.ts

```typescript
const nextConfig = {
  output: 'export',        // 정적 파일로 빌드
  basePath: '/my-blog',    // GitHub Pages 저장소명
  images: {
    unoptimized: true,     // 정적 빌드에서 이미지 최적화 비활성화
  },
}
```

### Markdown 파싱 파이프라인

gray-matter로 frontmatter를 파싱하고, unified/remark/rehype 체인으로 HTML을 생성합니다.

```typescript
const processed = await unified()
  .use(remarkParse)
  .use(remarkGfm)           // GitHub Flavored Markdown (표, 체크박스 등)
  .use(remarkRehype)
  .use(rehypePrettyCode, {  // 코드 하이라이팅
    theme: 'github-dark',
  })
  .use(rehypeStringify)
  .process(markdownContent)
```

## GitHub Actions 자동 배포

`.github/workflows/deploy.yml` 파일 하나로 main push 시 자동 배포가 가능합니다.

```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
```

## Tailwind Typography

`@tailwindcss/typography` 플러그인의 `prose` 클래스를 사용하면 Markdown 렌더링 결과물을 별도 CSS 없이 아름답게 표시할 수 있습니다.

```html
<article class="prose prose-lg dark:prose-invert max-w-none">
  <!-- Markdown HTML 삽입 -->
</article>
```
