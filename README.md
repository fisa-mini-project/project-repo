# project-repo

<b>[우리 FIS아카데미 5기 클라우드 서비스 개발 미니 프로젝트] Google Chrome Extension 개발</b>

<br/>

<div>
  
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
$ git checkout feat/{기능명
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
