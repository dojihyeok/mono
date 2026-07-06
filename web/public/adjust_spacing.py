import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Adjust CSS coordinates
replacements = {
    'height: 1050px;': 'height: 1200px;',
    '.pos-1 { left: 40px; top: 140px; width: 360px; min-height: 600px; }': '.pos-1 { left: 40px; top: 180px; width: 360px; min-height: 700px; }',
    '.pos-2 { left: 440px; top: 140px; width: 680px; }': '.pos-2 { left: 440px; top: 180px; width: 680px; }',
    '.pos-3 { left: 440px; top: 310px; width: 680px; }': '.pos-3 { left: 440px; top: 350px; width: 680px; }',
    '.pos-4 { left: 440px; top: 680px; width: 680px; }': '.pos-4 { left: 440px; top: 760px; width: 680px; }',
    '.pos-5 { left: 1160px; top: 140px; width: 400px; min-height: 600px; }': '.pos-5 { left: 1160px; top: 180px; width: 400px; min-height: 700px; }',
    '.pos-6 { left: 40px; top: 850px; width: 1080px; }': '.pos-6 { left: 40px; top: 980px; width: 1080px; }',
    '.pos-7 { left: 1160px; top: 850px; width: 400px; border-color: #1a5eb8; }': '.pos-7 { left: 1160px; top: 980px; width: 400px; border-color: #1a5eb8; }',
    'wrapper.style.height = `${1050 * scale}px`;': 'wrapper.style.height = `${1200 * scale}px`;',
    'viewBox="0 0 1600 1050"': 'viewBox="0 0 1600 1200"'
}

for old, new in replacements.items():
    html = html.replace(old, new)

# Adjust arrows
arrows_old = """    <g stroke="#64748b" stroke-width="3" stroke-linecap="round">
      <path d="M400 205 L430 205" marker-end="url(#arrow-solid)"/>
      <path d="M400 460 L430 460" marker-end="url(#arrow-solid)"/>
      <path d="M400 740 L430 740" marker-end="url(#arrow-solid)"/>
      <path d="M780 275 L780 300" marker-end="url(#arrow-solid)"/>
      <path d="M780 645 L780 670" marker-end="url(#arrow-solid)"/>
      <path d="M1120 205 L1150 205" marker-end="url(#arrow-solid)"/>
      <path d="M1120 740 L1150 740" marker-end="url(#arrow-solid)"/>
    </g>

    <!-- Dotted Loops -->
    <g stroke="#3b82f6" stroke-width="3" stroke-dasharray="8,6" stroke-linecap="round">
      <path d="M780 850 L780 820" marker-end="url(#arrow-dash)"/>
      <path d="M1360 765 L1360 840" marker-end="url(#arrow-dash)"/>
      <path d="M1160 915 L1130 915" marker-end="url(#arrow-dash)"/>
      <path d="M220 850 L220 765" marker-end="url(#arrow-dash)"/>
    </g>"""

arrows_new = """    <g stroke="#64748b" stroke-width="3" stroke-linecap="round">
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

html = html.replace(arrows_old, arrows_new)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
