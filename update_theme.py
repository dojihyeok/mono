import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace light neon backgrounds with warm ones
html = html.replace('bg-tech-50', 'bg-warm-50')
html = html.replace('bg-tech-100', 'bg-warm-100')

# Also replace dark background sections
html = html.replace('bg-ink-900 text-warm-50', 'bg-warm-50 text-ink-900')
html = html.replace('bg-ink-800 text-warm-50', 'bg-warm-100 text-ink-900')
html = html.replace('bg-ink-900 text-white', 'bg-warm-50 text-ink-900')
html = html.replace('bg-tech-900 text-warm-50', 'bg-warm-100 text-ink-900')
html = html.replace('bg-tech-800 text-warm-50', 'bg-warm-50 text-ink-900')

# Any stragglers of text-warm-50 or text-warm-100/200 inside those dark boxes
# Note: we shouldn't blindly replace all text-warm-50 because it might be inside a tech-600 button.
# Let's replace some specific container classes if they have dark classes
html = re.sub(r'class="([^"]*)glass-dark([^"]*)"', r'class="\1bg-warm-100 border border-ink-200\2"', html)

# Let's also tone down border colors from neon to warm/ink
html = html.replace('border-tech-700/20', 'border-ink-200')
html = html.replace('border-tech-700/30', 'border-ink-200')
html = html.replace('border-tech-500/30', 'border-ink-200')
html = html.replace('border-tech-400/30', 'border-ink-200')
html = html.replace('border-tech-200', 'border-ink-200')
html = html.replace('border-tech-400', 'border-ink-900')
html = html.replace('border-tech-500', 'border-ink-900')
html = html.replace('border-tech-700', 'border-ink-900')

# Tone down text colors
html = html.replace('text-tech-800', 'text-ink-900')
html = html.replace('text-tech-700', 'text-ink-900')
html = html.replace('text-tech-300', 'text-ink-700')
html = html.replace('text-tech-400', 'text-ink-800')
# Note: I won't replace text-tech-500 and 600 globally because they might be used for primary buttons or accent icons.
# But actually, if they are icons, text-ink-600 might be better.

# Specific replacement for the warning box the user screenshot
# <p class="text-sm font-bold text-tech-800"> -> text-ink-900 (already handled above)

# Specific section replacements
html = html.replace('bg-ink-800/80', 'bg-warm-100')
html = html.replace('bg-ink-900', 'bg-warm-50')
html = html.replace('text-warm-50', 'text-ink-900')
html = html.replace('text-warm-100', 'text-ink-800')
html = html.replace('text-warm-200', 'text-ink-700')

# But wait, button text is `text-white`. We didn't replace `text-white`, so buttons are safe.
# Actually, the footer was dark:
# <footer class="bg-ink-900 text-warm-50 py-12 border-t border-ink-800">
# Since we replaced bg-ink-900 with bg-warm-50 and text-warm-50 with text-ink-900, the footer will now be light warm! This perfectly aligns with user's request.

# Save
with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
