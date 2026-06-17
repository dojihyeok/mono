from bs4 import BeautifulSoup

with open('mono_test.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

sections = soup.find_all('section')
for sec in sections[:3]:  # Print first 3 sections to see how simple they are
    print("---------------------------------")
    print(sec.prettify())
