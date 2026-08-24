import re
import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Fix AR scale size (make it bigger, 0.02)
code = code.replace("this.currentModelGroup.scale.set(0.005, 0.005, 0.005);", "this.currentModelGroup.scale.set(0.02, 0.02, 0.02);")
code = code.replace("this.renderer.xr.isPresenting ? 0.005 : 1.0", "this.renderer.xr.isPresenting ? 0.02 : 1.0")

# 2. Add hotspots to currentModelGroup instead of scene
bad_hotspot_add = "if (this.scene) this.scene.add(beaconMesh);"
good_hotspot_add = "if (this.currentModelGroup) this.currentModelGroup.add(beaconMesh);"
code = code.replace(bad_hotspot_add, good_hotspot_add)

# 3. Add safety check: clearHotspots should also not break if they are in currentModelGroup
# Since we recreate currentModelGroup completely when switching viruses, the old hotspots are destroyed anyway.

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Scale increased and hotspots attached to model")
