import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the persona tab bar area
old_tabs_start = """    <!-- Persona tab bar -->
    <div id="personaTabs" class="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-6 reveal">"""

new_tabs_start = """    <!-- Persona tab bar -->
    <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-4 reveal" style="word-break:keep-all;">MONO와 함께 만들어 가는 순간들</h3>
    <div id="personaTabs" class="flex gap-2 overflow-x-auto pb-3 -mx-6 px-6 md:-mx-0 md:px-0 mb-6 reveal scrollbar-hide" style="scroll-snap-type: x mandatory;">"""

if old_tabs_start in html:
    html = html.replace(old_tabs_start, new_tabs_start)
    
    # Let's add snap-center to the buttons so they snap nicely on mobile
    html = html.replace('class="ptab active shrink-0 inline-flex', 'class="ptab active shrink-0 inline-flex snap-start')
    html = html.replace('class="ptab shrink-0 inline-flex', 'class="ptab shrink-0 inline-flex snap-start')
    
    # Ensure .scrollbar-hide exists
    if '.scrollbar-hide' not in html:
        css_inject = """  /* Scrollbar hide for mobile tabs */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }"""
        
        # Inject right before </style>
        html = html.replace('</style>', css_inject + '\n</style>')

    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Tabs fixed!")
else:
    print("Could not find tabs section.")
