import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the modal container background
# Search for the modal div line: <div class="bg-transparent rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onclick="event.stopPropagation()">
old_modal_div = '<div class="bg-transparent rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onclick="event.stopPropagation()">'
new_modal_div = '<div class="bg-warm-50 rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onclick="event.stopPropagation()">'

html = html.replace(old_modal_div, new_modal_div)

# Also, there's another <div class="bg-transparent"> around the 5 point list in the main page.
# Wait, if the main page 5-point list has bg-transparent, does it cause the list to appear on top of the modal?
# NO, the modal has z-index 50, but maybe the modal backdrop is broken?
# The dialog is: <dialog id="r1-strategy-modal" class="bg-transparent w-full h-full p-0 m-0 fixed inset-0 z-50 backdrop:bg-ink-900/50">
# Wait, the screenshot shows the 5-point list OVERLAPPING the modal content!
# Wait! Look at the screenshot! 
# In the screenshot, the text "1라운드 준비 전략" and the list is visible ON TOP of the modal text!
# Why? Because the <div class="mt-8 pt-7 border-t border-ink-900/10"> or something has a higher z-index? No, I didn't add z-index.
# Ah, if the <dialog> is NOT the topmost layer? Modern browsers put <dialog> on the top layer.
# Unless... the screenshot is showing the main page (not the modal), and the 5-point list has `bg-transparent` so we can see the BACKGROUND grid lines behind it?
# Wait! Look at the screenshot again carefully!
# The background is a white page with grid lines. 
# On top of it is the R1 card.
# The R1 card has a section "1라운드 준비 전략".
# The user's screenshot has NO MODAL OPEN in the background!
# Wait, the screenshot shows the modal's contents... NO! 
# The screenshot shows the R1 card overlapping with the modal!
# No, wait... Look at the text: "4. 투자 전략 수립", "5. 정부/파트너 협력 전략"
# Those are in the MODAL! 
# "1라운드 준비 전략" and the 5-point list are from the MAIN PAGE!
# Why are they overlapping?
# BECAUSE the modal has `bg-transparent` wrapper! So the modal is literally transparent, and when it opens OVER the main page, you can see the main page THROUGH the modal!
# YES! That's exactly it! The modal itself was transparent, so the main page text was showing through it!
# By changing `old_modal_div` to `bg-warm-50`, the modal will now be opaque, and the main page will be properly hidden behind it!

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed modal background.")
