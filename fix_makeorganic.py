import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

make_organic_code = """
  // Helper to make geometries look like organic lipid membranes or irregular proteins
  makeOrganic(geo, amplitude = 0.2, frequency = 4) {
    if (!geo.attributes.position) return;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const dist = v.length();
      if (dist === 0) continue;
      const noise = Math.sin(v.x * frequency) * Math.cos(v.y * frequency) * Math.sin(v.z * frequency);
      v.normalize().multiplyScalar(dist + noise * amplitude);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  },
"""

if "makeOrganic(geo," not in js:
    # insert before createVirus
    js = js.replace('  createVirus(virusId, mode = "surface") {', make_organic_code + '\n  createVirus(virusId, mode = "surface") {')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added makeOrganic back!")
else:
    print("makeOrganic already exists")
