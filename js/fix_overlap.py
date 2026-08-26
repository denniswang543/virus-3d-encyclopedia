import os
import re

css_path = r"d:\__AI\SLF\virus-3d\css\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Fix bottom-dock
css = css.replace("bottom: 30dvh; /* sits right on top of right-panel */", "bottom: 15px; /* relative to viewport-wrapper */")
css = css.replace("bottom: 30dvh;", "bottom: 15px;")

# Fix ARButton
css = css.replace("bottom: calc(30dvh + 70px) !important;", "bottom: calc(30dvh + 80px) !important;")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

ar_btn_path = r"d:\__AI\SLF\virus-3d\js\ARButton.js"
with open(ar_btn_path, "r", encoding="utf-8") as f:
    ar_js = f.read()

ar_js = ar_js.replace("HTTPS REQUIRED FOR AR", "⚠️ 內建瀏覽器不支援 AR<br>請改用 Chrome 開啟")

with open(ar_btn_path, "w", encoding="utf-8") as f:
    f.write(ar_js)

print("CSS and ARButton fixed.")
