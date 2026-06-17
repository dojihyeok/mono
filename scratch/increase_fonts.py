import os

files = [
    "/Users/yunhyeok/mono/public/pitch.html",
    "/Users/yunhyeok/mono/test.html",
    "/Users/yunhyeok/mono/temp_pitch/client/public/pitch.html",
    "/Users/yunhyeok/mono/temp_pitch_only.html"
]

for filepath in files:
    if os.path.exists(filepath):
        print(f"Processing: {filepath}")
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace text-[11.5px] with text-[14px]
        new_content = content.replace("text-[11.5px]", "text-[14px]")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Not found: {filepath}")
