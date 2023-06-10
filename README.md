# final-19-

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
  - style.scss : _mixin,_global,_variable 다 모아서 처리
  - "htmlname".scss 로 작성

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
     ├── style.scss
     └── pagename.scss
```
