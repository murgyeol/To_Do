---
template: design
version: 1.2
description: PDCA Design phase document template (between Plan and Do) with Clean Architecture and Convention support
variables:
  - feature: Web Database Integration
  - date: 2026-03-27
  - author: Antigravity AI
  - project: To_Do
  - version: 1.0
---

# Web Database Integration Design Document

> **Summary**: bkend.ai 기반 서버리스 데이터베이스 연동 설계
>
> **Project**: To_Do
> **Version**: 1.0
> **Author**: Antigravity AI
> **Date**: 2026-03-27
> **Status**: Draft
> **Planning Doc**: [github-pages-db.plan.md](./github-pages-db.plan.md)

---

## 1. Overview

### 1.1 Design Goals

GitHub Pages 전용 정적 웹사이트(To_Do)에서 영구적인 데이터 저장을 위해 `bkend.ai` BaaS의 REST API를 연동합니다.

### 1.2 Design Principles

- 프론트엔드(`script.js`)에서 로컬 백엔드(`/api/todos`) 의존성을 완전히 분리
- REST API(`bkend.ai`)로 데이터 액세스 통합 관리
- HTML/JavaScript 바닐라 환경 유지

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  bkend.ai   │────▶│  Database   │
│ (script.js) │     │  REST API   │     │ (BaaS DB)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.2 Data Flow

```
사용자 인터페이스 (할 일 추가/완료/삭제) → script.js API fetch() 호출 → bkend.ai API → 응답 및 화면 업데이트
```

---

## 3. Data Model

### 3.1 Entity Definition

```javascript
// Todo Schema
const Todo = {
  id: "string",           // Unique identifier (bkend.ai generated)
  title: "string",        // 일정 제목
  date: "string",         // 일정 날짜 (YYYY-MM-DD format)
  desc: "string",         // 일정 상세 설명
  completed: "boolean",   // 완료 여부
  createdAt: "Date",      // 생성일
  updatedAt: "Date"       // 수정일
}
```

### 3.2 Database Schema (bkend.ai)

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| id | String | auto | auto | System generated ID (`id`) |
| title | String | yes | - | 일정 제목 |
| date | String | yes | - | 일정 날짜 (YYYY-MM-DD) |
| desc | String | no | - | 상세 설명 |
| completed | Boolean| no | - | 완료 여부 (기본값: false) |
| createdAt | Date | auto | - | Creation timestamp |
| updatedAt | Date | auto | - | Update timestamp |

---

## 4. API Specification

### BaaS API (Dynamic Level)

Dynamic level uses bkend.ai auto-generated REST API.
API prefix sample: `https://api.bkend.ai/v1/data/todos`

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/v1/data/todos` | List all todos | Optional (Environment-dependent) |
| GET | `/v1/data/todos/:id` | Get detail | Optional |
| POST | `/v1/data/todos` | Create | Optional |
| PATCH | `/v1/data/todos/:id` | Update | Optional |
| DELETE| `/v1/data/todos/:id` | Delete | Optional |

---

## 5. UI/UX Design

UI는 변경하지 않고 기존 투두리스트 화면(index.html, style.css)을 그대로 유지합니다.

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 4xx | Request failed | 데이터 무결성 또는 CORS/오리진 에러 | `showToast()`를 통해 "저장에 실패했습니다" 알람 표출 |
| 500 | Internal error | bkend.ai 서버 에러 | `showToast()` 노출 |

---

## 7. Security Considerations

- [ ] `API_BASE_URL` 엔드포인트 도메인은 프론트엔드 환경변수 혹은 JS 상수로 제한하여 하드코딩
- [ ] 정적 호스팅이므로 환경 상 노출된 API는 읽기/쓰기 데이터 검증 규칙(bkend Rule)에 의지함

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Manual Test | 웹 브라우저 | `index.html` 파일 브라우저 렌더링 검사 |

### 8.2 Test Cases (Key)

- [ ] Happy path: 정상적으로 로컬 브라우저에서 할 일을 생성 및 변경할 수 있다.
- [ ] Error scenario: 주소나 API 인증 문제가 있을 시 실패 토스트가 나타난다.

---

## 9. Next Steps

1. 본 설계 문서를 팀 리뷰(`/notify_user`)를 통해 승인 확보
2. bkend.ai 프로젝트 콘솔 또는 CLI에서 `todos` 테이블 구축
3. `script.js` 데이터 페칭 호출부를 `API_BASE_URL`로 완전히 마이그레이션

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-27 | Initial draft | Antigravity AI |
