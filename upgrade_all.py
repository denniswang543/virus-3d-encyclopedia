import re
import os

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Inject makeOrganic helper if not exists
organic_helper = """
  // Helper to make geometries look like organic lipid membranes or irregular proteins
  makeOrganic(geo, amplitude = 0.2, frequency = 4) {
    if (!geo.attributes.position) return;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      // Pseudo-random cellular noise using sine/cosine
      const noise = Math.sin(v.x * frequency) * Math.cos(v.y * frequency) * Math.sin(v.z * frequency) * amplitude;
      v.addScaledVector(v.clone().normalize(), noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  },

  createVirus(virusId, mode = "surface") {"""

if "makeOrganic(geo," not in js:
    js = js.replace('  createVirus(virusId, mode = "surface") {', organic_helper)

# 2. Add organic noise to SARS-CoV-2 envelope
js = re.sub(r'(const envGeo =.*?SphereGeometry\(envRadius, 64, 64\);)', 
            r'\1\n      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 3);', js)

# 3. Add organic noise to Influenza A envelope
js = re.sub(r'(const envGeo =.*?SphereGeometry\(envRadius, 40, 40\);)', 
            r'\1\n      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 2.5);', js)

# 4. Add organic noise to HSV / VZV envelope
js = re.sub(r'(const envGeo =.*?SphereGeometry\(radius, 48, 48\);)', 
            r'\1\n      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3.5);', js)

# 5. Upgrade Adenovirus (Add capsomeres + keep fibers)
new_adenovirus = """  buildAdenovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "adenovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.0;
    const capsidGroup = new THREE.Group();
    
    if (!isHologram) {
      // High-poly capsomere assembly for Adenovirus (252 capsomeres)
      const baseGeo = new THREE.IcosahedronGeometry(2.8, 3); // Very dense
      const capsomereGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 6); // Hexons
      
      const mat = new THREE.MeshStandardMaterial({ 
          color: 0x0abde3, roughness: 0.7, metalness: 0.1,
          transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 
      });
      
      const pos = baseGeo.attributes.position;
      const added = [];
      const vertices = []; // save 12 original vertices for fibers
      const origIco = new THREE.IcosahedronGeometry(2.8, 0);
      
      for(let i=0; i<origIco.attributes.position.count; i++) {
         vertices.push(new THREE.Vector3().fromBufferAttribute(origIco.attributes.position, i));
      }

      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!added.find(a => a.distanceTo(v) < 0.2)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          const cap = new THREE.Mesh(capsomereGeo, mat);
          cap.position.copy(v);
          cap.lookAt(new THREE.Vector3(0,0,0));
          cap.rotation.x -= Math.PI/2;
          capsidGroup.add(cap);
        }
      }
      
      // Fibers
      const fiberGroup = new THREE.Group();
      const stalkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 5);
      const knobGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const fiberMat = new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.4 });
      
      vertices.forEach(v => {
         let isUnique = true;
         for(let c of fiberGroup.children) { if (c.position.distanceTo(v) < 0.1) isUnique = false; }
         if (isUnique) {
             const stalk = new THREE.Mesh(stalkGeo, fiberMat);
             stalk.position.copy(v).normalize().multiplyScalar(2.8 + 0.9);
             stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v.clone().normalize());
             
             const knob = new THREE.Mesh(knobGeo, fiberMat);
             knob.position.copy(v).normalize().multiplyScalar(2.8 + 1.8);
             
             fiberGroup.add(stalk);
             fiberGroup.add(knob);
         }
      });
      group.add(fiberGroup);

    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x0abde3, wireframe: true, transparent: isCutaway, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
      const dnaMat = new THREE.MeshStandardMaterial({ color: 0xee5253, roughness: 0.3 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },"""

js = re.sub(r'buildAdenovirus\(mode = "surface"\) \{.*?(?=buildEnterovirus|case)', new_adenovirus + "\n\n  ", js, flags=re.DOTALL)

# 6. Upgrade TMV (Tobacco Mosaic Virus) to Helical Spheres
new_tmv = """  buildTMV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    if (!isHologram) {
      const capsidGroup = new THREE.Group();
      const capGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xbadc58, roughness: 0.6, transparent: isCutaway, opacity: isCutaway ? 0.4 : 1 });
      
      const RNAgeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 3, 0)
      ]), 100, 0.08, 8, false);
      const RNAMat = new THREE.MeshStandardMaterial({ color: 0xff4757 });
      const rnaSpiral = new THREE.Group();

      // Helical assembly
      let y = -3;
      let angle = 0;
      while (y < 3) {
        if (!(isCutaway && y > 0 && Math.cos(angle) > 0)) {
           const cap = new THREE.Mesh(capGeo, capMat);
           cap.position.set(Math.cos(angle)*1.0, y, Math.sin(angle)*1.0);
           capsidGroup.add(cap);
        }
        
        if (y % 0.2 < 0.05) {
           const rPiece = new THREE.Mesh(new THREE.SphereGeometry(0.06), RNAMat);
           rPiece.position.set(Math.cos(angle)*0.6, y, Math.sin(angle)*0.6);
           rnaSpiral.add(rPiece);
        }

        y += 0.02;
        angle += 0.3;
      }
      group.add(capsidGroup);
      if (isCutaway) group.add(rnaSpiral);
      
    } else {
      const geo = new THREE.CylinderGeometry(1.2, 1.2, 6, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0xbadc58, wireframe: true });
      group.add(new THREE.Mesh(geo, mat));
    }
    return group;
  },"""
js = re.sub(r'buildTMV\(mode = "surface"\) \{.*?(?=buildM13|case)', new_tmv + "\n\n  ", js, flags=re.DOTALL)

# 7. Upgrade Orf Virus to "Ball of Yarn" (Torus Knot)
new_orf = """  buildOrf(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Orf virus (Parapoxvirus) has a highly distinctive oval "ball of yarn" structure
    if (!isHologram) {
      // Create a dense spiral filament wrapping an oval core
      const coreGeo = new THREE.SphereGeometry(1.8, 32, 32);
      coreGeo.scale(1, 1.4, 1);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.8, transparent: isCutaway, opacity: 0.3 });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      // The yarn wrap (using a dense TorusKnot to simulate spiral filaments)
      const yarnGeo = new THREE.TorusKnotGeometry(1.4, 0.15, 300, 16, 13, 21);
      yarnGeo.scale(1, 1.4, 1); // stretch into oval
      const yarnMat = new THREE.MeshStandardMaterial({ color: 0xff7979, roughness: 0.5 });
      const yarn = new THREE.Mesh(yarnGeo, yarnMat);
      
      if (isCutaway) {
         // Cutaway of yarn using clipping planes or just skipping (since it's a single geo, scaling down is easier or we just use transparency)
         yarn.material.transparent = true;
         yarn.material.opacity = 0.5;
      }
      group.add(yarn);

      if (isCutaway) {
         // Inner dumbbell DNA core
         const dumbGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.0, 16);
         const dumbMat = new THREE.MeshStandardMaterial({ color: 0xee5253, roughness: 0.5 });
         group.add(new THREE.Mesh(dumbGeo, dumbMat));
      }
    } else {
      const geo = new THREE.SphereGeometry(2, 16, 16);
      geo.scale(1, 1.4, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff7979, wireframe: true });
      group.add(new THREE.Mesh(geo, mat));
    }
    return group;
  },"""
js = re.sub(r'buildOrf\(mode = "surface"\) \{.*?(?=buildPhi29|case)', new_orf + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Massive high-poly upgrade injected!")
