with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<!-- ============================== S6 · VISION (DARK) ============================== -->')
end = html.find('</section>', start) + 10

sec_html = html[start:end]

# Make replacements for light theme
replacements = [
    ('S6 · VISION (DARK)', 'S6 · VISION (LIGHT)'),
    ('<section id="vision" class="relative py-24 lg:py-32 bg-ink-900 text-warm-50 overflow-hidden">', '<section id="vision" class="relative py-24 lg:py-32 bg-warm-50 text-ink-900 overflow-hidden">'),
    ('bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900', 'bg-gradient-to-b from-warm-50 via-warm-100/50 to-warm-50'),
    ('text-white', 'text-ink-900'),
    ('text-tech-400', 'text-tech-600'),
    ('text-warm-200', 'text-ink-700'),
    ('text-warm-100', 'text-ink-800'),
    ('bg-ink-800/80', 'bg-warm-100'),
    ('border-warm-200/10', 'border border-ink-900/10 shadow-sm'),
    ('border-warm-200/20', 'border border-ink-900/10'),
    ('from-warm-200/20', 'from-ink-900/15'),
    ('text-warm-200/80', 'text-ink-600'),
    ('bg-tech-600 text-ink-900', 'bg-tech-600 text-white'), # Wait, if I change text-ink-900 here it might be wrong. Let's see later.
]

for old, new in replacements:
    sec_html = sec_html.replace(old, new)

# Let's fix specific Step 07 which had special styling:
# <article class="bg-gradient-to-br from-tech-900/80 to-ink-900/90 border border-tech-500/30 p-6 rounded-lg relative group md:col-span-2 lg:col-span-1 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
sec_html = sec_html.replace('bg-gradient-to-br from-tech-900/80 to-ink-900/90', 'bg-gradient-to-br from-warm-100 to-warm-200')
sec_html = sec_html.replace('border-tech-500/30', 'border-tech-600/30')
sec_html = sec_html.replace('shadow-[0_0_15px_rgba(34,211,238,0.15)]', 'shadow-neo-soft')

# Final specific fixes
sec_html = sec_html.replace('bg-gradient-to-b from-warm-50 via-warm-100/50 to-warm-50 opacity-90', 'bg-gradient-to-b from-warm-50 via-warm-100/50 to-warm-50 opacity-50')
sec_html = sec_html.replace('text-ink-700/80', 'text-ink-600')

html = html[:start] + sec_html + html[end:]

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Light theme applied to Section 07.")
