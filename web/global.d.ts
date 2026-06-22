// 전역 CSS(side-effect) import 타입 선언.
// Next 14.2 기본 타입은 *.module.css 만 선언하므로, globals.css 같은
// 전역 스타일 side-effect import (import "./globals.css") 를 위해 추가합니다.
declare module "*.css";
