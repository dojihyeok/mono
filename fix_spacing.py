with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = ".spec-list .row { display: grid; grid-template-columns: 96px 1fr; column-gap: 14px; padding: 8px 0; border-top: 1px dashed rgba(10,15,26,0.18); color:#1B2436; }"

replacement = """.spec-list .row { display: grid; grid-template-columns: 48px 1fr; column-gap: 12px; padding: 8px 0; border-top: 1px dashed rgba(10,15,26,0.18); color:#1B2436; }
  @media (min-width: 768px) {
    .spec-list .row { grid-template-columns: 56px 1fr; column-gap: 16px; }
  }"""

if target in html:
    html = html.replace(target, replacement)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("CSS replaced successfully.")
else:
    print("Target not found. Let's see what's there.")
