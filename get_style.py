import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style>.*?</style>', html, re.DOTALL)
print(f"Found {len(styles)} style tags.")
if styles:
    print(f"Length of first style block: {len(styles[0])} characters.")
