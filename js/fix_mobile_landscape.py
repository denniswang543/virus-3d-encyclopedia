import re

# 1. FIX CSS
css_path = r"d:\__AI\SLF\virus-3d\css\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Remove ALL existing #ARButton blocks to start clean
css = re.sub(r"#ARButton\s*\{[^}]*\}", "", css)

# Remove the old desktop hide rule if it exists
css = re.sub(r"/\* Hide AR button on desktop \*/\s*@media \(min-width: 769px\) \{\s*\}", "", css)
css = re.sub(r"@media \(min-width: 769px\) \{\s*#ARButton\s*\{[^}]*\}\s*\}", "", css)

# New CSS for AR Button and Hint Overlay
new_css = """
/* AR Button Styling */
#ARButton {
  position: absolute !important;
  top: 15px !important;
  right: 15px !important;
  bottom: auto !important;
  left: auto !important;
  transform: none !important;
  z-index: 999999 !important;
  padding: 10px 20px !important;
  font-size: 14px !important;
  font-weight: bold !important;
  text-align: center !important;
  background: var(--accent-cyan) !important;
  color: #000 !important;
  border-radius: 20px !important;
  width: max-content !important;
  max-width: 90vw !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
}

/* Device-specific Visibility Rules */
@media (pointer: fine) {
  /* Hide AR button on devices with a mouse (Desktop/Laptop) */
  #ARButton { display: none !important; }
}

@media (hover: none) {
  /* Hide mouse instructions on touch devices (Mobile/Tablet) */
  .hint-overlay { display: none !important; }
}
"""

css += new_css

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

# 2. FIX MAIN.JS to append ARButton to viewport-wrapper instead of body
js_path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace("document.body.appendChild(arBtn);", "document.querySelector('.viewport-wrapper').appendChild(arBtn);")

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js)

print("Fixed ARButton position, mobile landscape issues, and hint overlay.")
