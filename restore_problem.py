import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('/tmp/old_problem.html', 'r', encoding='utf-8') as f:
    old_problem = f.read()

# Extract the bottom parts starting from Task 5 (대기업 상생 솔루션)
bottom_parts = old_problem[old_problem.find('<!-- ✅ Task 5: 대기업 상생 ESG 솔루션'):]
bottom_parts = bottom_parts.replace('</section>', '').strip()

# Build the new accordion grid
new_accordions = """<!-- Accordion Grid -->
      <div class="mt-8 grid grid-cols-1 gap-4 mb-12">
        <!-- Item 1 -->
        <div class="acc-item group border border-ink-900/15 lcorner overflow-hidden bg-warm-50 transition-all">
          <button class="acc-btn w-full text-left p-5 flex items-center justify-between focus:outline-none">
            <div class="flex items-center gap-3">
              <span class="text-ink-900 font-mono font-bold text-[12px] md:text-sm">01</span>
              <h3 class="text-base md:text-lg font-extrabold text-ink-900" style="word-break:keep-all;">대한민국 산업 경쟁력의 기반</h3>
            </div>
            <i class="fa-solid fa-plus text-ink-500 transition-transform duration-300 acc-icon"></i>
          </button>
          <div class="acc-content h-0 overflow-hidden transition-all duration-300 px-5 opacity-0 bg-warm-50/40">
            <div class="pb-5 pt-2">
              <p class="body-md text-ink-700" style="word-break:keep-all;">현재 대한민국은 조선, 건설, 플랜트, 반도체, 방산 등 세계적인 산업 경쟁력을 보유하고 있습니다. 하지만 이러한 경쟁력은 수십 년 동안 현장을 지켜온 기술자들의 경험과 숙련 위에서 만들어졌습니다.</p>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="acc-item group border border-ink-900/15 lcorner overflow-hidden bg-warm-50 transition-all">
          <button class="acc-btn w-full text-left p-5 flex items-center justify-between focus:outline-none">
            <div class="flex items-center gap-3">
              <span class="text-ink-900 font-mono font-bold text-[12px] md:text-sm">02</span>
              <h3 class="text-base md:text-lg font-extrabold text-ink-900" style="word-break:keep-all;">산업 현장의 구조적 변화</h3>
            </div>
            <i class="fa-solid fa-plus text-ink-500 transition-transform duration-300 acc-icon"></i>
          </button>
          <div class="acc-content h-0 overflow-hidden transition-all duration-300 px-5 opacity-0 bg-warm-50/40">
            <div class="pb-5 pt-2">
              <p class="body-md text-ink-700" style="word-break:keep-all;">현재 산업 현장은 숙련 기술자의 고령화, 청년 기술자 감소, 외국인 인력 비중 증가라는 구조적 변화를 겪고 있습니다. 외국인 기술자는 이미 산업 현장의 중요한 구성원이 되었지만, 기술 전수와 경력 관리 체계는 아직 충분하지 않습니다. 반면 청년층은 기술직의 성장 가능성과 미래 비전을 체감하지 못해 현장 유입이 감소하고 있습니다.</p>
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="acc-item group border border-ink-900/15 lcorner overflow-hidden bg-warm-50 transition-all">
          <button class="acc-btn w-full text-left p-5 flex items-center justify-between focus:outline-none">
            <div class="flex items-center gap-3">
              <span class="text-ink-900 font-mono font-bold text-[12px] md:text-sm">03</span>
              <h3 class="text-base md:text-lg font-extrabold text-ink-900" style="word-break:keep-all;">사라지는 기술과 경험</h3>
            </div>
            <i class="fa-solid fa-plus text-ink-500 transition-transform duration-300 acc-icon"></i>
          </button>
          <div class="acc-content h-0 overflow-hidden transition-all duration-300 px-5 opacity-0 bg-warm-50/40">
            <div class="pb-5 pt-2">
              <p class="body-md text-ink-700" style="word-break:keep-all;">현장의 경험과 숙련은 대한민국 산업의 중요한 자산입니다. 그러나 현재는 기술자의 경력이 체계적으로 관리되지 않고, 경험과 노하우가 기록되지 않으며, 은퇴와 함께 기술이 사라지고 있습니다. 기술 전수가 단절되면 산업 경쟁력 역시 약화될 수 있습니다.</p>
            </div>
          </div>
        </div>

        <!-- Item 4 -->
        <div class="acc-item group border border-ink-900/15 lcorner overflow-hidden bg-warm-50 transition-all">
          <button class="acc-btn w-full text-left p-5 flex items-center justify-between focus:outline-none">
            <div class="flex items-center gap-3">
              <span class="text-ink-900 font-mono font-bold text-[12px] md:text-sm">04</span>
              <h3 class="text-base md:text-lg font-extrabold text-ink-900" style="word-break:keep-all;">MONO가 만들고 싶은 변화</h3>
            </div>
            <i class="fa-solid fa-plus text-ink-500 transition-transform duration-300 acc-icon"></i>
          </button>
          <div class="acc-content h-0 overflow-hidden transition-all duration-300 px-5 opacity-0 bg-warm-50/40">
            <div class="pb-5 pt-2">
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO VISION</span>
              </div>
              <p class="body-md text-ink-700" style="word-break:keep-all;">MONO는 기술자의 경험과 경력을 신뢰할 수 있는 데이터로 기록하고 연결합니다. 기술자는 자신의 경험을 자산으로 만들고, 기업은 검증된 인재를 확보하며, 내국인과 외국인 기술자는 함께 성장할 수 있습니다. 또한 현장의 기술과 숙련이 다음 세대로 이어질 수 있는 기반을 구축합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const accBtns = document.querySelectorAll('#problem .acc-btn');
          accBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              const content = btn.nextElementSibling;
              const icon = btn.querySelector('.acc-icon');
              const isExpanded = !content.classList.contains('h-0');

              // Close all others
              document.querySelectorAll('#problem .acc-content').forEach(c => {
                c.style.height = '0px';
                c.classList.add('h-0', 'opacity-0');
                c.classList.remove('opacity-100');
              });
              document.querySelectorAll('#problem .acc-icon').forEach(i => i.style.transform = 'rotate(0deg)');

              if (!isExpanded) {
                content.classList.remove('h-0', 'opacity-0');
                content.classList.add('opacity-100');
                content.style.height = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
              }
            });
          });
        });
      </script>"""

# New section 2 header + new accordions + closing message + restored bottom parts
new_section = f"""<section id="problem" class="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label text-xl md:text-2xl font-black mb-6"><span class="num text-[16px] md:text-[18px] px-3 py-1">02</span> MONO가 만들고 싶은 변화</div>
      <h2 class="h-display text-ink-900" style="word-break: keep-all; ">대한민국 산업 경쟁력의 핵심인 기술과 숙련이 다음 세대로 이어질 수 있도록</h2>
    </div>

    <div class="reveal">
{new_accordions}

      <!-- Closing Message Box -->
      <div class="mt-8 mb-12 p-8 md:p-10 bg-warm-100 border border-ink-900/15 lcorner shadow-neo-soft relative overflow-hidden text-center max-w-4xl mx-auto">
        <i class="fa-solid fa-quote-left text-3xl text-ink-200 mb-6 block"></i>
        <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-6" style="word-break: keep-all; line-height: 1.4;">
          대한민국 산업의 경쟁력은 기술자에게서 시작됩니다.
        </h4>
        <p class="text-[15px] md:text-[17px] text-ink-800 font-bold leading-relaxed mb-6" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 기록되며,<br class="hidden md:block">
          그 경험이 더 좋은 일자리와 성장 기회, 금융 혜택, 그리고 미래 기술의 기반이 될 수 있도록 연결합니다.
        </p>
        <p class="text-lg md:text-xl font-black text-tech-700" style="word-break: keep-all;">
          우리는 기술자의 경험이 개인의 경력을 넘어 산업의 자산이 되는 세상을 만들고자 합니다.
        </p>
      </div>

{bottom_parts}
  </div>
</section>"""

pattern = re.compile(r'<section id="problem".*?</section>', re.DOTALL)
html = pattern.sub(new_section, html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Restored accordion layout and bottom parts.")
