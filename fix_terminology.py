import re
import os

files_to_check = [
    r"d:\__AI\SLF\virus-3d\js\virusData.js",
    r"d:\__AI\SLF\virus-3d\index.html"
]

replacements = {
    "甲型流感": "A型流感",
    "乙型流感": "B型流感",
    "丙型流感": "C型流感",
    "神經氨酸酶": "神經胺酸酶",
    "埃博拉": "伊波拉",
    "伊波拉病毒": "伊波拉病毒", # no change, but "埃博拉 / 伊波拉病毒" -> "伊波拉病毒"
    "埃博拉 / 伊波拉病毒": "伊波拉病毒",
    "免疫缺陷": "免疫缺乏",
    "艾滋": "愛滋",
    "登革熱病毒": "登革病毒",
    "狂犬病毒": "狂犬病病毒",
    "刺突蛋白": "棘蛋白",
    "刺突糖蛋白": "棘蛋白",
    "逆轉錄酶": "反轉錄酶",
    "亞基": "次單位",
    "氣溶膠": "氣膠",
    "寨卡": "茲卡",
    "諾如": "諾羅",
    "輪狀": "輪狀",
    "巨細胞": "巨細胞",
    "乳頭瘤": "乳突"
}

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(filepath)}")
    else:
        print(f"No changes in {os.path.basename(filepath)}")

