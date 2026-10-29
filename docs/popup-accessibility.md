# Easy Reader 팝업·사이드패널 구조와 접근성

대상: 디지털 기기 사용에 익숙하지 않은 사용자, 저시력 사용자, 읽기에 도움이 필요한 사용자.

## 구현

- `popup.html` → `src/popup/index.jsx`, `sidepanel.html` → `src/sidepanel/index.jsx`가 각각 진입점입니다.
- 두 진입점은 `src/reader/ReaderApp.jsx`를 렌더링하며 화면·설정·요약 로직을 공유합니다.
- `ReaderScreen`은 `SourceBar`, `SummarySection`, `ReadingControls`를 조합합니다.
- 팝업 루트는 420px로 정합니다. Chrome의 자동 크기 계산이 순환하지 않도록 루트에 `max-width: 100vw`를 사용하지 않습니다.
- 사이드패널은 브라우저가 정하는 가변 너비를 따릅니다. 팝업의 고정 너비 스타일을 가져오지 않습니다.
- 양쪽이 동시에 열려 있어도 글자 크기·고대비 설정이 `storage` 이벤트로 동기화됩니다.

- 헤더를 작게 하고 요약하기 → 본문 읽기 → 소리로 듣기의 순서로 배치합니다.
- 팝업 안에서 결과를 바로 표시합니다. 키보드 포커스를 강제로 옮기지 않습니다.
- 기본 본문 18px, 16/18/24/32px 설정과 고대비 선택을 기기에 저장합니다.
- 모든 버튼의 클릭 영역은 최소 44×44 CSS px입니다.
- 일반/고대비에서 텍스트 대비 4.5:1 이상을 목표로 합니다.
- 진행·완료는 `role=status`, 오류는 `role=alert`, 선택 상태는 `aria-pressed`로 전달합니다.
- 음성은 요청할 때만 재생하며 같은 버튼으로 중지할 수 있습니다. 팝업 종료 시 중지합니다.
- 짧은 누름 효과만 적용하며 키보드 포커스와 `prefers-reduced-motion`에서는 이동 효과를 없앱니다.
- 주소 복사는 쿼리와 해시를 포함한 전체 주소를 복사합니다.
- 요청 중 실제 내용 대신 스켈레톤과 텍스트 안내를 표시합니다. 가짜 진행률은 표시하지 않습니다.
- 12초 이후 지연 안내, 65초 이후 시간 초과와 재시도를 제공합니다.
- 스켈레톤의 맥동은 4.2초 후 멈추고, 결과는 180ms 동안 대비를 유지하며 나타납니다.
- 동작 줄이기를 설정하면 스켈레톤·회전 표시·전환 애니메이션을 모두 끕니다.

## 검증

`npm test`: API 요청/응답 회귀 테스트.

`npm run test:ui`: 빌드 후 Playwright와 axe로 팝업·사이드패널 각각을 검사합니다. 기본 실행 브라우저는 설치된 Microsoft Edge입니다.
Chrome API와 음성 합성의 외부 경계는 테스트 대역으로 대체합니다. 실제 React 화면과 CSS를 검사하며,
실제 확장 프로그램의 네트워크 호출이나 기기의 음성 출력 품질을 검증하는 테스트는 아닙니다.
스크린샷은 Git에서 제외된 `test-results`에 저장됩니다.

`npm run test:extension`: 격리된 Edge 프로필에 실제 빌드 확장을 로드하고,
`chrome.action.openPopup()`과 `chrome.sidePanel.open()`으로 실제 호스트를 엽니다.
렌더링 준비 상태, 팝업 너비, 가로 넘침, 사이드패널의 공통 화면을 CDP로 확인합니다.
현재 환경에서 실제 팝업 435px(420px 본문 + 스크롤바), 사이드패널 382px를 확인했습니다.
일반 웹페이지에서 viewport만 고정하는 검사로는 팝업 자동 크기 오류를 찾을 수 없으므로 이 검사를 함께 유지합니다.

검사 범위: 요약 진행/완료/실패와 재시도, 음성 시작/중지/실패, 설정 저장,
전체 주소 복사, 페이지 변경 시 오래된 응답 무시, 키보드 포커스,
일반/고대비 axe 검사, 사이드패널 320px 너비, 큰 글자 및 200% 글자 확대, 동작 줄이기,
스켈레톤 수명과 시간 초과, 동시에 열린 화면 간 설정 동기화.
자동 검사 통과는 WCAG 전체 준수 인증이 아닙니다. NVDA 등 화면 낭독기로 실제 안내를 확인하고,
Chrome에서 음성 출력과 확대 화면을 직접 확인하는 검증이 추가로 필요합니다.

## 참고 지침

- [Emil Kowalski Design Engineering](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md): 조작에 대한 빠른 피드백과 동작 줄이기
- [Impeccable](https://github.com/pbakaus/impeccable): 작업·읽기 중심의 구성, 불필요한 장식과 모달 축소
- [WCAG 2.2 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 클릭 영역](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): AA 최소 24px보다 큰 44px 채택
- [WCAG 상태 메시지](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WCAG 글자 확대](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
