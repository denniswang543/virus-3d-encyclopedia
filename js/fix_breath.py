import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

bad_anim = """    if (this.currentModelGroup) {
      const time = performance.now() * 0.0015;
      const scaleDelta = 1.0 + Math.sin(time) * 0.015;
      this.currentModelGroup.scale.set(scaleDelta, scaleDelta, scaleDelta);
    }"""

good_anim = """    if (this.currentModelGroup) {
      const time = performance.now() * 0.0015;
      const baseScale = this.renderer.xr.isPresenting ? 0.005 : 1.0;
      const scaleDelta = baseScale + Math.sin(time) * (0.015 * baseScale);
      this.currentModelGroup.scale.set(scaleDelta, scaleDelta, scaleDelta);
    }"""

if bad_anim in code:
    code = code.replace(bad_anim, good_anim)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Breathing animation AR fix applied")
else:
    print("Could not find the target code to replace")
