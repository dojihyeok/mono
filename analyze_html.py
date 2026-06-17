from collections import Counter
import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check for missing mobile paddings
container_matches = re.findall(r'class="([^"]*max-w-[^"]*)"', html)
print("Container classes found:")
for c in set(container_matches):
    if 'px-' not in c:
        print(f"Warning: Container might lack horizontal padding -> {c}")

# Check for fixed widths that break mobile
fixed_widths = re.findall(r'class="([^"]*\bw-\[?\d+(?:px|rem)\]?[^"]*)"', html)
print("\nFixed widths found (potential mobile breakers):")
for w in set(fixed_widths):
    if 'w-full' not in w and 'md:w-' not in w and 'lg:w-' not in w:
        print(w)

