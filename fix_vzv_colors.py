import os
import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_vzv = """
  buildVZV(mode = "surface") {
    // VZV is closely related to HSV, structurally identical (Envelope, Tegument, Capsid, DNA).
    // We will use the HSV builder and recolor it to a distinct "chickenpox" red/pink theme.
    const group = this.buildHSV(mode);
    group.name = "vzv";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: 0xd63031 -> 0xff4757
        if (hex === 0xd63031 || hex === 0xff7675) child.material.color.setHex(0xff4757);
        // Spikes: 0x2d3436 -> 0xff7f50
        if (hex === 0x2d3436) child.material.color.setHex(0xff7f50);
        // Tegument: 0xffeaa7 -> 0xffa502
        if (hex === 0xffeaa7 || hex === 0xfdcb6e) child.material.color.setHex(0xffa502);
        // Capsid: 0x74b9ff -> 0x2ed573
        if (hex === 0x74b9ff || hex === 0x0984e3) child.material.color.setHex(0x2ed573);
      }
    });
    return group;
  },
"""

# Replace the old buildVZV if it exists
js = re.sub(r'buildVZV\(mode = "surface"\) \{.*?(?=buildAdenovirus|case)', new_vzv, js, flags=re.DOTALL)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated VZV colors in virusModels.js")
