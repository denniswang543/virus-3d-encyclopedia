import os

main_path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(main_path, "r", encoding="utf-8") as f:
    js = f.read()

old_logic = """if (child.material.color.getHex() === 0xf39c12 || child.material.color.getHex() === 0xd35400) {"""
new_logic = """if (typeof child.material.color.getHex === 'function' && (child.material.color.getHex() === 0xf39c12 || child.material.color.getHex() === 0xd35400)) {"""

if "typeof child.material.color.getHex" not in js:
    js = js.replace(old_logic, new_logic)

with open(main_path, "w", encoding="utf-8") as f:
    f.write(js)
print("Safety check added.")
