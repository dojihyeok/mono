with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R1 updates
html = html.replace('<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">지역 예선</div>', '<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R1-지역 예선</div>')
html = html.replace('<h3 class="h-section text-ink-900">성실한 도전자의 일지.</h3>', '<h3 class="h-section text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>')

# R2 updates
html = html.replace('<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">지역별 오디션</div>', '<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R2-지역 오디션</div>')
html = html.replace('<h3 class="h-section text-ink-900">작동하는 연결의 첫 증명.</h3>', '<h3 class="h-section text-ink-900">지역별 멘토 기관 대상 공개 IR 오디션</h3>')

# R3 updates
html = html.replace('<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">권역별 오디션</div>', '<div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R3-권역 오디션</div>')
html = html.replace('<h3 class="h-section text-ink-900">자산 경량화 · 자본 효율의 증명.</h3>', '<h3 class="h-section text-ink-900">기술분야별 전문 투자사 대상 권역별 비공개 IR 오디션</h3>')

# R4 updates
html = html.replace('<div class="chip bg-warm-200 text-ink-900 border border-ink-200 mb-3">전국 오디션</div>', '<div class="chip bg-warm-200 text-ink-900 border border-ink-200 mb-3">R4-전국 오디션</div>')
html = html.replace('<h3 class="h-section text-ink-900">감동 서사 × 딥테크의 피날레.</h3>', '<h3 class="h-section text-ink-900">파이널 오디션</h3>')

# Also, if vstep-dot "R1" is redundant when the chip says "R1-지역 예선", let's clear the text from vstep-dot to avoid visual duplication, or change it to checkmarks or numbers!
# Wait, let's keep vstep-dot empty or just as numbers 1, 2, 3, 4 so it's "1", "R1-지역 예선".
html = html.replace('<span class="vstep-dot">R1</span>', '<span class="vstep-dot">1</span>')
html = html.replace('<span class="vstep-dot">R2</span>', '<span class="vstep-dot">2</span>')
html = html.replace('<span class="vstep-dot">R3</span>', '<span class="vstep-dot">3</span>')
html = html.replace('<span class="vstep-dot" style="background:#FFD200;color:#0A0F1A;">R4</span>', '<span class="vstep-dot" style="background:#FFD200;color:#0A0F1A;">4</span>')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated successfully.")
