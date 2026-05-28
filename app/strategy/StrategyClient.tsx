'use client';

import { useEffect, useRef } from 'react';

interface StrategyClientProps {
  htmlContent: string;
}

export default function StrategyClient({ htmlContent }: StrategyClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // dangerouslySetInnerHTML로 주입된 HTML 내의 모든 script 태그를 찾아 강제로 브라우저에서 실행하도록 합니다.
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      
      // 기존 스크립트 속성 복사
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // 기존 스크립트 내용 복사
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      }
      
      // 기존 script 엘리먼트를 새로운 script 엘리먼트로 교체해 강제 실행 유도
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [htmlContent]);

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', minHeight: '100vh' }}
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}
