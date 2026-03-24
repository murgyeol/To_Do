---
template: plan
version: 1.2
description: PDCA Plan phase document template for Today Section Visibility
---

# Today Section Visibility Document

> **Summary**: "오늘의 할 일" 섹션이 첫 화면에서 항상 표시되도록 로직 수정
>
> **Project**: To-Do List App
> **Version**: 1.1.1
> **Author**: Antigravity
> **Date**: 2026-03-19
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 앱에 접속 시 할 일이 전혀 없다 하더라도, "오늘의 할 일" 공간과 그 타이틀이 달력 상단에 직관적으로 고정 노출되도록 개선합니다. "오늘 등록된 일이 없습니다"라는 피드백을 주어 UX를 개선합니다.

### 1.2 Background

기본적으로 `script.js` 내부에서 전체 할 일 목록 배열이 0개일 때 `<div id="today-section">` 전체를 `display: none` 으로 숨기게 되어있어, 오늘자 앱 초기 사용자가 진입 시 "오늘의 할 일" 헤더 자체를 아예 인지할 수 없는 문제가 발생했기 때문.

### 1.3 Related Documents

- Requirements: 직전 유저 피드백

---

## 2. Scope

### 2.1 In Scope

- [ ] `index.html`:
  - `id="today-section"` 속도에서 인라인 스타일 `display: none;` 제거.
  - 내부에 `id="today-empty-state"` HTML 마크업 블록("등록된 할 일이 없습니다") 추가.
- [ ] `script.js`:
  - `renderTodos` 내에서 배열 길이가 0일 때 `todaySection`을 숨기는 코드 블록 제거.
  - 별도로 `todayTodos.length` 에 비례해 빈 목록과 리스트의 display 속성 스위칭(Display Toggle)을 하도록 리팩토링.
- [ ] `style.css`:
  - `today-empty-state` 기본 스타일 여백/패딩 적용.

### 2.2 Out of Scope

- 타 컴포넌트(`other-section`)의 Empty State 표시 방식 변경 불필요

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 앱 진입 즉시 "새로운 할 일 추가" 바로 밑에 "오늘의 할 일" 고정 노출 | High | Pending |
| FR-02 | 스케줄 데이터에 필터(date 비교) 시 오늘 항목이 0개면 오늘 전용 Empty Message 렌더링 | High | Pending |

---

## 4. Success Criteria

### 4.1 Definition of Done

- HTML/JS/CSS 적용 후 페이지 새로고침 시 "오늘의 할 일" 헤더 및 그 안의 내용물이 달력 상단에 잘 표시되는지 확인.
- 추가 버튼 기능 등에 딜레이나 버그가 전이되지 않았는지 수동 검증.

---

## 5. Next Steps

1. [ ] 기획/설계 문서 리뷰 및 승인
2. [ ] Implementation 단계로 진입 및 코드 수정(EXECUTION)
