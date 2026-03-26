---
template: plan
version: 1.2
description: PDCA Plan phase document template with Architecture and Convention considerations
variables:
  - feature: Web Database Integration (GitHub Pages)
  - date: 2026-03-27
  - author: Antigravity AI
  - project: To_Do
  - version: 1.0
---

# Web Database Integration Planning Document

> **Summary**: 로컬 SQLite DB 서버 연동 코드를 서버리스 BaaS (bkend.ai 또는 Firebase) 연동 방식으로 전환하여 GitHub Pages 환경에서 데이터 저장이 가능하도록 개선
>
> **Project**: To_Do
> **Version**: 1.0
> **Author**: Antigravity AI
> **Date**: 2026-03-27
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

GitHub Pages와 같은 정적 호스팅 환경에서 동작하는 프론트엔드 애플리케이션이 데이터를 영구적으로 저장하고 조회할 수 있도록, 외부 클라우드 데이터베이스(BaaS)와 연동합니다.

### 1.2 Background

현재 애플리케이션은 로컬 서버(Python `server.py`)와 SQLite DB(`todos.db`)에 의존하고 있습니다. GitHub Pages는 정적 파일만 호스팅하므로 Python 배포가 어렵고, 서버 환경이 구동되지 않아 저장된 일정을 불러오거나 추가할 수 없는 문제가 발생합니다. 이를 해결하기 위해 온라인 DB 서비스 연동이 필요합니다.

### 1.3 Related Documents

- Requirements: 사용자가 GitHub Pages를 통해 배포된 웹에서 DB를 사용할 수 있어야 함
- References: `bkit_skills/bkend-quickstart/SKILL.md`, `bkit_skills/bkend-data/SKILL.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] 로컬 API URL(`/api/todos`)을 클라우드 데이터베이스 API Endpoint로 변경
- [ ] 정적 파일(HTML/JS) 내에서 외부 DB 연동 로직 (CRUD: Create, Read, Update, Delete) 수정
- [ ] 클라우드 DB 서비스(bkend.ai 등)에 `todos` 테이블 구조 생성

### 2.2 Out of Scope

- 다중 사용자 환경을 위한 복잡한 권한 부여(Auth) 시스템 구축 (일단 단일 사용자 및 퍼블릭 접근 기준으로 진행, 보안상 필요 환경 변수 설정만 수행)
- 로컬 `server.py` 코드 유지보수 (더 이상 사용하지 않음)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 일정을 외부 DB에서 정상적으로 불러와야 함 | High | Pending |
| FR-02 | 새로운 일정을 외부 DB에 저장할 수 있어야 함 | High | Pending |
| FR-03 | 일정의 상태 변동(체크) 시 외부 DB에 업데이트되어야 함 | High | Pending |
| FR-04 | 일정 삭제 시 외부 DB에서도 삭제되어야 함 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Availability | GitHub Pages 환경에서 CORS 이슈 없이 API 호출 가능해야 함 | 브라우저 콘솔 확인 |
| Security | API 호출 시 권한이 분리되거나, 도메인 제한 등을 통해 비정상적인 데이터 조작이 방지되어야 함 | API 권한/환경설정 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `script.js`의 `fetch` 로직이 외부 DB를 향하도록 전면 변경됨
- [ ] 대상 클라우드 플랫폼에 DB 테이블이 생성됨
- [ ] 로컬 브라우저 환경에서 CRUD 기능 작동 여부 테스트 확인
- [ ] 사용자 리뷰 및 승인 완료 (`notify_user`)

### 4.2 Quality Criteria

- [ ] 브라우저 개발자 도구의 Console 및 Network 탭에서 에러 제로
- [ ] 연동 코드가 단방향 순수 자바스크립트에 부합하며, 가독성을 저해하지 않음

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CORS 정책 위반으로 API 호출 차단 | High | Medium | 대상 외부 DB의 CORS(Allowed Origins) 설정에 타겟팅되는 도메인을 등록하여 해결 |
| 노출된 URL/API Key를 통한 DB 악용 조작 | High | Low | 읽기/쓰기 권한 제어가 가능한 BaaS(선호)의 토큰·룰셋 제어 적용, 도메인 기반 요청 제한 적용 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration (bkend.ai) | Web apps with backend, SaaS MVPs, fullstack apps | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Backend DB | BaaS (bkend.ai) / Firebase / Supabase | **User to Decide** | 로컬 서버를 대체하기 위한 서버리스 저장소 환경이 필요. `bkit_skills` 룰에 입각하여 `bkend.ai` 등의 플랫폼 활용을 추천함. |

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [ ] 바닐라 JavaScript 파일 구조 (`script.js`) 유지

### 7.2 Variable Needs

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `API_BASE_URL` | 클라우드 서비스의 DB 연결용 REST API 엔드포인트 도메인 | 클라이언트(`script.js`) | ☑ |

---

## 8. Next Steps

1. [ ] **DB 프로바이더 선정 및 승인** (사용자 결정에 따름. 가이드라인상 `bkend.ai` 권장)
2. [ ] 스키마 및 DB 셋업 진행
3. [ ] `script.js` 내 CRUD 구문 전면 개편

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-27 | Initial draft 작성 완료 | Antigravity AI |
