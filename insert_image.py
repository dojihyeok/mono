import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '        </p>\n      </div>\n\n      <!-- 5단계 발전 방향 -->'
replacement = """        </p>
      </div>

      <!-- Evolution Image -->
      <div class="mt-12 mb-4 relative z-10 w-full overflow-hidden lcorner border border-ink-900/15 shadow-blueprint bg-white">
        <img src="/images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-contain">
      </div>

      <!-- 5단계 발전 방향 -->"""

if target in html:
    html = html.replace(target, replacement)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Image inserted successfully.")
else:
    print("Target not found.")

