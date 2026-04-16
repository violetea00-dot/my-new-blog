---
title: "GitHub Copilot Agent 모드로 풀스택 앱 만들기"
date: "2026-04-17"
category: "개발도구"
tags: ["Copilot", "Next.js", "Supabase", "Vercel"]
summary: "GitHub Copilot의 Agent 모드를 활용해 테트리스 게임과 카드 뒤집기 게임을 빠르게 만들고 배포한 과정을 공유합니다."
published: true
---

## 개요

요즘 AI 코딩 도구의 발전이 정말 빠릅니다. 그 중에서도 **GitHub Copilot의 Agent 모드**는 단순한 코드 자동완성을 넘어, 파일 생성·수정·터미널 명령까지 자율적으로 수행합니다.

이번 글에서는 Copilot을 활용해 두 가지 게임을 만들고 Vercel에 배포한 과정을 정리합니다.

## Copilot의 3가지 모드

### Ask 모드
채팅처럼 질문하고 답변을 받는 모드입니다. 코드를 설명하거나 에러 원인을 분석할 때 주로 사용합니다.

### Plan 모드
AI가 작업 계획을 먼저 제시하고 사람이 승인한 후 실행됩니다. 큰 변경 전에 안전하게 검토할 수 있습니다.

### Agent 모드
AI가 자율적으로 전체 작업을 수행합니다.

```typescript
// Agent 모드로 Supabase 연동 코드를 자동 생성한 예시
const { data, error } = await supabase
  .from('scores')
  .select('nickname, score')
  .order('score', { ascending: false })
  .limit(10)
```

## MCP로 AI에 손발을 달아주기

MCP(Model Context Protocol)를 통해 Copilot이 Supabase 데이터베이스를 직접 조작할 수 있습니다.

Smithery에서 Supabase MCP를 설치하고, 다음처럼 채팅하면:

> "scores 테이블 만들어줘. user_id, nickname, score 컬럼이 필요해."

Copilot이 SQL을 한 줄도 쓰지 않고 테이블을 생성합니다.

## 결과

- 테트리스 게임: [my-tetris-game-eta.vercel.app](https://my-tetris-game-eta.vercel.app)
- 카드게임: [my-card-game-ashy.vercel.app](https://my-card-game-ashy.vercel.app)

두 프로젝트 모두 GitHub에 push하면 Vercel이 자동으로 빌드·배포합니다.
