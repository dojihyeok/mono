import re

with open('/Users/yunhyeok/mono/refer/MONO_BM.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract content inside <body>
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    
    # We will use dangerouslySetInnerHTML to render it exactly as is
    # Just need to escape backticks and $ for template literals
    body_content_escaped = body_content.replace('`', '\\`').replace('$', '\\$')
    
    jsx = f"""import React from 'react';

export const metadata = {{
  title: 'MONO 수익 모델 매트릭스',
}};

export default function BMPage() {{
  return (
    <div dangerouslySetInnerHTML={{{{ __html: `{body_content_escaped}` }}}} />
  );
}}
"""
    import os
    os.makedirs('/Users/yunhyeok/mono/web/app/bm', exist_ok=True)
    with open('/Users/yunhyeok/mono/web/app/bm/page.tsx', 'w', encoding='utf-8') as out:
        out.write(jsx)
    print("Successfully converted to page.tsx")
else:
    print("Could not find body tag")
