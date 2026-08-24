import re
import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Replace the camera calculation with a hardcoded position (0, 0, -0.6)
bad_pos_calc = """          const cameraDir = new THREE.Vector3();
          this.camera.getWorldDirection(cameraDir);
          const spawnPos = this.camera.position.clone().add(cameraDir.multiplyScalar(0.8));
          this.currentModelGroup.position.copy(spawnPos);"""

good_pos_calc = """          // AR Coordinate System: 
          // (0,0,0) is where the phone is when START AR is clicked.
          // -Z is forward, +Y is up, +X is right.
          // Place the virus exactly 60cm directly in front of the phone, and slightly down.
          this.currentModelGroup.position.set(0, -0.1, -0.6);"""

code = code.replace(bad_pos_calc, good_pos_calc)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Position fixed")
