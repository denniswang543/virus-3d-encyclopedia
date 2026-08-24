import re
import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Replace the previous scale and position logic
old_logic = """          this.currentModelGroup.scale.set(0.02, 0.02, 0.02);
          
          // AR Coordinate System: 
          // (0,0,0) is where the phone is when START AR is clicked.
          // -Z is forward, +Y is up, +X is right.
          // Place the virus exactly 60cm directly in front of the phone, and slightly down.
          this.currentModelGroup.position.set(0, -0.1, -0.6);"""

new_logic = """          // Make the virus much smaller (0.5% scale) so it doesn't engulf the camera
          this.currentModelGroup.scale.set(0.005, 0.005, 0.005);
          
          // Place it exactly 1 meter straight in front of the camera
          this.currentModelGroup.position.set(0, 0, -1.0);"""

code = code.replace(old_logic, new_logic)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Scale and position fixed in main.js")
