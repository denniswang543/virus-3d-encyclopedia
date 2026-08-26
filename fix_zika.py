import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_zika = """  buildZika(mode = "surface") {
    // Reuse dengue logic but with different colors
    const group = this.buildDengue(mode);
    group.name = "zika";
    
    group.traverse((c) => {
       if (c.isMesh && c.material && c.material.color) {
          const hex = c.material.color.getHex();
          if (hex === 0x3498db || hex === 0x0fb9b1) c.material.color.setHex(0x1abc9c);
          if (hex === 0x9b59b6 || hex === 0x2bcbba) c.material.color.setHex(0xe84393);
          if (hex === 0xf1c40f || hex === 0x20bf6b) c.material.color.setHex(0x74b9ff);
       }
    });
    
    return group;
  },"""

js = re.sub(r'buildZika\(mode = "surface"\) \{.*?(?=case|buildRotavirus)', new_zika + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Fixed Zika")
