import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix BM Section Flow UI
content = content.replace('class="bg-tech-100 text-tech-800 px-3 py-1.5 rounded-sm border border-tech-200"', 'class="bg-warm-100 text-ink-800 px-3 py-1.5 rounded-sm border border-ink-900/10"')
content = content.replace('class="bg-tech-700 text-warm-50 px-3 py-1.5 rounded-sm border border-tech-800"', 'class="bg-ink-900 text-warm-50 px-3 py-1.5 rounded-sm border border-ink-900"')

# 2. Fix Future BM Card
# from: class="glass-dark border border-tech-400/30 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group"
content = content.replace(
    'class="glass-dark border border-tech-400/30 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group"',
    'class="bg-warm-100 border border-ink-900/20 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-ink-900"'
)
content = content.replace('<h3 class="text-2xl font-black text-warm-50">미래 가치 (5년 이상)</h3>', '<h3 class="text-2xl font-black text-ink-900">미래 가치 (5년 이상)</h3>')
content = content.replace('text-warm-100 mb-1 flex items-center', 'text-ink-900 mb-1 flex items-center')
content = content.replace('text-[13px] text-warm-200 leading-relaxed', 'text-[13px] text-ink-700 leading-relaxed')

# 3. Fix Foreign Worker Section
content = content.replace('id="global-pipeline" class="relative py-24 lg:py-32 bg-ink-900 text-warm-50 overflow-hidden"', 'id="global-pipeline" class="relative py-24 lg:py-32 bg-warm-50 text-ink-900 overflow-hidden"')
content = content.replace('class="section-label text-tech-400 mb-4"><span class="num bg-tech-400/20 text-tech-300">05</span>', 'class="section-label mb-4"><span class="num">05</span>')
content = content.replace('<h2 class="h-display text-warm-50 mb-6">외국인 기술자 생애주기 플랫폼</h2>', '<h2 class="h-display text-ink-900 mb-6">외국인 기술자 생애주기 플랫폼</h2>')
content = content.replace('text-warm-200 font-medium max-w-4xl', 'text-ink-700 font-medium max-w-4xl')
content = content.replace('class="text-tech-300"', 'class="text-ink-900 font-bold"')

# Fix Foreign Worker Cards
content = content.replace('bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400', 'bg-warm-100 border border-ink-900/10 p-6 rounded-sm hover:border-ink-900/30')
content = content.replace('text-tech-400 font-mono font-bold text-sm mb-3', 'text-ink-500 font-mono font-bold text-sm mb-3')
content = content.replace('text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300', 'text-xl font-bold text-ink-900 mb-3 group-hover:text-tech-700')
content = content.replace('text-sm text-warm-200 space-y-2', 'text-sm text-ink-700 space-y-2')
content = content.replace('class="text-warm-100"', 'class="font-bold text-ink-900"')
content = content.replace('text-tech-300 font-bold', 'text-ink-900 font-bold')
content = content.replace('border-t-4 border-t-tech-400', 'border-t-4 border-t-ink-900')

# Fix Foreign Worker BM Box
content = content.replace('bg-gradient-to-r from-tech-900 to-ink-800 border border-tech-700/50 p-8 md:p-10 lcorner reveal', 'bg-warm-200/50 border border-ink-900/10 p-8 md:p-10 lcorner reveal')
content = content.replace('text-2xl font-black text-warm-50 mb-6 border-b border-tech-700/50', 'text-2xl font-black text-ink-900 mb-6 border-b border-ink-900/10')
content = content.replace('text-tech-400 font-bold mb-3 flex items-center', 'text-ink-900 font-bold mb-3 flex items-center')
content = content.replace('text-warm-100 text-sm space-y-2', 'text-ink-700 text-sm space-y-2')

# Also change any stray text-tech-300/400 icons to standard tech-700 or ink-900
content = content.replace('fa-database text-tech-300', 'fa-database text-tech-600')
content = content.replace('fa-piggy-bank text-tech-300', 'fa-piggy-bank text-tech-600')
content = content.replace('fa-headset text-tech-300', 'fa-headset text-tech-600')
content = content.replace('fa-network-wired text-tech-300', 'fa-network-wired text-tech-600')
content = content.replace('fa-user-tie text-tech-300', 'fa-user-tie text-tech-600')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Theme updated successfully")
