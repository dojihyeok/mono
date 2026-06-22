import re

file_path = '/Users/yunhyeok/mono/public/pitch.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hex colors
replacements = {
    # Backgrounds and warm colors to light slate/off-white
    '#F4EFE6': '#FCFCFE',
    '#FAF7F2': '#FFFFFF',
    '#EBE3D2': '#F1F5F9',
    '#DCD0B6': '#E2E8F0',
    '#C5B796': '#CBD5E1',
    '#1B1A17': '#0F172A',
    'rgba(244, 239, 230, 0.9)': 'rgba(252, 252, 254, 0.9)',
    'rgba(244, 239, 230, 0.96)': 'rgba(252, 252, 254, 0.96)',
    'rgba(251, 249, 244, 0.93)': 'rgba(255, 255, 255, 0.93)',
    
    # Tech Teal to Indigo
    '#0E7490': '#4F46E5',  # tech-700
    '#06B6D4': '#6366F1',  # tech-500
    '#0891B2': '#4338CA',  # tech-600
    '#155E75': '#3730A3',  # tech-800
    '#0F3A4D': '#312E81',  # tech-900
    '#ECFEFF': '#F5F7FF',  # tech-50
    '#CFFAFE': '#E0E7FF',  # tech-100
    '#A5F3FC': '#C7D2FE',  # tech-200
    '#67E8F9': '#818CF8',  # tech-300
    '#22D3EE': '#6366F1',  # tech-400
    '#A5F3FC': '#C7D2FE',
    
    # Text colors / specific accents
    '#C5A880': '#818CF8',
    '#67E8F9': '#818CF8',
    
    # RGBA styling elements
    'rgba(14, 116, 144, 0.16)': 'rgba(79, 70, 229, 0.16)',
    'rgba(14, 116, 144, 0.07)': 'rgba(79, 70, 229, 0.07)',
    'rgba(34, 211, 238, 0.35)': 'rgba(99, 102, 241, 0.35)',
    'rgba(14, 116, 144, 0.04)': 'rgba(79, 70, 229, 0.04)',
    'rgba(34, 211, 238, 0.08)': 'rgba(99, 102, 241, 0.08)',
    'rgba(6, 182, 212, 0.35)': 'rgba(99, 102, 241, 0.35)',
    'rgba(14, 116, 144, 0.18)': 'rgba(79, 70, 229, 0.18)',
    'rgba(34, 211, 238, 0.15)': 'rgba(99, 102, 241, 0.15)',
    'rgba(14, 116, 144, 0.5)': 'rgba(79, 70, 229, 0.5)',
    'rgba(6, 182, 212, 0.1)': 'rgba(99, 102, 241, 0.1)',
    'rgba(14, 116, 144, 0.3)': 'rgba(79, 70, 229, 0.3)',
    'rgba(14, 116, 144, 0.75)': 'rgba(79, 70, 229, 0.75)',
    'rgba(14, 116, 144, 0.35)': 'rgba(79, 70, 229, 0.35)',
    'rgba(14, 116, 144, 0.45)': 'rgba(79, 70, 229, 0.45)',
    'rgba(14, 116, 144, 0.08)': 'rgba(79, 70, 229, 0.08)',
    'rgba(15, 58, 77, 0.55)': 'rgba(15, 23, 42, 0.55)',
    'rgba(10, 15, 26, 0.72)': 'rgba(15, 23, 42, 0.72)',
    'rgba(103, 232, 249, 0.55)': 'rgba(129, 140, 248, 0.55)',
    'rgba(14, 116, 144, 0.25)': 'rgba(79, 70, 229, 0.25)',
    'rgba(165, 243, 252, 0.25)': 'rgba(199, 210, 254, 0.25)',
    'rgba(15, 58, 77, 0.06)': 'rgba(15, 23, 42, 0.06)',
    'rgba(15, 58, 77, 0.10)': 'rgba(15, 23, 42, 0.10)',
    'rgba(15, 58, 77, 0.18)': 'rgba(15, 23, 42, 0.18)',
    'rgba(8, 145, 178, 0.22)': 'rgba(79, 70, 229, 0.22)',
    'rgba(34, 211, 238, 0.10)': 'rgba(99, 102, 241, 0.10)',
    'rgba(242, 194, 0, 0.10)': 'rgba(79, 70, 229, 0.10)',
    'rgba(6, 182, 212, 0.08)': 'rgba(99, 102, 241, 0.08)',
    'rgba(34, 211, 238, 0.22)': 'rgba(99, 102, 241, 0.22)',
    'rgba(34, 211, 238, 0.08)': 'rgba(99, 102, 241, 0.08)',
    'rgba(10, 15, 26, 0.08)': 'rgba(15, 23, 42, 0.08)',
    'rgba(10, 15, 26, 0.04)': 'rgba(15, 23, 42, 0.04)',
    'rgba(10, 15, 26, 0.10)': 'rgba(15, 23, 42, 0.10)',
    'rgba(10, 15, 26, 0.18)': 'rgba(15, 23, 42, 0.18)',
    'rgba(10, 15, 26, 0.03)': 'rgba(15, 23, 42, 0.03)',
    'rgba(10, 15, 26, 0.05)': 'rgba(15, 23, 42, 0.05)',
}

# Apply all replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Update colors inside tailwind.config
content = re.sub(
    r"warm:\s*\{\s*50:\s*'#F4EFE6',\s*100:\s*'#EBE3D2',\s*200:\s*'#DCD0B6',\s*300:\s*'#C5B796',\s*900:\s*'#1B1A17'\s*\}",
    "warm: { 50:'#FCFCFE', 100:'#F1F5F9', 200:'#E2E8F0', 300:'#CBD5E1', 900:'#0F172A' }",
    content
)

content = re.sub(
    r"tech:\s*\{\s*50:\s*'#ECFEFF',\s*100:\s*'#CFFAFE',\s*200:\s*'#A5F3FC',\s*300:\s*'#67E8F9',\s*400:\s*'#22D3EE',\s*50:\s*'#06B6D4',\s*600:\s*'#0891B2',\s*700:\s*'#0E7490',\s*800:\s*'#155E75',\s*900:\s*'#0F3A4D'\s*\}",
    "tech: { 50:'#F5F7FF', 100:'#E0E7FF', 200:'#C7D2FE', 300:'#818CF8', 400:'#6366F1', 500:'#4F46E5', 600:'#4338CA', 700:'#3730A3', 800:'#312E81', 900:'#1E1B4B' }",
    content
)

# Replace remaining class colors (e.g., text-tech-600, border-tech-500, etc.)
class_replacements = {
    'text-tech-600': 'text-indigo-600',
    'text-tech-700': 'text-indigo-700',
    'text-tech-400': 'text-indigo-400',
    'bg-tech-600': 'bg-indigo-600',
    'bg-tech-700': 'bg-indigo-700',
    'bg-tech-900': 'bg-indigo-900',
    'bg-tech-50': 'bg-indigo-50',
    'border-tech-500/50': 'border-indigo-500/50',
    'border-t-tech-600': 'border-t-indigo-600',
    'shadow-[#06B6D4]/25': 'shadow-indigo-500/25',
    '#06B6D4': '#6366F1',
    '#0891B2': '#4F46E5',
    '#0E7490': '#4338CA',
}

for old, new in class_replacements.items():
    content = content.replace(old, new)

# Write output
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Theme conversion script finished successfully.")
