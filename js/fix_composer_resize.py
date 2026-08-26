import os

main_path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(main_path, "r", encoding="utf-8") as f:
    js = f.read()

resize_old = "this.renderer.setSize(width, height);"
resize_new = "this.renderer.setSize(width, height);\n      if (this.composer) this.composer.setSize(width, height);"
if "this.composer.setSize(width, height)" not in js:
    js = js.replace(resize_old, resize_new)

with open(main_path, "w", encoding="utf-8") as f:
    f.write(js)
print("Added resize handler for composer.")
