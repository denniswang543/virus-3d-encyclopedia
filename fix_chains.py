import os

filepath = r"d:\__AI\SLF\virus-3d\js\virusData.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "單鏈": "單股",
    "雙鏈": "雙股",
    "正鏈": "正股",
    "負鏈": "負股",
    "逆轉錄": "反轉錄",
    "氨基酸": "胺基酸",
    "乙肝": "B型肝炎",
    "丙肝": "C型肝炎",
    "甲肝": "A型肝炎"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated strands and reverse transcription terminology in virusData.js")
