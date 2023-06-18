# final-19-

## 기술 스택

<table>
<tr>
 <td align="center">사용 기술</td>
 <td>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">&nbsp 
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">&nbsp 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">&nbsp 
  <img alt="SASS" src ="https://img.shields.io/badge/SASS-cc6699.svg?&style=for-the-badge&logo=Sass&logoColor=white"/>&nbsp 
 </td>
</tr>
<tr>
 <td align="center">협업</td>
 <td>
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>&nbsp
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>&nbsp 
    <img src="https://img.shields.io/badge/Notion-5a5d69?style=for-the-badge&logo=Notion&logoColor=white"/>&nbsp
    <img src="https://img.shields.io/badge/Discord-4263f5?style=for-the-badge&logo=Discord&logoColor=white"/>&nbsp 
    <img src="https://img.shields.io/badge/Figma-d90f42?style=for-the-badge&logo=Figma&logoColor=white"/>&nbsp  
 </td>
</tr>
<tr>
 <td align="center">IDE</td>
 <td>
    <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white"/>&nbsp
</tr>
</table>

## <span id="tree">3. 프로젝트 구조</span>
- assets/ : 이미지, 파비콘, 아이콘 등
	- icon : 아이콘만 따로 보관

- css/ : 컴파일된 scss 및 css 디렉토리

- html/ : html 디렉토리
  - "htmlname".html 으로 작성

- js/ : html 디렉토리의 html과 매칭되는 JS 디렉토리. 
  - common.js는 공통으로 사용되는 함수가 등록된 파일
  - "htmlname".js 으로 작성

- scss/ : html 디렉토리의 html과 매칭되는 scss
  - _mixin.scss : 믹스인 모아두기
  - _global.scss : 공통으로 사용되는 부분 모으기
  - _variable.scss : 변수들 모아두기
  - "htmlname".scss 로 작성
    - 필요시 mixin, global, variable 임포트
    - ex) @import "mixin";

```bash
기본포맷
│  README.md
│  index.html
├── assets
│    └── icon
├── css
│    └── reset.css
├── font
├── html
│    └── pagename.html
├── js
│    ├── common.js
│    └── pagename.js
└── scss
     ├── _variable.scss
     ├── _mixin.scss 
     ├── _global.scss
     └── pagename.scss
```
