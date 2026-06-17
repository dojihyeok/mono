import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add bg-warm-50 to the parent div of the image
# The parent div is: class="mt-8 relative w-full rounded-lg overflow-hidden border border-ink-900/15 shadow-2xl"
old_parent = 'class="mt-8 relative w-full rounded-lg overflow-hidden border border-ink-900/15 shadow-2xl"'
new_parent = 'class="mt-8 relative w-full rounded-lg overflow-hidden border border-ink-900/15 shadow-2xl bg-warm-50"'

html = html.replace(old_parent, new_parent)

# Also ensure style is added to the image directly
old_img = 'class="w-full h-auto object-cover mix-blend-multiply" loading="lazy"'
new_img = 'class="w-full h-auto object-cover mix-blend-multiply" style="mix-blend-mode: multiply;" loading="lazy"'

html = html.replace(old_img, new_img)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Image blend mode fixed with parent background and inline style.")
