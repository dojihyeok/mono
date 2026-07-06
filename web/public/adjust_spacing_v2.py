import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Board size
html = html.replace('height: 1200px;', 'height: 1350px;')
html = html.replace('wrapper.style.height = `${1200 * scale}px`;', 'wrapper.style.height = `${1350 * scale}px`;')
html = html.replace('viewBox="0 0 1600 1200"', 'viewBox="0 0 1600 1350"')

# Adjust positions for more balanced gaps
replacements = {
    '.pos-1 { left: 40px; top: 180px; width: 360px; min-height: 700px; }': '.pos-1 { left: 40px; top: 160px; width: 360px; min-height: 800px; }',
    '.pos-2 { left: 440px; top: 180px; width: 680px; }': '.pos-2 { left: 440px; top: 160px; width: 680px; }',
    '.pos-3 { left: 440px; top: 350px; width: 680px; }': '.pos-3 { left: 440px; top: 350px; width: 680px; min-height: 400px; }',
    '.pos-4 { left: 440px; top: 760px; width: 680px; }': '.pos-4 { left: 440px; top: 790px; width: 680px; min-height: 160px; }',
    '.pos-5 { left: 1160px; top: 180px; width: 400px; min-height: 700px; }': '.pos-5 { left: 1160px; top: 160px; width: 400px; min-height: 800px; }',
    '.pos-6 { left: 40px; top: 980px; width: 1080px; }': '.pos-6 { left: 40px; top: 1030px; width: 1080px; min-height: 160px; }',
    '.pos-7 { left: 1160px; top: 980px; width: 400px; border-color: #1a5eb8; }': '.pos-7 { left: 1160px; top: 1030px; width: 400px; border-color: #1a5eb8; min-height: 160px; }',
    '.pos-footer { left: 0; bottom: 0; width: 100%; height: 70px; }': '.pos-footer { left: 0; bottom: 0; width: 100%; min-height: 90px; padding-top: 10px; padding-bottom: 10px; }'
}

for old, new in replacements.items():
    html = html.replace(old, new)

# Adjust arrows coordinates
arrows_old = """    <g stroke="#64748b" stroke-width="3" stroke-linecap="round">
      <path d="M400 245 L430 245" marker-end="url(#arrow-solid)"/>
      <path d="M400 520 L430 520" marker-end="url(#arrow-solid)"/>
      <path d="M400 830 L430 830" marker-end="url(#arrow-solid)"/>
      <path d="M780 295 L780 340" marker-end="url(#arrow-solid)"/>
      <path d="M780 680 L780 750" marker-end="url(#arrow-solid)"/>
      <path d="M1120 245 L1150 245" marker-end="url(#arrow-solid)"/>
      <path d="M1120 830 L1150 830" marker-end="url(#arrow-solid)"/>
    </g>

    <!-- Dotted Loops -->
    <g stroke="#3b82f6" stroke-width="3" stroke-dasharray="8,6" stroke-linecap="round">
      <path d="M780 970 L780 910" marker-end="url(#arrow-dash)"/>
      <path d="M1360 810 L1360 970" marker-end="url(#arrow-dash)"/>
      <path d="M1150 1040 L1120 1040" marker-end="url(#arrow-dash)"/>
      <path d="M220 970 L220 840" marker-end="url(#arrow-dash)"/>
    </g>"""

arrows_new = """    <g stroke="#64748b" stroke-width="3" stroke-linecap="round">
      <path d="M400 230 L430 230" marker-end="url(#arrow-solid)"/>
      <path d="M400 540 L430 540" marker-end="url(#arrow-solid)"/>
      <path d="M400 870 L430 870" marker-end="url(#arrow-solid)"/>
      <path d="M780 280 L780 330" marker-end="url(#arrow-solid)"/>
      <path d="M780 710 L780 780" marker-end="url(#arrow-solid)"/>
      <path d="M1120 230 L1150 230" marker-end="url(#arrow-solid)"/>
      <path d="M1120 870 L1150 870" marker-end="url(#arrow-solid)"/>
    </g>

    <!-- Dotted Loops -->
    <g stroke="#3b82f6" stroke-width="3" stroke-dasharray="8,6" stroke-linecap="round">
      <path d="M780 1020 L780 960" marker-end="url(#arrow-dash)"/>
      <path d="M1360 840 L1360 1020" marker-end="url(#arrow-dash)"/>
      <path d="M1150 1100 L1120 1100" marker-end="url(#arrow-dash)"/>
      <path d="M220 1020 L220 860" marker-end="url(#arrow-dash)"/>
    </g>"""

html = html.replace(arrows_old, arrows_new)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
