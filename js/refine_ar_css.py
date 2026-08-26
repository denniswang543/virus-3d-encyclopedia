import re

css_path = r"d:\__AI\SLF\virus-3d\css\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Replace ARButton block
ar_btn_old = r"#ARButton \{[\s\S]*?\}"
ar_btn_new = """#ARButton {
    bottom: calc(30dvh + 70px) !important;
    z-index: 999999 !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    padding: 10px 20px !important;
    font-size: 14px !important;
    text-align: center !important;
    background: var(--accent-cyan) !important;
    color: #000 !important;
    border-radius: 20px !important;
    width: max-content !important;
    max-width: 90vw !important;
  }"""
css = re.sub(ar_btn_old, ar_btn_new, css)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("ARButton refined")
