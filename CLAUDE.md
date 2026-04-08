# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

CashMan Backend — NestJS 11과 Prisma 7(MySQL/MariaDB) 기반의 가계부 API. 사용자 계좌, 거래내역, 카테고리를 관리하며 멀티 디바이스 OAuth 인증을 지원한다.

## 주요 명령어

- `npm run start:dev` — 개발 서버 (watch 모드)
- `npm run build` — Nest CLI로 `dist/`에 빌드
- `npm run lint` — ESLint 자동 수정 포함 실행
- `npm run format` — Prettier 포맷팅
- `npm run test` — 단위 테스트 (Jest, `src/` 내 `*.spec.ts`)
- `npm run test:e2e` — E2E 테스트 (supertest, `test/` 디렉토리)
- `npm run test:watch` — 단위 테스트 watch 모드
- `npm run test:cov` — 커버리지 리포트 포함 단위 테스트

## 아키텍처

**모듈 구조:** 각 기능은 `src/` 아래 독립된 NestJS 모듈로 구성되며, 컨트롤러, 서비스, DTO, 엔티티를 포함한다. 루트 `AppModule`이 기능 모듈들을 임포트한다.

**현재 모듈:**
- `auth/` — OAuth 인증 (Google 제공자, Kakao/Naver/Apple 확장 가능)
- `users/` — 사용자 CRUD

**데이터베이스 (Prisma + MySQL):**
- 스키마: `prisma/schema/schema.prisma`, 마이그레이션: `prisma/migrations/`
- Prisma 설정: `prisma.config.ts`, 데이터소스는 `.env`의 `DATABASE_URL` 사용
- ID는 ULID 형식 (Char(26))
- 주요 모델: `user`, `user_auth`, `refresh_token`, `account`, `transaction`, `category`
- `account.balance`와 `transaction.amount`는 정밀도를 위해 BigInt 사용
- `user`는 `deletedAt` 필드를 통한 소프트 삭제 적용

**컨벤션:**
- DTO: 생성용 `CreateXxxDto`, 수정용 `UpdateXxxDto`는 `PartialType(CreateXxxDto)` 확장
- 단위 테스트는 소스 파일과 같은 위치 (`*.spec.ts`), E2E 테스트는 `test/`
- TypeScript 타겟 ES2023, 모듈 nodenext, 데코레이터 활성화
- `strictNullChecks: true`, `noImplicitAny: false`

## 코드 스타일

- ESLint flat config + TypeScript 타입 체크 + Prettier 통합
- 작은따옴표, 후행 쉼표 (`.prettierrc` 설정)
- `@typescript-eslint/no-explicit-any`는 off (any 허용)
- `@typescript-eslint/no-floating-promises`와 `no-unsafe-argument`는 warn