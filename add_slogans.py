import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

slogans_html = """
<!-- Slogan Bar -->
<div class="w-full bg-ink-900 text-warm-50 py-12 text-center relative z-20 border-t-4 border-tech-700">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-xl md:text-2xl font-black mb-4" style="word-break: keep-all;">
      "기술자의 경험은 단순한 경력이 아니라 자산입니다."
    </div>
    <div class="text-lg md:text-xl font-bold text-tech-400 mb-6" style="word-break: keep-all;">
      "MONO는 근무기록을 신뢰로 연결하고, 신뢰를 더 많은 기회와 미래 가치로 연결하는 플랫폼입니다."
    </div>
    <div class="text-base font-medium text-warm-200" style="word-break: keep-all;">
      "우리는 사람을 대체하는 기술이 아니라 사람의 가치를 증명하고 보호하는 기술을 만듭니다."
    </div>
  </div>
</div>
"""

# Insert right before footer
target_str = "<!-- ============================== FOOTER ============================== -->"
if target_str in content:
    content = content.replace(target_str, slogans_html + "\n" + target_str)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Slogans added successfully")
else:
    print("Could not find footer")
