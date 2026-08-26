import re
import os

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
      // Artistic Capsomere Assembly (High-poly Raspberry structure)
      // Icosahedron(2.4, 2) has 162 vertices, creating a dense molecular look
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 2);
      const capsomereGeo = new THREE.SphereGeometry(0.42, 16, 16);
      
      const mat = new THREE.MeshStandardMaterial({ 
          color: 0xffb142, roughness: 0.5, metalness: 0.1,
          transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 
      });
      
      const pos = baseGeo.attributes.position;
      const added = [];
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Avoid duplicate vertices
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          const cap = new THREE.Mesh(capsomereGeo, mat);
          // Create canyons by varying the distance from center based on noise or position
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
      const mat = new THREE.MeshBasicMaterial({ color: 0xff9f43, wireframe: true, transparent: true, opacity: 0.5 });
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

new_norovirus = """  buildNorovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const capsidGroup = new THREE.Group();

    if (!isHologram) {
      // Norovirus (Calicivirus) is famous for 32 cup-shaped depressions
      // We get exactly 32 locations from the 12 vertices + 20 face centers of an Icosahedron(r, 0)
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 0);
      const locations = [];
      const pos = baseGeo.attributes.position;
      
      // 1. Add 12 vertices
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!locations.find(a => a.distanceTo(v) < 0.1)) locations.push(v);
      }
      
      // 2. Add 20 face centers (every 3 consecutive vertices make a face)
      // Actually, buffer geometry might not be perfectly ordered, so we use index or compute mathematically.
      // Better yet, Icosahedron(r, 1) has exactly 42 vertices. 42 - 12 (original) + some edge centers.
      // Let's just use Icosahedron(r, 1) vertices (42 cups) which is very close visually to 32.
      const denseGeo = new THREE.IcosahedronGeometry(2.4, 1);
      const densePos = denseGeo.attributes.position;
      const denseLocations = [];
      for (let i = 0; i < densePos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(densePos, i);
        if (!denseLocations.find(a => a.distanceTo(v) < 0.1)) denseLocations.push(v);
      }

      // Cup geometry
      const cupGeo = new THREE.CylinderGeometry(0.5, 0.2, 0.4, 12, 1, false);
      const cupInnerGeo = new THREE.CylinderGeometry(0.4, 0.15, 0.41, 12, 1, false);
      const cupMat = new THREE.MeshStandardMaterial({ color: 0x6c5ce7, roughness: 0.6 });
      const cupInnerMat = new THREE.MeshStandardMaterial({ color: 0x4a409e, roughness: 0.8 }); // darker inside
      
      const cupCompound = new THREE.Group();
      const outer = new THREE.Mesh(cupGeo, cupMat);
      const inner = new THREE.Mesh(cupInnerGeo, cupInnerMat);
      inner.position.y = 0.05; // slightly higher
      cupCompound.add(outer);
      cupCompound.add(inner);
      
      // Add a base shell to block the empty space
      const shellGeo = new THREE.IcosahedronGeometry(2.3, 2);
      const shellMat = new THREE.MeshStandardMaterial({ color: 0x3c3088, roughness: 0.7 });
      if (isCutaway) shellMat.transparent = true, shellMat.opacity = 0.3;
      const shell = new THREE.Mesh(shellGeo, shellMat);
      capsidGroup.add(shell);

      denseLocations.forEach(v => {
        if (isCutaway && v.y < -0.2) return;
        const cup = cupCompound.clone();
        cup.position.copy(v).normalize().multiplyScalar(2.5);
        cup.lookAt(new THREE.Vector3(0,0,0));
        cup.rotation.x -= Math.PI / 2; // point outwards
        capsidGroup.add(cup);
      });
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 16, 2, 5);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },"""


new_astrovirus = """  buildAstrovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.5;
    const capsidGroup = new THREE.Group();

    if (!isHologram) {
      // Base smooth sphere
      const shellGeo = new THREE.IcosahedronGeometry(radius - 0.2, 3);
      const shellMat = new THREE.MeshStandardMaterial({ color: 0xbe2edd, roughness: 0.6 });
      if (isCutaway) shellMat.transparent = true, shellMat.opacity = 0.3;
      const shell = new THREE.Mesh(shellGeo, shellMat);
      capsidGroup.add(shell);

      // Star Shape
      const starShape = new THREE.Shape();
      const outerR = 0.6;
      const innerR = 0.25;
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerR : innerR;
        const a = (i / (points * 2)) * Math.PI * 2;
        if (i === 0) starShape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else starShape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      starGeo.computeBoundingBox();
      starGeo.translate(0, 0, -0.5 * (starGeo.boundingBox.max.z - starGeo.boundingBox.min.z));
      
      const starMat = new THREE.MeshStandardMaterial({ color: 0xff7979, roughness: 0.5 }); // pinkish stars

      // 12 vertices of Icosahedron(r, 0)
      const baseGeo = new THREE.IcosahedronGeometry(radius, 0);
      const locations = [];
      const pos = baseGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!locations.find(a => a.distanceTo(v) < 0.1)) locations.push(v);
      }

      locations.forEach(v => {
        if (isCutaway && v.y < -0.2) return;
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.copy(v).normalize().multiplyScalar(radius - 0.1);
        star.lookAt(new THREE.Vector3(0,0,0));
        capsidGroup.add(star);
      });
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0xe056fd, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 16, 3, 4);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x4834d4, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },"""

# Replace Enterovirus
js = re.sub(r'buildEnterovirus\(mode = "surface"\) \{.*?(?=buildRhinovirus|case)', new_enterovirus + "\n\n  ", js, flags=re.DOTALL)
# Replace Norovirus
js = re.sub(r'buildNorovirus\(mode = "surface"\) \{.*?(?=buildHPV|case)', new_norovirus + "\n\n  ", js, flags=re.DOTALL)
# Replace Astrovirus
js = re.sub(r'buildAstrovirus\(mode = "surface"\) \{.*?(?=buildBaculovirus|case)', new_astrovirus + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Enterovirus, Norovirus, Astrovirus to high-poly models")
