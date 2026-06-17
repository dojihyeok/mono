from bs4 import BeautifulSoup

with open('mono_test.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

sections = soup.find_all('section')
print(f"Found {len(sections)} sections in mono_test.html.")
for i, sec in enumerate(sections):
    h2 = sec.find('h2')
    title = h2.text.strip() if h2 else "No Title"
    print(f"Section {i+1}: {sec.get('id', 'no-id')} - {title}")
    
    h3s = sec.find_all('h3')
    for h3 in h3s:
        print(f"  - {h3.text.strip()}")

