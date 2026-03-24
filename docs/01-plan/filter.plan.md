---
template: plan
version: 1.2
description: PDCA Plan phase document template for To-Do List Filter feature
---

# To-Do List Filter Planning Document

> **Summary**: "모든 할 일" 목록에 전체/완료/미완료 필터링 버튼 추가
>
> **Project**: To-Do List App
> **Version**: 1.0.0
> **Author**: Antigravity
> **Date**: 2026-03-19
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 "모든 할 일" 목록에서 원하는 상태(전체, 완료, 미완료)의 할 일만 쉽게 골라서 볼 수 있도록 필터링 기능을 제공한다.

### 1.2 Background

현재 "목록으로 보기" 모드에서 "모든 할 일"은 완료 여부와 상관없이 모든 항목을 나열하고 있어, 사용자가 완료하지 않은 일만 확인하거나 이미 완료된 일만 모아서 보기 어렵다. 이를 개선하기 위해 필터 버튼 상호작용을 추가한다.

### 1.3 Related Documents

- Requirements: 현 대화 지시사항 참조

---

## 2. Scope

### 2.1 In Scope

- [ ] `index.html`: "모든 할 일" 헤더 우측에 [전체], [완료], [미완료] 3개의 버튼 추가
- [ ] `style.css`: 필터 버튼의 기본 스타일 및 활성화(active) 상태 스타일 추가
- [ ] `script.js`:
  - 3개 버튼에 대한 click 이벤트 리스너 추가
  - 선택된 필터 상태(state) 저장 로직 추가
  - `renderTodos()` 실행 시, `otherTodos` 배열을 렌더링하기 전 현재 선택된 필터 조건에 맞게 데이터 필터링

### 2.2 Out of Scope

- "오늘의 할 일" 목록에 대한 필터링 기능 (요청 사항에 명시되지 않음)
- "달력으로 보기" 모드에서의 필터링 기능
- 백엔드(DB 및 API)의 필터링 (클라이언트 단에서 렌더링 필터 처리를 가정함)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | "모든 할 일" 섹션 우측에 전체/완료/미완료 필터 버튼 구현 | High | Pending |
| FR-02 | "전체" 클릭 시, 취소선 그어진 항목 포함 모든 할 일 목록 노출 | High | Pending |
| FR-03 | "완료" 클릭 시, 완료 처리된(completed:true) 할 일만 노출 | High | Pending |
| FR-04 | "미완료" 클릭 시, 완료되지 않은(completed:false) 할 일만 노출 | High | Pending |
| FR-05 | 필터 카운트(배지) 업데이트 시 필터링된 결과 개수 반영 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Usability | 현재 선택된 필터 버튼이 시각적으로 돋보이도록 UI (active 클래스) 표현 | 육안 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] HTML, CSS, JS 상의 모든 변경사항 구현 완료
- [ ] 브라우저에서 필터 버튼 동작 및 목록 갱신 여부 수동 테스트 완료
- [ ] 사용자 리뷰 및 승인 취득

### 4.2 Quality Criteria

- [ ] 필터를 변경해도 삭제, 상태 토글 등의 기존 이벤트가 정상 동작해야 함
- [ ] 레이아웃이 깨지지 않아야 함

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 할 일 삭제 등 다른 액션 발생 시 필터 상태 초기화 | Medium | Medium | 기존의 `renderTodos()` 및 `renderActiveView()` 호출 체인에 현재 필터 상태(`currentFilter`)가 유지되도록 설계 |

---

## 6. Architecture Considerations

해당 프로젝트는 순수 HTML, CSS, Vanilla JS를 사용하는 Starter 레벨 프로젝트에 가깝습니다. 별도의 프레임워크나 State Management 라이브러리가 없으므로, 전역 변수로 `currentFilter` 상태를 관리합니다.

---

## 7. Convention Prerequisites

- 기존 코드 컨벤션(Vanilla JS 전역 상태 관리 및 DOM 조작 방식)을 준수.
- 기존 CSS의 BEM/Atomic 유사 클래스 네이밍 규칙 준수.

---

## 8. Next Steps

1. [ ] 기획/설계 문서(본 문서) 사용자 리뷰 및 승인
2. [ ] 승인 후 Implementation Plan 수립 및 코드 기입(EXECUTION)
