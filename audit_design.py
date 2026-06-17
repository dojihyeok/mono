import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- Design Audit Results ---")

# Check header sizes without mobile fallbacks
h_display = re.findall(r'class="[^"]*h-display[^"]*"', html)
print(f"Elements with h-display: {len(h_display)}")

# Check for hardcoded px sizes which are bad for responsive
hardcoded_px = re.findall(r'text-\[[0-9]+px\]', html)
print(f"Hardcoded text-[px] classes: {len(hardcoded_px)}")

# Check for consistent section padding
section_padding = re.findall(r'<section[^>]*class="[^"]*(?:py-|pt-|pb-)[^"]*"', html)
print(f"Sections with padding: {len(section_padding)}")
for s in section_padding:
    print("  " + s[:100] + "...")

# Check for empty sections or weirdly nested hidden divs
hidden_blocks = html.count('hidden md:block')
hidden_md = html.count('block md:hidden')
print(f"Desktop only blocks: {hidden_blocks}")
print(f"Mobile only blocks: {hidden_md}")

