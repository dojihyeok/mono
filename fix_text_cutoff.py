import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace <div class="md:w-1/3"> with <div class="md:w-1/3 pl-10 sm:pl-12"> inside articles with vstep-dot
# Since we only want to target the timeline steps, we can do a regex replacement on those specific divs.

# For R1, R2, R3, R4
html = re.sub(r'(<div class="md:w-1/3">\s*<div class="chip bg-warm-100)', r'<div class="md:w-1/3 pl-10 sm:pl-12">\n            <div class="chip bg-warm-100', html)

# Let's also check if there are any other <div class="md:w-1/3"> we missed that have <div class="chip"> inside.
# R1 chip: bg-warm-100
# R2 chip: bg-warm-100
# R3 chip: bg-warm-100
# R4 chip: bg-tech-600 or something?
html = re.sub(r'(<div class="md:w-1/3">\s*<div class="chip )', r'<div class="md:w-1/3 pl-10 sm:pl-12">\n            <div class="chip ', html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added padding to title columns to prevent text cutoff.")
