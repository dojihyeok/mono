with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_gtm_start = '<!-- Timeline Stepper UI for 6 steps -->'
new_gtm_start = '''<!-- Flowchart Image -->
    <div class="mb-16 reveal relative rounded-xl overflow-hidden shadow-2xl border border-ink-900/10">
      <img src="/images/mono_data_flowchart.png" alt="MONO Growth Flowchart" class="w-full h-auto object-cover mix-blend-multiply" style="mix-blend-mode: multiply;" loading="lazy" />
    </div>

    <!-- Timeline Stepper UI for 6 steps -->'''

if old_gtm_start in html:
    html = html.replace(old_gtm_start, new_gtm_start)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added flowchart image safely.")
else:
    print("Could not find GTM start.")
