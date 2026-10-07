import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'동원약품 | 재고조사',description:'일일 순환 재고조사 · 실수량 입력 · 차이 조치 · 그룹 이행률',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
