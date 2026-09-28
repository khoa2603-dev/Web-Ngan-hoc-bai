import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

keywords = ['modal', 'Modal', 'cheat', 'Cheat', 'calcGuide', 'openCalc', 'tab-biochem', 'tab-pt', 'tab-chem', 'sotay', 'Sotay']
for i, l in enumerate(lines):
    if any(kw in l for kw in keywords):
        print(f'Line {i+1}: {l.strip()[:120]}')
