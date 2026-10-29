# 요약 품질 개선 (2026-10-29)

## 조사와 적용

- [OpenAI 긴 문서 요약 예제](https://developers.openai.com/cookbook/examples/summarizing_long_documents): 긴 문서를 단순히 짧게 줄이면 세부 정보가 사라질 수 있다. 기존 앞 5,000자 절단을 없애고 추출된 본문 최대 48,000자를 사용한다. 현재 웹페이지 도구의 응답 시간에 맞춰 한 번 호출한다. 여러 단계로 나눠 요약하는 방식은 호출량과 정보 손실의 절충이 있어 이번 범위에서 제외했다.
- [Anthropic 오류 감소 지침](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations): 직접 인용을 근거로 사용하고, 없는 정보를 추측하지 않도록 한다. 핵심/주의 항목에 원문 구절을 요청하고 공백 정규화 후 실제 입력에 존재하는지 검사한다. 실패 시 결과를 거부한다. 인용의 존재 검사는 해당 인용이 요약을 논리적으로 뒷받침함을 완전히 보장하지 않는다.
- [Meta 브랜드 자료](https://www.meta.com/brand/resources/meta/company-brand/)와 제공된 commerce 분석을 참고한다. 코발트 UI 값 `#0064E0` 및 hover `#0457CB`는 [Meta commerce 표면 분석](https://everyonesdesign.pages.dev/companies/meta)의 값과 맞췄다. Meta 전체 브랜드 팔레트를 복제하거나 공식 제휴를 표방하지 않는다.

## 동작

메뉴·스크립트·숨김 요소를 제외하고 명시적인 main/article 영역을 우선 사용한다. 해당 영역이 없으면 Readability를 시도하고 body로 폴백한다. 표·목록·본문 내부 footer/aside의 조건은 유지한다. 실제 로드된 DOM만 읽으므로 페이지 넘김이나 아직 로드되지 않은 내용은 포함하지 않는다.

요약은 제목, 한눈에 보기, 핵심 내용 1~5개, 주의할 조건 0~3개로 구성한다. 원문 근거는 접어서 제공한다. 숫자·단위·날짜·부정·가능성과 예외를 보존하도록 지시한다. 본문 속 지시를 실행하지 않도록 시스템 메시지와 JSON 자료를 분리한다. 음성 읽기는 주의사항과 부분 요약 안내도 포함한다.

48,000자를 넘으면 앞부분만 사용했다는 안내를 표시한다. 자동 추출 자체가 모든 사이트에서 완벽하다는 뜻은 아니다. 유효한 JSON과 근거를 반환하지 않으면 오류와 재시도 버튼을 표시한다.

## 재현 가능한 검증

- `npm test`: 제공자 요청, 구조화 응답, 근거 없는 인용 거부, 긴 본문과 처리 범위.
- `npm run test:ui`: 실제 추출, 반복 주입, UI/음성/근거 열기, 두 표면 WCAG 자동 검사.
- `npm run test:extension`: 실제 확장 호스트 콘텐츠 추출 및 너비.
- `node tests/evaluate-summary.mjs`: 선택 실행. `.env.local`의 API를 사용해 합성 문서 한 건을 전송하며 API 사용량이 발생한다. 개인 웹페이지는 전송하지 않는다. 결과는 무시된 `test-results/summary-quality.json`에 저장한다.

실제 Groq 시험 한 건에서 5,000자 뒤의 대상·금액·마감 시각·신청 서류/장소·예산 예외·온라인 불가 조건을 보존하고 허위 지시를 무시했다. 이 결과는 해당 합성 사례의 점검이며 일반적인 정확도 향상률을 입증하는 벤치마크는 아니다. 문장 난이도, 의미 충실도와 다양한 실제 사이트는 추가 사용자 평가 대상이다.
