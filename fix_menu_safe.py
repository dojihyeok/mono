with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<!-- Mobile navigation drawer / overlay overlay drawer for flawless mobile responsiveness -->'
end_marker = '</header>'

start_idx = html.find(start_marker)
end_idx = html.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    menu_block = html[start_idx:end_idx]
    
    # Remove menu block from its original position
    new_html = html[:start_idx] + html[end_idx:]
    
    # Now end_marker is at html[end_idx:], so it's in new_html right at the cut point
    # We want to insert menu_block AFTER </header>
    new_html = new_html.replace('</header>', '</header>\n\n' + menu_block)
    
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Safely moved menu drawer out of header.")
else:
    print("Could not find markers.")
