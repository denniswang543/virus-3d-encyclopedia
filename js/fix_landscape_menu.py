import re

css_path = r"d:\__AI\SLF\virus-3d\css\style.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Fix 100vh to 100dvh for mobile address bar bug
css = css.replace("100vh", "100dvh")
css = css.replace("calc(100vh", "calc(100dvh")

# 2. Fix bottom-dock to not exceed viewport-wrapper width and properly center/scroll
old_dock = r"\.bottom-dock\s*\{[^}]*\}"
new_dock = """.bottom-dock {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 40;
    backdrop-filter: blur(16px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    flex-wrap: nowrap;
    width: max-content;
    max-width: 96%; /* ensure it doesn't spill out of viewport-wrapper */
    overflow-x: auto;
    white-space: nowrap;
    justify-content: flex-start;
}"""

css = re.sub(old_dock, new_dock, css, count=1) # replace only the main one

# 3. Enhance mobile landscape media query
# If height is very small (landscape phones), we should make sure the dock is visible
landscape_mq = """
/* Mobile Landscape Fixes */
@media (max-height: 500px) and (orientation: landscape) {
  .top-navbar { height: 45px; padding: 0 10px; }
  .app-container { padding-top: 45px; }
  .bottom-dock { bottom: 10px; padding: 4px 10px; gap: 8px; }
  .mode-btn { font-size: 10px; padding: 4px 8px; }
  .dock-tool-btn { width: 30px; height: 30px; font-size: 12px; }
  .left-sidebar { width: 200px; }
  .right-sidebar { width: 250px; }
}
"""
css += landscape_mq

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Fixed vh and bottom-dock layout.")
