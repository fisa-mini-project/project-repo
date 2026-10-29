# Easy Reader

**긴 웹페이지를 쉬운 한국어로 요약하고, 소리로 읽어 주는 Chrome 확장 프로그램입니다.**

고령자, 저시력 사용자, 긴 글을 읽기 어려운 사람 등 디지털 정보 이용에 도움이 필요한 사용자를 위해 만들었습니다.

[설치하기](#설치하기) · [사용 방법](#사용-방법)

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 쉬운 한국어 요약 | 한눈에 보기, 핵심 내용, 주의할 조건으로 나누어 표시합니다. |
| 원문 근거 확인 | 각 항목의 ‘원문 근거 보기’를 펼쳐 요약에 사용한 구절을 확인합니다. |
| 본문 추출 | 본문 영역을 우선 읽고 표·목록에 있는 금액, 날짜, 신청 조건을 보존하도록 처리합니다. |
| 음성 읽기 | 요약과 주의사항을 한국어 음성으로 읽고, 읽는 도중 중지할 수 있습니다. |
| 두 가지 화면 | 툴바 팝업과 사이드패널에서 같은 읽기 기능을 제공합니다. |
| 읽기 설정 | 글자 크기 4단계와 고대비 모드를 제공하고 설정을 기억합니다. |
| 처리 상태 안내 | 스켈레톤, 느린 요청 안내, 오류 메시지와 재시도 버튼을 제공합니다. |

## 설치하기

현재 구성은 **개인 API 키를 사용하는 로컬 테스트용**입니다. Chrome과 Node.js/npm, 사용할 AI 제공자의 API 키가 필요합니다. 빌드 검증에 사용한 Node.js 버전은 24.18.0입니다.

### 1. 프로젝트 준비

```bash
git clone https://github.com/fisa-mini-project/project-repo.git
cd project-repo
npm ci
```

### 2. 환경변수 설정

프로젝트 루트의 `.env.example`을 `.env.local`로 복사합니다. PowerShell에서는 다음 명령을 사용할 수 있습니다.

```powershell
Copy-Item .env.example .env.local
```

`.env.local`에서 사용할 제공자와 해당 API 키를 설정합니다. 아래 키 값은 예시입니다.

```dotenv
VITE_LLM_PROVIDER=groq
VITE_GROQ_MODEL=openai/gpt-oss-120b
VITE_GROQ_API_KEY=your_groq_api_key

VITE_OLLAMA_MODEL=gpt-oss:120b
VITE_OLLAMA_API_KEY=your_ollama_api_key
```

| 제공자 | 선택 값 | 코드의 기본 모델 | 요청 대상 |
| --- | --- | --- | --- |
| Groq | `groq` | `openai/gpt-oss-120b` | `api.groq.com` |
| Ollama Cloud | `ollama` | `gpt-oss:120b` | `ollama.com` |

Ollama Cloud를 사용하려면 `VITE_LLM_PROVIDER=ollama`로 변경합니다. **로컬 Ollama 서버를 호출하는 설정이 아니며**, Ollama 설치나 모델 다운로드는 필요하지 않습니다. 


### 3. 빌드 및 Chrome에 로드

```bash
npm run build
```

1. Chrome에서 `chrome://extensions`를 엽니다.
2. **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드**를 누릅니다.
4. 프로젝트의 **`build` 폴더**를 선택합니다.
5. 요약할 웹페이지를 새로고침합니다.

코드나 환경변수를 수정한 뒤에도 다시 빌드하고, 확장 프로그램 관리 화면과 대상 웹페이지를 모두 새로고침해야 합니다. 열린 팝업이나 사이드패널은 닫았다가 다시 엽니다.

## 사용 방법

1. 요약하려는 일반 웹페이지로 이동합니다.
2. 툴바의 **Easy Reader** 아이콘을 누르거나, 브라우저 사이드패널에서 Easy Reader를 선택합니다.
3. 현재 페이지 주소를 확인하고 **이 페이지 요약하기**를 누릅니다.
4. 요약을 읽고, 필요한 항목의 **원문 근거 보기**를 펼칩니다.
5. **소리로 듣기**를 누르면 요약과 주의사항을 읽어 줍니다. **읽기 중지**로 멈출 수 있습니다.
6. **읽기 설정**에서 글자 크기와 고대비를 조절합니다.

‘주소 복사’는 현재 페이지의 전체 URL을 클립보드에 복사합니다. 읽기 설정은 팝업과 사이드패널 사이에서 공유됩니다.

## 접근성과 요약의 한계

- 기본 본문 크기는 18px이며 16/18/24/32px 중 선택할 수 있습니다.
- 키보드 포커스, 최소 44px 버튼 영역, 상태 알림, 고대비와 동작 줄이기 설정을 지원합니다.
- WCAG 관련 자동 검사를 포함하지만, 자동 검사 통과가 모든 사용자 환경에서의 접근성 준수를 보장하지는 않습니다.
- 추출된 본문은 최대 48,000자까지 요약합니다. 초과하면 앞부분만 처리했다는 안내를 표시합니다.
- 현재 페이지에 로드된 내용만 읽습니다. 다음 페이지, 아직 로드되지 않은 글, 이미지 속 글자 등은 포함되지 않을 수 있습니다.
- `chrome://` 등 브라우저 내부 페이지와 접근이 제한된 페이지는 요약할 수 없습니다. PDF 뷰어의 본문 추출도 보장하지 않습니다.
- 원문 근거가 실제 입력에 존재하는지 검사하지만, 요약의 의미나 모든 조건이 정확하다는 보장은 아닙니다. 중요한 금액·일정·조건은 원문과 함께 확인하세요.
- 음성 품질과 지원 여부는 브라우저 및 운영체제에 따라 달라집니다.

## 개발 및 검증

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 확장 프로그램을 `build/`에 생성 |
| `npm test` | AI 요청과 응답 검증 단위 테스트 |
| `npm run test:ui` | 빌드 후 팝업·사이드패널 동작 및 접근성 자동 검사 |
| `npm run test:extension` | 빌드 후 실제 확장 호스트의 본문 추출·화면 너비 검사 |
| `node tests/evaluate-summary.mjs` | 실제 API로 합성 문서의 주요 조건 보존 여부 점검 |
| `npm run zip` | 빌드 후 `package/`에 ZIP 생성 |

브라우저 테스트는 현재 Microsoft Edge의 Chromium 엔진을 사용하므로 Edge가 설치되어 있어야 합니다. 단위·UI·호스트 테스트는 실제 AI API를 호출하지 않습니다. `evaluate-summary.mjs`는 `.env.local`의 제공자로 합성 문서를 전송하므로 API 사용량이 발생합니다. 결과는 Git에서 제외된 `test-results/`에 저장됩니다.

## 프로젝트 구성

```text
src/
├─ background/      # 본문 요청, AI 호출, 응답 검증, 마지막 요약 저장
├─ contentScript/   # 웹페이지 본문 추출
├─ reader/          # 팝업·사이드패널 공통 화면과 디자인 토큰
├─ hooks/           # 요약·음성·현재 탭·설정 상태 관리
├─ contexts/        # 글자 크기 설정
├─ popup/           # 툴바 팝업 진입점
├─ sidepanel/       # 사이드패널 진입점
└─ manifest.js      # 확장 프로그램 구성 및 권한
tests/              # 브라우저·확장 호스트·실제 API 평가
docs/               # 설계 및 요약 품질 개선 기록
```

React 18, Vite, CRXJS, Mozilla Readability, Web Speech API를 사용합니다. AI 요청은 백그라운드 서비스 워커에서 Groq 또는 Ollama Cloud로 전송합니다.

- [디자인 적용 기준](DESIGN.md)
- [요약 품질 개선 조사 및 검증](docs/summary-quality.md)

## 8. Privacy Policy - Easy Reader Chrome Extension

Easy Reader does not collect, store, or share any personally identifiable information.

This extension sends selected webpage text to an external LLM API (Groq) solely for the purpose of generating a summary. No user identity or personal data is transmitted.

The summary results are stored locally using chrome.storage API and never sent to any third-party services.

If you have any questions, feel free to contact us at [jhcki222@gmail.com].

## License

[MIT License](LICENSE)
