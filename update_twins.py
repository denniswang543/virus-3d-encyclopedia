import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_rhino = """    const group = this.buildEnterovirus(mode);
    group.name = "rhinovirus";
    const isHologram = mode === "hologram";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        if (hex === 0x00bcd4) child.material.color.setHex(0xe84393); // Cyan -> Magenta
        else if (hex === 0xe1e66c) child.material.color.setHex(0x74b9ff); // Yellow -> Light Blue
        else if (hex === 0xd35400) child.material.color.setHex(0x6c5ce7); // Orange -> Purple
      }
    });
    return group;
  },"""

new_polio = """  buildPolio(mode = "surface") {
    const group = this.buildEnterovirus(mode);
    group.name = "polio";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        if (hex === 0x00bcd4) child.material.color.setHex(0xc0392b); // Cyan -> Red
        else if (hex === 0xe1e66c) child.material.color.setHex(0xbdc3c7); // Yellow -> Grey/White
        else if (hex === 0xd35400) child.material.color.setHex(0x2c3e50); // Orange -> Dark Blue
      }
    });
    return group;
  },"""

js = re.sub(r'    const group = this\.buildEnterovirus\(mode\);\n    group\.name = "rhinovirus";.*?return group;\n  \},', new_rhino, js, flags=re.DOTALL)

js = re.sub(r'  buildPolio\(mode = "surface"\) \{.*?return group;\n  \},', new_polio, js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Rhino and Polio")
