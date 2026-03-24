---
template: plan
version: 1.2
description: PDCA Plan phase document template for Layout Update feature
---

# To-Do List Layout Planning Document

> **Summary**: "오늘의 할 일" 위치 변경 및 "캘린더(달력으로 보기)" 기본화
>
> **Project**: To-Do List App
> **Version**: 1.1.0
> **Author**: Antigravity
> **Date**: 2026-03-19
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

앱 진입 시 사용자에게 전체적인 일정을 먼저 보여주고(달력 기본 설정), 당일 처리해야 할 사항은 뷰 모드(목록/달력)에 제약받지 않고 항상 상단에서 바로 확인할 수 있도록 화면 레이아웃을 개편한다.

### 1.2 Background

기존 구조에서는 "목록으로 보기"를 눌러야 "오늘의 할 일"을 볼 수 있었고, 앱 진입 시 기본적으로 목록 모드가 켜져 있었다. 사용자 피드백에 따라 "달력으로 보기"를 기본값으로 변경하고, 가장 중요도가 높은 "오늘의 할 일"은 달력을 볼 때도 확인할 수 있도록 독립적인 영역으로 분리배치(목록)한다.

### 1.3 Related Documents

- Requirements: 방금 전 사용자가 남긴 메시지 지시사항

---

## 2. Scope

### 2.1 In Scope

- [ ] `index.html`:
  - `id="today-section"` <div> 블록을 `<div class="view-toggle">` 위(상단)로 이동.
  - "달력으로 보기" 버튼의 `active` 클래스를 디폴트로 할당.
  - `list-view-container`와 `calendar-view-container`의 `display` 초기값을 바꿔서 달력이 먼저 보이게 수정.
- [ ] `script.js`:
  - `currentView = 'calendar'`로 초기화.
  - 로드 시 "오늘의 할 일"만 별도로 그려주는 `renderTodayTodos()` 함수 신설(혹은 `renderTodos` 내부 로직 분리)하여 View Toggle 상태와 독립적으로 항상 실행되게 리팩토링.
- [ ] `style.css`:
  - `today-section`이 `view-toggle` 위에 배치될 때 레이아웃 간격이 자연스럽게 여백(margin) 추가.

### 2.2 Out of Scope

- 새로운 데이터 속성(스키마) 추가
- 필터 기능 등 타 UI 동작 방식은 기존 유지

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 앱 기본 View 모드가 "달력으로 보기"가 되도록 설정 | High | Pending |
| FR-02 | "오늘의 할 일" 목록이 View 스위치 위에 항상 보이도록 배치 | High | Pending |
| FR-03 | 달력 뷰 상태에서도 할 일을 추가/삭제/체크 시 즉각 "오늘의 할 일" 목록이 갱신되어야 함 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| UX | "오늘의 할 일"이 빈 목록일 때 empty state 표시 여부 (기존엔 없었으므로 그냥 숨김 처리) | 육안 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- 지정된 HTML, CSS, JS 변경사항 적용 완료
- 수동 테스트를 통해 모든 뷰에서 오류 없이 렌더링 검수
- 레이아웃이 요구사항 순서와 100% 일치할 것

---

## 5. Next Steps

1. [ ] 기획/설계 문서 리뷰 및 승인
2. [ ] Implementation 단계로 진입 및 코드 수정(EXECUTION)
