import re
import os
import shutil

html_path = r"d:\__AI\SLF\virus-3d\index.html"
backup_path = r"d:\__AI\SLF\virus-3d\index_backup_no_bloom.html"
if not os.path.exists(backup_path):
    shutil.copy(html_path, backup_path)

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Add CDNs for post-processing
post_cdns = """
  <!-- Post-Processing Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>

  <!-- Application Scripts -->"""

if "EffectComposer" not in html:
    html = html.replace("<!-- Application Scripts -->", post_cdns)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("CDNs injected")
