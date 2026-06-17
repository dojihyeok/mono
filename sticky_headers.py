import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Current section-label CSS:
# .section-label { font-family: 'Pretendard', sans-serif; font-size: 16px; font-weight: 800; color: #0E7490; letter-spacing: -0.01em; display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.5rem; max-width: 100%; word-break: keep-all; line-height: 1.4; }
# @media (min-width: 768px) { .section-label { font-size: 18px; } }

# We want to add sticky positioning.
old_css = """.section-label { font-family: 'Pretendard', sans-serif; font-size: 16px; font-weight: 800; color: #0E7490; letter-spacing: -0.01em; display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.5rem; max-width: 100%; word-break: keep-all; line-height: 1.4; }
@media (min-width: 768px) { .section-label { font-size: 18px; } }"""

new_css = """.section-label { 
    font-family: 'Pretendard', sans-serif; font-size: 15px; font-weight: 800; color: #0E7490; letter-spacing: -0.01em; 
    display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.5rem; max-width: 100%; word-break: keep-all; line-height: 1.4; 
    position: sticky; top: 63px; z-index: 40;
    margin-left: -24px; margin-right: -24px; padding: 12px 24px;
    background-color: rgba(244, 239, 230, 0.9);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(10, 15, 26, 0.08);
    box-shadow: 0 4px 12px -4px rgba(10, 15, 26, 0.05);
  }
  @media (min-width: 768px) { 
    .section-label { 
      font-size: 18px; position: relative; top: auto; margin-left: 0; margin-right: 0; padding: 0; 
      background-color: transparent; backdrop-filter: none; border-bottom: none; box-shadow: none;
    } 
  }"""

if old_css in html:
    html = html.replace(old_css, new_css)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Sticky CSS successfully applied via exact match.")
else:
    print("Old CSS not found exactly. Trying regex.")
    
    # regex fallback
    match = re.search(r'\.section-label\s*\{.*?\}(?:\s*@media\s*\([^)]+\)\s*\{\s*\.section-label\s*\{.*?\}\s*\})?', html, re.DOTALL)
    if match:
        html = html.replace(match.group(0), new_css)
        with open('public/pitch.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Sticky CSS applied via regex fallback.")
    else:
        print("Failed to find CSS.")
