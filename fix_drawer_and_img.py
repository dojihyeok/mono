import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Move mobileMenuDrawer outside of header
# Find the mobileMenuDrawer block
drawer_pattern = r'(<!-- Mobile navigation drawer / overlay overlay drawer for flawless mobile responsiveness -->\s*<div id="mobileMenuDrawer".*?</div>\s*</div>)'
match = re.search(drawer_pattern, html, re.DOTALL)
if match:
    drawer_html = match.group(1)
    # Remove from header
    html = html.replace(drawer_html, '')
    
    # Place right after </header>
    html = html.replace('</header>', '</header>\n\n' + drawer_html)
    print("Moved mobileMenuDrawer outside header.")
else:
    print("Could not find mobileMenuDrawer.")

# 2. Add flowchart image to Section 04
old_gtm_start = '<!-- Timeline Stepper UI for 6 steps -->'
new_gtm_start = '''<!-- Flowchart Image -->
    <div class="mb-16 reveal relative rounded-xl overflow-hidden shadow-2xl border border-ink-900/10">
      <img src="/images/mono_data_flowchart.png" alt="MONO Growth Flowchart" class="w-full h-auto object-cover mix-blend-multiply" style="mix-blend-mode: multiply;" loading="lazy" />
    </div>

    <!-- Timeline Stepper UI for 6 steps -->'''

if old_gtm_start in html:
    html = html.replace(old_gtm_start, new_gtm_start)
    print("Added flowchart image to GTM section.")
else:
    print("Could not find GTM section start.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixes applied.")
