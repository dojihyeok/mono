import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace bg-white in Section 07
# Since we know the exact strings we injected, we can just replace them.

old_data_box = '<div class="bg-white border border-ink-900/10 p-8 rounded-lg mb-12 shadow-sm">'
new_data_box = '<div class="bg-transparent border border-ink-900/15 p-8 rounded-lg mb-12">'
html = html.replace(old_data_box, new_data_box)

old_market_box = '<div class="bg-white border border-ink-900/10 p-8 rounded-lg shadow-sm border-t-4 border-t-tech-600 mb-16">'
new_market_box = '<div class="bg-transparent border border-ink-900/15 p-8 rounded-lg border-t-4 border-t-tech-600 mb-16">'
html = html.replace(old_market_box, new_market_box)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed white backgrounds.")
