const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(filePath, 'utf8');

const newMethods = `
  // 16. HCV
  buildHCV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    const radius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xffb142, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : this.createBiomaterial(0xffda79, 0.6, 0.2);
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    if (!isHologram) {
      const spikeGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const spikeMat = this.createBiomaterial(0xffb142, 0.4, 0.1);
      for(let i=0; i<150; i++) {
        const y = 1 - (i / 149) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(Math.cos(theta)*tempR*radius, y*radius, Math.sin(theta)*tempR*radius);
        group.add(spike);
      }
    }
    if (isCutaway || isHologram) {
      const coreGeo = new THREE.IcosahedronGeometry(1.8, 1);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xc56cf0, wireframe: true }) : this.createBiomaterial(0xcd84f1, 0.5, 0.2);
      group.add(new THREE.Mesh(coreGeo, coreMat));
    }
    return group;
  },

  // 17. Poliovirus
  buildPoliovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    // Polyhedron with canyons (represented by Icosahedron with bumps)
    const radius = 3;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 4);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x34ace0, wireframe: true }) : this.createBiomaterial(0x70a1ff, 0.6, 0.1);
    
    if (!isHologram && !isCutaway) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        // create canyon-like depressions
        const noise = Math.sin(v.x*6)*Math.sin(v.y*6)*Math.sin(v.z*6) * 0.15;
        v.normalize().multiplyScalar(radius + noise);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }
    group.add(new THREE.Mesh(geo, mat));

    if (isCutaway || isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.2, 0.1, 64, 8, 3, 4);
      const rnaMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  // 18. Marburg
  buildMarburg(mode = "surface") {
    const group = this.buildEbola(mode);
    group.name = "marburg";
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0xeb4d4b) c.material.color.setHex(0xb33939);
            if (c.material.color.getHex() === 0xff7979) c.material.color.setHex(0xff5252);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0xb33939);
    }
    return group;
  },

  // 19. RSV
  buildRSV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.2;
    // Pleomorphic so we make it slightly squashed
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    envGeo.scale(1, 0.9, 1.1);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x33d9b2, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0x34ace0, 0.7, 0.1);
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
      const fGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
      const gGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const fMat = this.createBiomaterial(0x218c74, 0.5, 0.1);
      const gMat = this.createBiomaterial(0xffda79, 0.5, 0.1);
      
      for(let i=0; i<150; i++) {
        const y = 1 - (i / 149) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y*0.9, Math.sin(theta)*tempR*1.1).normalize();
        
        const isF = i % 3 !== 0;
        const spike = new THREE.Mesh(isF ? fGeo : gGeo, isF ? fMat : gMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.3);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      const rnpGeo = new THREE.TorusKnotGeometry(1.6, 0.2, 100, 16);
      const rnpMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x2c2c54, wireframe: true }) : this.createBiomaterial(0x40407a, 0.5, 0.1);
      group.add(new THREE.Mesh(rnpGeo, rnpMat));
    }
    return group;
  },

  // 20. EBV
  buildEBV(mode = "surface") {
    const group = this.buildHSV(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0xd63031) c.material.color.setHex(0x706fd3);
            if (c.material.color.getHex() === 0x2d3436) c.material.color.setHex(0x474787);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0x706fd3);
    }
    return group;
  },

  // 21. VZV
  buildVZV(mode = "surface") {
    const group = this.buildHSV(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0xd63031) c.material.color.setHex(0xff5252);
            if (c.material.color.getHex() === 0x2d3436) c.material.color.setHex(0xff793f);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0xff5252);
    }
    return group;
  },

  // 22. CMV
  buildCMV(mode = "surface") {
    const group = this.buildHSV(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0xd63031) c.material.color.setHex(0x227093);
            if (c.material.color.getHex() === 0x2d3436) c.material.color.setHex(0x34ace0);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0x227093);
    }
    return group;
  },

  // 23. Yellow Fever
  buildYellowFever(mode = "surface") {
    const group = this.buildDengue(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0xfbc531);
            if (c.material.color.getHex() === 0x20bf6b) c.material.color.setHex(0xe1b12c);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0xfbc531);
    }
    return group;
  },

  // 24. West Nile
  buildWestNile(mode = "surface") {
    const group = this.buildDengue(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0x40739e);
            if (c.material.color.getHex() === 0x20bf6b) c.material.color.setHex(0x487eb0);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0x40739e);
    }
    return group;
  },

  // 25. Chikungunya
  buildChikungunya(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 4);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x9c88ff, wireframe: true }) : this.createBiomaterial(0x8c7ae6, 0.6, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    if (!isHologram) {
      // Add spikes arranged symmetrically
      const spikeGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.5, 6);
      const spikeMat = this.createBiomaterial(0x7158e2, 0.5, 0.1);
      const pos = geo.attributes.position;
      // We take a subset of vertices for spikes to approximate T=4
      for (let i = 0; i < pos.count; i += 6) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (isCutaway && v.y < -0.2 * radius) continue;
        v.normalize();
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(v).multiplyScalar(radius + 0.25);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      const coreGeo = new THREE.IcosahedronGeometry(1.8, 2);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf368e0, wireframe: true }) : this.createBiomaterial(0xff9ff3, 0.6, 0.2);
      group.add(new THREE.Mesh(coreGeo, coreMat));
    }
    return group;
  },

  // 26. MERS-CoV
  buildMERS(mode = "surface") {
    const group = this.buildSARSCoV2(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x4a1525) c.material.color.setHex(0xc23616); // Envelope
            if (c.material.color.getHex() === 0xff3d71) c.material.color.setHex(0xe84118); // Spike
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0xc23616);
    }
    return group;
  },

  // 27. Adenovirus
  buildAdenovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0097e6, wireframe: true }) : this.createBiomaterial(0x00a8ff, 0.7, 0.1);
    
    // Smooth the faces a bit to look like capsomeres if surface
    if (!isHologram && !isCutaway) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        v.normalize().multiplyScalar(radius + Math.abs(Math.sin(v.x*6)*Math.sin(v.y*6))*0.1);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }
    group.add(new THREE.Mesh(geo, mat));

    // Fibers at the 12 vertices of an icosahedron
    if (!isHologram) {
      const ico = new THREE.IcosahedronGeometry(radius, 0);
      const vertices = ico.attributes.position;
      const fiberGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
      const knobGeo = new THREE.SphereGeometry(0.15, 12, 12);
      const fiberMat = this.createBiomaterial(0x7f8fa6, 0.5, 0.1);
      const knobMat = this.createBiomaterial(0xe1b12c, 0.4, 0.2);

      const added = new Set();
      for (let i = 0; i < vertices.count; i++) {
        const v = new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
        const key = v.x.toFixed(2)+","+v.y.toFixed(2)+","+v.z.toFixed(2);
        if (added.has(key)) continue;
        added.add(key);
        
        if (isCutaway && v.y < -0.2 * radius) continue;
        v.normalize();
        
        const fiber = new THREE.Mesh(fiberGeo, fiberMat);
        fiber.position.copy(v).multiplyScalar(radius + 0.75);
        fiber.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(fiber);
        
        const knob = new THREE.Mesh(knobGeo, knobMat);
        knob.position.copy(v).multiplyScalar(radius + 1.5);
        group.add(knob);
      }
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 16);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x4cd137 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  // 28. Rhinovirus
  buildRhinovirus(mode = "surface") {
    const group = this.buildPoliovirus(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x70a1ff) c.material.color.setHex(0x44bd32);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0x4cd137);
    }
    return group;
  },

  // 29. Lassa
  buildLassa(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.2;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe056fd, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0xbe2edd, 0.7, 0.1);
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
      const spikeMat = this.createBiomaterial(0x686de0, 0.5, 0.1);
      for(let i=0; i<120; i++) {
        const y = 1 - (i / 119) * 2;
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

    if (isCutaway || isHologram) {
      // Sandy appearance (ribosomes)
      const riboGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const riboMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf9ca24, wireframe: true }) : this.createBiomaterial(0xf0932b, 0.5, 0.1);
      for(let i=0; i<50; i++) {
        const x = (Math.random()-0.5)*4;
        const y = (Math.random()-0.5)*4;
        const z = (Math.random()-0.5)*4;
        if(x*x + y*y + z*z < 6) {
          if (isCutaway && y > 0) continue; 
          const ribo = new THREE.Mesh(riboGeo, riboMat);
          ribo.position.set(x, y, z);
          group.add(ribo);
        }
      }
      // Ambisense RNA loops
      const rnaGeo = new THREE.TorusGeometry(1, 0.05, 8, 32);
      const rnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b });
      const rna1 = new THREE.Mesh(rnaGeo, rnaMat);
      rna1.rotation.x = Math.PI/3;
      const rna2 = new THREE.Mesh(rnaGeo, rnaMat);
      rna2.rotation.y = Math.PI/3;
      if (!isCutaway || !isHologram) { // Just add them, cutaway naturally reveals
        group.add(rna1);
        group.add(rna2);
      }
    }
    return group;
  },

  // 30. Nipah
  buildNipah(mode = "surface") {
    const group = this.buildMeasles(mode);
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0xf3a683) c.material.color.setHex(0x5f27cd); // Envelope
            if (c.material.color.getHex() === 0xc44569) c.material.color.setHex(0x341f97); // H spike
            if (c.material.color.getHex() === 0x546de5) c.material.color.setHex(0x4834d4); // F spike
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0x5f27cd);
    }
    return group;
  },
`;

const switchStatement = `
      case "hcv": return this.buildHCV(mode);
      case "poliovirus": return this.buildPoliovirus(mode);
      case "marburg": return this.buildMarburg(mode);
      case "rsv": return this.buildRSV(mode);
      case "ebv": return this.buildEBV(mode);
      case "vzv": return this.buildVZV(mode);
      case "cmv": return this.buildCMV(mode);
      case "yellow-fever": return this.buildYellowFever(mode);
      case "west-nile": return this.buildWestNile(mode);
      case "chikungunya": return this.buildChikungunya(mode);
      case "mers-cov": return this.buildMERS(mode);
      case "adenovirus": return this.buildAdenovirus(mode);
      case "rhinovirus": return this.buildRhinovirus(mode);
      case "lassa": return this.buildLassa(mode);
      case "nipah": return this.buildNipah(mode);
`;

const replaceMarker = 'case "measles": return this.buildMeasles(mode);';
let newCode = code.replace(replaceMarker, replaceMarker + '\\n' + switchStatement);

const splitMarker = 'createVirus(virusId, mode = "surface") {';
const parts = newCode.split(splitMarker);
if(parts.length > 1) {
   let modifiedCode = parts[0] + newMethods + "\\n  " + splitMarker + parts[1];
   fs.writeFileSync(filePath, modifiedCode, 'utf8');
   console.log('virusModels.js updated successfully with 15 new models.');
}
