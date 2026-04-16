---
title: "Supabase 시작하기 — 5분 만에 백엔드 세팅"
date: "2026-04-10"
category: "백엔드"
tags: ["Supabase", "PostgreSQL", "Auth", "RLS"]
summary: "Supabase로 DB, 인증, 권한 제어를 빠르게 세팅하는 방법을 정리합니다. 일반 DBMS와의 차이도 함께 설명합니다."
published: true
---

## Supabase란?

Supabase는 오픈소스 Firebase 대안으로, PostgreSQL을 기반으로 합니다.

| 기능 | 일반 DBMS | Supabase |
|---|---|---|
| 서버 설치 | 직접 서버 구매·설치 | 불필요 (완전 관리형) |
| API 서버 | Express / Django 개발 필요 | REST & GraphQL 자동 생성 |
| Auth | JWT / OAuth 직접 구현 | 익명·소셜·이메일 내장 |
| 접근 제어 | 미들웨어 코드 작성 | RLS — SQL 정책 한 줄 |

## 바로 시작하기

### 1. 프로젝트 생성
[supabase.com](https://supabase.com)에서 무료 계정을 만들고 프로젝트를 생성합니다.

### 2. 테이블 생성 (SQL 에디터)

```sql
create table scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  nickname text not null,
  score integer not null,
  created_at timestamp with time zone default now()
);
```

### 3. RLS 설정

```sql
-- 본인만 INSERT 가능
create policy "users can insert own scores"
  on scores for insert
  with check (auth.uid() = user_id);

-- 모든 사람이 읽기 가능
create policy "scores are public"
  on scores for select using (true);
```

### 4. 클라이언트 연동

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 익명 로그인
await supabase.auth.signInAnonymously()

// 점수 저장
await supabase.from('scores').insert({ user_id, nickname, score })
```

## 무료 플랜 한도

- DB 500MB
- 월 50,000 MAU
- 스토리지 1GB

사이드 프로젝트나 학습 용도로는 충분합니다.
