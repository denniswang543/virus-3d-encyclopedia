import os

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

vzv_model = """
  buildVZV(mode = "surface") {
    // VZV is closely related to HSV, structurally identical (Envelope, Tegument, Capsid, DNA).
    // We will use the HSV builder and recolor it to a distinct "chickenpox" red/pink theme.
    const group = this.buildHSV(mode);
    group.name = "vzv";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: original HSV is probably some color, we will tint it
        // Check HSV colors in buildHSV: envelope is usually lipid color
        // Let's just override by name or roughly by hex if known, or just apply a general tint
        if (child.name === "hsv_envelope") {
            child.material.color.setHex(0xff4757); // Reddish envelope
        } else if (child.name === "hsv_tegument") {
            child.material.color.setHex(0xff708d); // Pinkish tegument
        } else if (child.name === "hsv_capsid") {
            child.material.color.setHex(0xf3a683); // Light orange/pink capsid
        }
      }
    });
    return group;
  },
"""

cases = """
        case "vzv": return this.buildVZV(mode);
"""

if "buildVZV" not in js:
    # We must insert it before createVirus, and add the case
    parts = js.split("createVirus(virusId, mode = \"surface\") {")
    js = parts[0] + vzv_model + "\n  createVirus(virusId, mode = \"surface\") {\n    switch (virusId) {\n" + cases + parts[1].split("switch (virusId) {")[1]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)
print("Updated virusModels.js")
