with open('/Users/yunhyeok/mono/refer/MONO_BM.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

line_72 = lines[71] # 0-indexed line 72
print(f"Line 72 length: {len(line_72)}")

# Let's search for keywords on line 72 and print their contexts
import re
for kw in ["적용 방식", "Pain Point", "PMF", "ARPU", "GTM"]:
    matches = [m.start() for m in re.finditer(kw, line_72)]
    print(f"Keyword '{kw}' matches: {len(matches)}")
    if matches:
        # Print a snippet around the first match
        first = matches[0]
        start = max(0, first - 100)
        end = min(len(line_72), first + 200)
        print(f"  Snippet: {line_72[start:end]}\n")
