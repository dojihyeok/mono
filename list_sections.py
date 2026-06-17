from bs4 import BeautifulSoup
import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

sections = soup.find_all('div', class_='section-label')
for sec in sections:
    print(sec.get_text(strip=True))
