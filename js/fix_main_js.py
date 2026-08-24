import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Fix "this.this.renderer"
code = code.replace("this.this.renderer.xr.enabled", "this.renderer.xr.enabled")

# Make sure it's valid javascript syntax
code = code.replace("this.renderer.xr.enabled = true;\n    if (THREE.ARButton) {", "this.renderer.xr.enabled = true;\n    if (window.THREE && THREE.ARButton) {")

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Done")
