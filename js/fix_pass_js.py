import re

html_path = r"d:\__AI\SLF\virus-3d\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Add Pass.js before EffectComposer
if "postprocessing/Pass.js" not in html:
    html = html.replace("postprocessing/EffectComposer.js", "postprocessing/Pass.js\"></script>\n  <script src=\"https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Pass.js added.")
