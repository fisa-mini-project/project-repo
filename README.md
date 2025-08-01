# project-repo

<b>[우리 FIS아카데미 5기 클라우드 서비스 개발 미니 프로젝트] Google Chrome Extension 개발</b>

<br/>

<div>

# 👓 EasyReader – 웹페이지 요약 & 음성 읽기 크롬 확장 프로그램

**EasyReader**는 웹페이지에서

- **'요약' 버튼**으로 어르신·정보 취약계층도 쉽게 읽을 수 있는 쉬운 문장 요약을 제공하며
- **'읽어주기(TTS)' 버튼**으로 시각장애, 난독증, 저시력 노인 등 정보 소외 사용자도 주요 내용을 귀로 들을 수 있게 합니다.

웹 접근성 강화, 정보 소외 해소에 기여합니다.

<br/>

## ✅ 주요 기능

- 📝 **원클릭 요약**  
  복잡하고 긴 웹페이지를 간결하게 요약해서 화면에 표시

- 🔊 **음성 읽기(TTS)**  
  추출된 요약문을 자연스러운 음성으로 들려줌

- 🚦 **접근성 우선**
  - 시력 약자, 시각장애인, 난독증, 고령자 등 정보 접근이 어려운 분도 손쉽게 사용 가능
  - 크고 선명한 버튼, 단순 UI

- 💻 **크롬 확장 프로그램**
  - 별도 회원가입/로그인 없이 누구나 이용
  - 한글 웹사이트에서도 정상 동작

<br/>

## 🛠 설치 방법

1. 저장소를 다운로드(zip) 또는 `git clone` 명령어 실행
2. 크롬 주소창에 `chrome://extensions` 입력 후 접속
3. 우측 상단에서 [개발자 모드] 활성화
4. [압축해제된 확장 프로그램을 로드] 클릭 후 프로젝트 폴더 선택
5. 브라우저 우측 상단 익스텐션(아이콘)에서 실행

<br/>

## 🚀 사용법

1. 요약/읽기 기능을 사용하고 싶은 웹페이지로 이동
2. **EasyReader** 아이콘 클릭
3. 아래 두 개의 버튼 확인
   - **요약하기** : 페이지 주요 내용을 쉽고 간결하게 요약
   - **읽어주기 (TTS)** : 요약문을 음성으로 바로 들을 수 있음

<br/>

## 📢 접근성 대상

- 시각장애인, 저시력·고령자
- 난독증 등 텍스트 읽기 곤란자
- 정보 접근이 쉽지 않은 IT 초보 사용자

<br/>

<h2>  📄 컨벤션 및 브랜치 전략 </h2>

<br/>

## :cactus: 브랜치 전략

**브랜치 전략**

- main: 우리가 개발 최종시에 Merge를 하는 곳
- feat/{기능명}: 기능을 개발하면서 각자가 사용할 브랜치 ex) feat/Home
- 우리가 정의하는 기능명 → 구현 중인 페이지 (ex. Home, MyPage or Common)

```// 브랜치 생성 ❗❗항상 메인에 체크아웃해서 만들것❗❗
$ git branch feat/{기능명}
// 브랜치 체크아웃
$ git checkout feat/{기능명}
```

반드시 push는 feat/{기능명}에 해주시고, github에서, develop에 PR 날리기!

### 📚 커밋 컨밴션

- 커밋 단위는 반드시 최소한의 작업 단위로 쪼개서, 한 PR당 10커밋 이상 넘어가지 않도록 합니다.

| 커밋     | 역할                                                                  |
| -------- | --------------------------------------------------------------------- |
| Feat     | 기능 구현과 관련된 커밋                                               |
| Style    | 코드 순서, css등의 포맷에 관한 커밋 (기능에 변화X)                    |
| Design   | UI 구현 (css 구체화) 커밋                                             |
| Fix      | 버그를 고친 경우                                                      |
| Refactor | 더 좋은 코드로 개선한 경우 (기능에 변화가 없는 경우) ex-코드리뷰 반영 |
| Docs     | README.md 등 문서를 작성한 경우                                       |
| Chore    | 주석 추가, 자잘한 문서 수정                                           |

<br/>

### 📜 네이밍

- 컴포넌트명 : PascalCase
- 내부함수명 : camelCase
- 변수명 : camelCase
- 상수명 : UPPER_CASE

<aside>
<b>이벤트 핸들러 이름</b>

- handle이벤트명 = () ⇒ {}
- handleClick, handleSubmit, ...
</aside>

# Privacy Policy - Easy Reader Chrome Extension

Easy Reader does not collect, store, or share any personally identifiable information.

This extension sends selected webpage text to an external LLM API (Groq) solely for the purpose of generating a summary. No user identity or personal data is transmitted.

The summary results are stored locally using chrome.storage API and never sent to any third-party services.

If you have any questions, feel free to contact us at [jhcki222@gmail.com].
