import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define regex patterns to capture the sections
def get_section(content, section_id):
    pattern = r'(<section id="' + section_id + r'".*?</section>)'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1) if match else None

platform = get_section(content, 'platform')
problem = get_section(content, 'problem')
gtm = get_section(content, 'gtm')
invest = get_section(content, 'invest')
lifecycle = get_section(content, 'lifecycle')
vision = get_section(content, 'vision')

# Remove them from the content (except platform, which we'll use as a base)
content = content.replace(problem, '')
content = content.replace(gtm, '')
content = content.replace(invest, '')
content = content.replace(lifecycle, '')
content = content.replace(vision, '')

# Now insert them back in the new order after platform
# We will find the end of platform and append the new order
new_order = f"\n\n{gtm}\n\n{invest}\n\n{problem}\n\n{vision}\n\n{lifecycle}\n\n"

# find the end of platform
pattern = r'(<section id="platform".*?</section>)'
match = re.search(pattern, content, re.DOTALL)
platform_str = match.group(1)

content = content.replace(platform_str, platform_str + new_order)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reordered successfully!")
