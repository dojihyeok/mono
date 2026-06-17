import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure we only target the quote box by finding it
start_idx = html.find('<!-- Closing Message Box -->')
end_idx = html.find('</div>', start_idx + 100) # Need to find the end of the div carefully. 
end_idx = html.find('<!-- ✅ Task 5', start_idx)

if start_idx != -1 and end_idx != -1:
    quote_box = html[start_idx:end_idx]
    
    # Replace fonts
    new_quote_box = quote_box.replace('text-xl md:text-2xl font-black', 'text-2xl md:text-3xl lg:text-4xl font-black')
    new_quote_box = new_quote_box.replace('text-[15px] md:text-[17px]', 'text-[17px] md:text-[19px] lg:text-[21px]')
    new_quote_box = new_quote_box.replace('text-lg md:text-xl font-black', 'text-xl md:text-2xl lg:text-3xl font-black')
    new_quote_box = new_quote_box.replace('leading-relaxed', 'leading-[1.7]')
    
    html = html[:start_idx] + new_quote_box + html[end_idx:]
    
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fonts updated.")
else:
    print("Could not find quote box.")
