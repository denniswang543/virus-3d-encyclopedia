import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

with open('temp_models.js', 'r', encoding='utf-16') as f:
    temp_js = f.read()

def get_function(code, func_name):
    pattern = r'  ' + func_name + r'\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus|\n  // Helper)'
    m = re.search(pattern, code, re.DOTALL)
    if m:
        return m.group(0)
    return None

polio = get_function(temp_js, 'buildPolio')
hcv = get_function(temp_js, 'buildHCV')
rubella = get_function(temp_js, 'buildRubella')

# Overwrite Polio with the multi-color version!
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
  },
"""

insertion = ""
if 'buildPolio(mode = "surface") {' not in js:
    insertion += new_polio + "\n"
if hcv and 'buildHCV(mode = "surface") {' not in js:
    insertion += hcv + "\n"
if rubella and 'buildRubella(mode = "surface") {' not in js:
    insertion += rubella + "\n"

if insertion:
    js = js.replace('  createVirus(virusId, mode = "surface") {', insertion + '  createVirus(virusId, mode = "surface") {')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Restored missing Polio, HCV, Rubella")
