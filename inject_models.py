import os

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_models = """
  // === NEW VIRUSES ===
  buildAdenovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "adenovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.0;
    const geo = new THREE.IcosahedronGeometry(radius, 2);
    
    const mat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.5 })
      : new THREE.MeshStandardMaterial({
          color: 0x0abde3,
          roughness: 0.6,
          metalness: 0.1,
          flatShading: true,
          transparent: isCutaway,
          opacity: isCutaway ? 0.2 : 1.0,
          side: THREE.DoubleSide
        });
    const capsid = new THREE.Mesh(geo, mat);
    capsid.name = "adenovirus_capsid";
    group.add(capsid);

    // Penton fibers (12 vertices of an icosahedron)
    const baseIco = new THREE.IcosahedronGeometry(radius, 0);
    const vertices = [];
    const pos = baseIco.attributes.position;
    for(let i=0; i<pos.count; i+=3) {
      // get unique vertices (approximate by rounding)
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      vertices.push(v);
    }
    
    // De-duplicate vertices
    const uniqueVerts = [];
    vertices.forEach(v => {
        if (!uniqueVerts.find(uv => uv.distanceTo(v) < 0.1)) {
            uniqueVerts.push(v);
        }
    });

    const fiberStalkGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 5);
    const fiberKnobGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const fiberMat = isHologram 
        ? new THREE.MeshBasicMaterial({ color: 0xff9f43, wireframe: true })
        : new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.4, emissive: 0xff9f43, emissiveIntensity: 0.2 });

    uniqueVerts.forEach(v => {
      const dir = v.clone().normalize();
      
      const stalk = new THREE.Mesh(fiberStalkGeo, fiberMat);
      stalk.position.copy(v).add(dir.clone().multiplyScalar(0.75));
      stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      group.add(stalk);
      
      const knob = new THREE.Mesh(fiberKnobGeo, fiberMat);
      knob.position.copy(v).add(dir.clone().multiplyScalar(1.5));
      group.add(knob);
    });

    if (isCutaway && !isHologram) {
      // DNA Core
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
      const dnaMat = new THREE.MeshStandardMaterial({ color: 0xee5253, roughness: 0.3 });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      group.add(dna);
    }

    return group;
  },

  buildEnterovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "enterovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    // EV has deep canyons. We simulate by Dodecahedron and scaling centers
    const geo = new THREE.IcosahedronGeometry(radius, 3);
    const mat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xff9f43, wireframe: true, transparent: true, opacity: 0.5 })
      : new THREE.MeshStandardMaterial({ 
          color: 0xffb142, 
          roughness: 0.7, 
          bumpScale: 0.1,
          transparent: isCutaway,
          opacity: isCutaway ? 0.3 : 1.0,
          side: THREE.DoubleSide
        });

    const capsid = new THREE.Mesh(geo, mat);
    
    // Create 'canyons' by manipulating vertices based on noise or distance to faces
    const pos = geo.attributes.position;
    for(let i=0; i<pos.count; i++){
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Simple procedural noise bump
        const noise = Math.sin(v.x * 3) * Math.cos(v.y * 3) * Math.sin(v.z * 3);
        if (noise < 0) v.addScaledVector(v.clone().normalize(), noise * 0.3);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    group.add(capsid);

    if (isCutaway && !isHologram) {
      // RNA Core
      const rnaGeo = new THREE.TorusKnotGeometry(1.0, 0.4, 64, 8, 3, 7);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildRhinovirus(mode = "surface") {
    // Very similar to Enterovirus structurally, just different coloring and slightly sharper bumps
    const group = this.buildEnterovirus(mode);
    group.name = "rhinovirus";
    const isHologram = mode === "hologram";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        if (child.material.color.getHex() === 0xffb142) {
           child.material.color.setHex(0x1dd1a1); // Capsid color
        } else if (child.material.color.getHex() === 0x10ac84) {
           child.material.color.setHex(0xff9f43); // RNA color
        }
      }
    });
    return group;
  },

  buildInfluenzaB(mode = "surface") {
    // Structural twin of Influenza A, but with blue/cyan aesthetics instead of red/pink
    const group = this.buildInfluenzaA(mode);
    group.name = "influenza-b";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: 0x1e3799 -> slightly brighter blue for B
        if (hex === 0x1e3799) child.material.color.setHex(0x0a3d62);
        // HA (red 0xeb2f06) -> Blue/Cyan HA
        if (hex === 0xeb2f06) child.material.color.setHex(0x54a0ff);
        // NA (cyan 0x00d2d3) -> Yellow/Orange NA
        if (hex === 0x00d2d3) child.material.color.setHex(0xfeca57);
      }
    });
    return group;
  },
"""

cases = """
        case "adenovirus": return this.buildAdenovirus(mode);
        case "enterovirus": return this.buildEnterovirus(mode);
        case "rhinovirus": return this.buildRhinovirus(mode);
        case "influenza-b": return this.buildInfluenzaB(mode);
"""

if "buildAdenovirus" not in js:
    # Insert new models before createVirus
    parts = js.split("createVirus(virusId, mode = \"surface\") {")
    js = parts[0] + new_models + "\n  createVirus(virusId, mode = \"surface\") {\n    switch (virusId) {\n" + cases + parts[1].split("switch (virusId) {")[1]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js)

print("Updated virusModels.js")
