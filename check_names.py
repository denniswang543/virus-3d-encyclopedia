import re

with open(r'd:\__AI\SLF\virus-3d\js\virusData.js', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'chineseName:\s*"([^"]+)"', text)
print(f"Total: {len(matches)}")
for i, m in enumerate(matches):
    print(f"{i+1}: {m}")
