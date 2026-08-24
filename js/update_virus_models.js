const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(filePath, 'utf8');

const newMethods = `
  // 9. HBV
  buildHBV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    // Envelope
    const radius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf1c40f, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : this.createBiomaterial(0xffda79, 0.6, 0.2);
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    // HBsAg Spikes
    if (!isHologram) {
      const spikeGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const spikeMat = this.createBiomaterial(0xd35400, 0.5, 0.1);
      const spikeCount = 80;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempRadius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * tempRadius;
        const z = Math.sin(theta) * tempRadius;
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x * radius, y * radius, z * radius);
        spike.scale.set(1.5, 1, 1.5);
        spike.lookAt(0, 0, 0);
        group.add(spike);
      }
    }

    // Capsid
    if (isCutaway || isHologram) {
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x27ae60, wireframe: true })
                                 : this.createBiomaterial(0xf39c12, 0.4, 0.1);
      const core = new THREE.Mesh(coreGeo, coreMat);
      if (isCutaway && !isHologram) {
         core.geometry = new THREE.IcosahedronGeometry(1.6, 1).toNonIndexed(); // Just simplified, we won't strictly cut the core for HBV
      }
      group.add(core);
    }
    return group;
  },

  // 10. Zika
  buildZika(mode = "surface") {
    // Reuse dengue logic but with different colors
    const group = this.buildDengue(mode);
    group.name = "zika";
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0xe84393); // Dark pink
            if (c.material.color.getHex() === 0x1dd1a1) c.material.color.setHex(0xfd79a8); // Light pink
         }
       });
    } else if (mode === "hologram") {
       group.children[0].material.color.setHex(0xe84393);
    }
    return group;
  },

  // 11. Rotavirus
  buildRotavirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Outer Capsid (VP7)
    const radius = 3;
    const vp7Geo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const vp7Mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0x74b9ff, 0.8, 0.1);
    const vp7 = new THREE.Mesh(vp7Geo, vp7Mat);
    group.add(vp7);

    // Spikes (VP4)
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.8, 8);
      const spikeMat = this.createBiomaterial(0xd63031, 0.4, 0.1);
      const spikeCount = 60;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempRadius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * tempRadius;
        const z = Math.sin(theta) * tempRadius;
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        const norm = new THREE.Vector3(x, y, z).normalize();
        spike.position.copy(norm).multiplyScalar(radius + 0.3);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
        spike.quaternion.copy(quaternion);
        group.add(spike);
      }
    }

    // Inner Capsid (VP6/VP2)
    if (isCutaway || isHologram) {
      const innerGeo = new THREE.IcosahedronGeometry(2.2, 2);
      const innerMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00cec9, wireframe: true })
                                  : this.createBiomaterial(0x81ecec, 0.6, 0.2);
      const inner = new THREE.Mesh(innerGeo, innerMat);
      group.add(inner);
    }
    return group;
  },

  // 12. HSV
  buildHSV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Envelope
    const radius = 3.5;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7675, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0xd63031, 0.7, 0.1);
    const env = new THREE.Mesh(envGeo, envMat);
    group.add(env);

    // Spikes
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const spikeMat = this.createBiomaterial(0x2d3436, 0.5, 0.1);
      for(let i=0; i<100; i++) {
        const y = 1 - (i / 99) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.2);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Tegument & Capsid
    if (isCutaway || isHologram) {
      // Tegument
      const tegGeo = new THREE.SphereGeometry(2.5, 32, 32);
      const tegMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xfdcb6e, wireframe: true, transparent: true, opacity: 0.2 })
                                : this.createBiomaterial(0xffeaa7, 0.9, 0, true, 0.7);
      group.add(new THREE.Mesh(tegGeo, tegMat));

      // Capsid
      const capGeo = new THREE.IcosahedronGeometry(1.5, 1);
      const capMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true })
                                : this.createBiomaterial(0x74b9ff, 0.4, 0.3);
      group.add(new THREE.Mesh(capGeo, capMat));
    }
    return group;
  },

  // 13. Norovirus
  buildNorovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const capGeo = new THREE.IcosahedronGeometry(2.5, 2);
    // Add cup depressions (naive bump via vertices displacement)
    const pos = capGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      // periodic depression based on angles
      const noise = Math.sin(v.x*4)*Math.sin(v.y*4)*Math.sin(v.z*4) * 0.15;
      v.normalize().multiplyScalar(2.5 + noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    capGeo.computeVertexNormals();

    const capMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true })
                              : this.createBiomaterial(0xa29bfe, 0.7, 0.1);
    
    let mesh;
    if (isCutaway && !isHologram) {
       // Manual cutaway (simple slicing using clipping or skipped geometry isn't easy here, we just use a half sphere trick)
       const halfGeo = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
       mesh = new THREE.Mesh(halfGeo, capMat);
    } else {
       mesh = new THREE.Mesh(capGeo, capMat);
    }
    group.add(mesh);
    return group;
  },

  // 14. HPV
  buildHPV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // 72 pentamers arranged in icosahedral symmetry, we'll approximate with Icosahedron details
    const radius = 2.8;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 3);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00b894, wireframe: true })
                           : this.createBiomaterial(0x55efc4, 0.8, 0.1);
    
    // Add little knobs for capsomeres
    if (!isHologram && !isCutaway) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        // simple bump
        v.normalize().multiplyScalar(radius + Math.abs(Math.sin(v.x*8)*Math.sin(v.y*8))*0.2);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }
    
    const cap = new THREE.Mesh(geo, mat);
    group.add(cap);

    if (isCutaway || isHologram) {
       const dnaGeo = new THREE.TorusGeometry(1, 0.1, 16, 50);
       const dnaMat = new THREE.MeshBasicMaterial({ color: 0xd63031 });
       const dna = new THREE.Mesh(dnaGeo, dnaMat);
       dna.rotation.x = Math.PI / 4;
       dna.rotation.y = Math.PI / 4;
       group.add(dna);
    }
    return group;
  },

  // 15. Measles
  buildMeasles(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Envelope
    const radius = 3.2;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe15f41, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0xf3a683, 0.7, 0.1);
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    // Spikes (H and F)
    if (!isHologram) {
      const hGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
      const fGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const hMat = this.createBiomaterial(0xc44569, 0.5, 0.1);
      const fMat = this.createBiomaterial(0x546de5, 0.5, 0.1);
      
      for(let i=0; i<120; i++) {
        const y = 1 - (i / 119) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        
        const isH = i % 2 === 0;
        const spike = new THREE.Mesh(isH ? hGeo : fGeo, isH ? hMat : fMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.25);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Helical RNP (like ebola but folded)
    if (isCutaway || isHologram) {
      const rnpGeo = new THREE.TorusKnotGeometry(1.5, 0.3, 100, 16);
      const rnpMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x303952, wireframe: true })
                                : this.createBiomaterial(0x596275, 0.5, 0.1);
      const rnp = new THREE.Mesh(rnpGeo, rnpMat);
      group.add(rnp);
    }
    return group;
  },

  createVirus(virusId, mode = "surface") {
    switch (virusId) {
      case "sars-cov-2": return this.buildSARSCoV2(mode);
      case "mpox": return this.buildMpox(mode);
      case "influenza-a": return this.buildInfluenzaA(mode);
      case "bacteriophage-t4": return this.buildBacteriophageT4(mode);
      case "ebola": return this.buildEbola(mode);
      case "dengue": return this.buildDengue(mode);
      case "rabies": return this.buildRabies(mode);
      case "hiv-1": return this.buildHIV1(mode);
      case "hbv": return this.buildHBV(mode);
      case "zika": return this.buildZika(mode);
      case "rotavirus": return this.buildRotavirus(mode);
      case "hsv": return this.buildHSV(mode);
      case "norovirus": return this.buildNorovirus(mode);
      case "hpv": return this.buildHPV(mode);
      case "measles": return this.buildMeasles(mode);
      default: return this.buildSARSCoV2(mode);
    }
  }
`;

// Replace createVirus method
const splitMarker = 'createVirus(virusId, mode = "surface") {';
const parts = code.split(splitMarker);

if(parts.length > 1) {
   let modifiedCode = parts[0] + newMethods + "\\n};\\n\\nif (typeof window !== \\"undefined\\") {\\n  window.VirusBuilder = VirusBuilder;\\n}\\n";
   fs.writeFileSync(filePath, modifiedCode, 'utf8');
   console.log('virusModels.js updated successfully.');
}
