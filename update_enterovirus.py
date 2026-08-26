import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_enterovirus = """  buildEnterovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "enterovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const capsidGroup = new THREE.Group();
    
    if (!isHologram) {
      // Artistic Capsomere Assembly (High-poly pseudo T=3 structure)
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 2);
      const capsomereGeo = new THREE.SphereGeometry(0.42, 16, 16);
      
      // We need the 12 main vertices of a base Icosahedron to identify the pentamers
      const coreGeo = new THREE.IcosahedronGeometry(2.4, 0);
      const corePos = coreGeo.attributes.position;
      const coreVertices = [];
      for (let i = 0; i < corePos.count; i++) {
        coreVertices.push(new THREE.Vector3().fromBufferAttribute(corePos, i));
      }

      // Materials for VP1, VP2, VP3 equivalents
      const matCyan = new THREE.MeshStandardMaterial({ color: 0x00bcd4, roughness: 0.5, metalness: 0.1, transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 });
      const matYellow = new THREE.MeshStandardMaterial({ color: 0xe1e66c, roughness: 0.5, metalness: 0.1, transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 });
      const matOrange = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.5, metalness: 0.1, transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 });

      const pos = baseGeo.attributes.position;
      const added = [];
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Avoid duplicate vertices
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          // Find distance to closest core vertex
          let minDist = Infinity;
          for (let j = 0; j < coreVertices.length; j++) {
            const dist = v.distanceTo(coreVertices[j]);
            if (dist < minDist) minDist = dist;
          }

          // Assign color based on proximity to the 12 5-fold axes
          let mat = matYellow; // Default bulk
          if (minDist < 0.1) {
             continue; // Skip the exact vertex to leave a "pore" or hole at the 5-fold axis
          } else if (minDist < 1.0) {
             mat = matCyan; // Star around the pore
          } else if (minDist > 1.35) {
             mat = matOrange; // Interstitial proteins
          }

          const cap = new THREE.Mesh(capsomereGeo, mat);
          // Create canyons by varying the distance from center
          const noise = Math.sin(v.x*4)*Math.cos(v.y*4)*Math.sin(v.z*4);
          cap.position.copy(v).normalize().multiplyScalar(2.6 + noise * 0.15);
          
          // Flatten the sphere slightly along the normal to look like a protein complex
          cap.lookAt(new THREE.Vector3(0,0,0));
          cap.scale.set(1, 1, 0.7);
          
          capsidGroup.add(cap);
        }
      }
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00bcd4, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 16, 3, 7);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },"""

js = re.sub(r'  buildEnterovirus\(mode = "surface"\) \{.*?(?=\n  build|\n    const group = this\.buildEnterovirus|\n  createVirus)', new_enterovirus + '\n', js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Enterovirus")
