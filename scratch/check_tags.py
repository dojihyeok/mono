import re

def check_html_tags(file_path):
    print(f"Checking HTML tag integrity for: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We will search for <div> and </div>, <section> and </section>, <ul> and </ul>, etc.
    tags_to_check = ['div', 'section', 'ul', 'li', 'h3', 'h4', 'span']
    
    # Strip comments to avoid parsing commented-out tags
    content_clean = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    errors = 0
    for tag in tags_to_check:
        open_tags = len(re.findall(rf'<{tag}\b', content_clean))
        close_tags = len(re.findall(rf'</{tag}>', content_clean))
        diff = open_tags - close_tags
        if diff != 0:
            print(f"  [ERROR] Tag <{tag}> mismatch: Open={open_tags}, Close={close_tags} (Diff={diff})")
            errors += 1
        else:
            print(f"  [OK] Tag <{tag}>: {open_tags} pairs matched perfectly.")
            
    if errors == 0:
        print("  => SUCCESS: All checked tags are perfectly balanced!")
        return True
    else:
        print("  => FAILURE: Tag imbalance detected.")
        return False

if __name__ == '__main__':
    import os
    public_pitch = '/Users/yunhyeok/mono/public/pitch.html'
    test_html = '/Users/yunhyeok/mono/test.html'
    
    print("=" * 60)
    check_html_tags(public_pitch)
    print("=" * 60)
    check_html_tags(test_html)
    print("=" * 60)
