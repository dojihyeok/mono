import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('/tmp/r1.html', 'r', encoding='utf-8') as f:
    r1_html = f.read()

with open('/tmp/r2.html', 'r', encoding='utf-8') as f:
    r2_html = f.read()

with open('/tmp/r3.html', 'r', encoding='utf-8') as f:
    r3_html = f.read()

def replace_dialog(html_content, dialog_id, new_dialog):
    pattern = r'<dialog[^>]*id="' + dialog_id + r'"[^>]*>.*?<\/dialog>'
    return re.sub(pattern, new_dialog, html_content, flags=re.DOTALL)

html = replace_dialog(html, 'r1-strategy-modal', r1_html)
html = replace_dialog(html, 'r2-strategy-modal', r2_html)
html = replace_dialog(html, 'r3-strategy-modal', r3_html)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Modals restored successfully.")
