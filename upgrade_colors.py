import re
import os

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update HIV
js = re.sub(r'(color: 0x10ac84.*?// env color for HIV)', r'color: 0x5f27cd', js) # Just replacing all 0x10ac84 in HIV might be risky if I can't target perfectly. Let's use robust regex.

js = re.sub(r'buildHIV1\(mode = "surface"\) \{.*?(?=buildHBV|case)', 
"""  buildHIV1(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hiv-1";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.9;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 4);

    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x5f27cd, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0x341f97, roughness: 0.8, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Spikes (gp120 / gp41) - Magenta and Cyan
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.8, 8);
      const spikeMat = new THREE.MeshStandardMaterial({ color: 0x0abde3, roughness: 0.4 }); // Cyan stalk
      const knobGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const knobMat = new THREE.MeshStandardMaterial({ color: 0xff9ff3, roughness: 0.4 }); // Magenta knob

      const spikeCount = 30; // HIV has very few spikes, but let's make it match the dense cartoonish look of the ref
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < 40; i++) {
        const y = 1 - (i / 39) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();

        const noise = Math.sin(norm.x * 4) * Math.cos(norm.y * 4) * Math.sin(norm.z * 4) * 0.15;
        
        const stalk = new THREE.Mesh(spikeGeo, spikeMat);
        stalk.position.copy(norm).multiplyScalar(envRadius + noise + 0.3);
        stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(stalk);

        const knob = new THREE.Mesh(knobGeo, knobMat);
        knob.position.copy(norm).multiplyScalar(envRadius + noise + 0.8);
        group.add(knob);
      }
    }

    if (isCutaway || isHologram) {
      const coreGeo = new THREE.ConeGeometry(1.2, 2.8, 16);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xc8d6e5, wireframe: true })
                                 : new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.6 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.rotation.x = Math.PI / 2;
      group.add(core);
    }
    return group;
  },\n\n  """, js, flags=re.DOTALL)

# 2. Update HBV
js = re.sub(r'buildHBV\(mode = "surface"\) \{.*?(?=buildZika|case)',
"""  buildHBV(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hbv";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const radius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.1, 4.5);
    
    // Bright orange to match image
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff9f43, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Dark orange dense bumps
    if (!isHologram) {
      const spikeGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const spikeMat = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.8 });
      const spikeCount = 120;
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount-1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        
        const noise = Math.sin(norm.x * 4.5) * Math.cos(norm.y * 4.5) * Math.sin(norm.z * 4.5) * 0.1;
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(norm).multiplyScalar(radius + noise + 0.1);
        
        // Flatten slightly to look like a surface protein
        spike.lookAt(new THREE.Vector3(0,0,0));
        spike.scale.set(1, 1, 0.6);
        group.add(spike);
      }
    }

    if (isCutaway && !isHologram) {
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x1dd1a1, roughness: 0.5 });
      group.add(new THREE.Mesh(coreGeo, coreMat));
    }
    return group;
  },\n\n  """, js, flags=re.DOTALL)

# 3. Update Ebola
js = re.sub(r'buildEbola\(mode = "surface"\) \{.*?(?=buildDengue|case)',
"""  buildEbola(mode = "surface") {
    const group = new THREE.Group();
    group.name = "ebola";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Wavy 8-shape curve matching the image exactly
    const curvePoints = [
      new THREE.Vector3(-2, -3, 0),
      new THREE.Vector3(2, -2, 1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(2, 2, 1),
      new THREE.Vector3(-2, 3, 0),
      new THREE.Vector3(-3, 1, -1),
      new THREE.Vector3(0, 1.5, 0.5),
      new THREE.Vector3(3, 1, 0)
    ];

    const ebolaCurve = new THREE.CatmullRomCurve3(curvePoints);
    ebolaCurve.tension = 0.8;

    const tubeRadius = 0.6;
    const tubeGeo = new THREE.TubeGeometry(ebolaCurve, 128, tubeRadius, 24, false);
    
    // Pink/Magenta to match image
    const tubeMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff4757, wireframe: true, transparent: true, opacity: 0.4 })
                               : new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.6 });
    group.add(new THREE.Mesh(tubeGeo, tubeMat));

    return group; // Skip the dense spikes to match the clean smooth worm in the image
  },\n\n  """, js, flags=re.DOTALL)

# 4. Update Influenza A
js = re.sub(r'buildInfluenzaA\(mode = "surface"\) \{.*?(?=buildBacteriophageT4|case)',
"""  buildInfluenzaA(mode = "surface") {
    const group = new THREE.Group();
    group.name = "influenza-a";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3);

    // Blue envelope
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0x0984e3, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
      // Cyan HA spikes
      const haGeo = new THREE.Group();
      haGeo.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.1, 6), new THREE.MeshStandardMaterial({ color: 0x00cec9 })));
      const haHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x00cec9 }));
      haHead.position.y = 0.5;
      haGeo.add(haHead);

      // Pink NA spikes
      const naGeo = new THREE.Group();
      naGeo.add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.9, 6), new THREE.MeshStandardMaterial({ color: 0xff7979 })));
      const naHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.3), new THREE.MeshStandardMaterial({ color: 0xff7979 }));
      naHead.position.y = 0.45;
      naGeo.add(naHead);

      const spikeCount = 140;
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();

        const noise = Math.sin(norm.x * 3) * Math.cos(norm.y * 3) * Math.sin(norm.z * 3) * 0.2;
        const isHA = i % 4 !== 0; // mostly HA
        
        const spike = isHA ? haGeo.clone() : naGeo.clone();
        spike.position.copy(norm).multiplyScalar(envRadius + noise + (isHA ? 0.4 : 0.3));
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      for(let i=0; i<8; i++) {
         const rna = new THREE.Mesh(new THREE.TorusKnotGeometry(0.4, 0.1, 32, 8, 2, 3), new THREE.MeshStandardMaterial({ color: 0xfeca57 }));
         rna.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
         group.add(rna);
      }
    }
    return group;
  },\n\n  """, js, flags=re.DOTALL)

# 5. Update Rabies
js = re.sub(r'buildRabies\(mode = "surface"\) \{.*?(?=buildHIV1|case)',
"""  buildRabies(mode = "surface") {
    const group = new THREE.Group();
    group.name = "rabies";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const bodyRadius = 1.6;
    const bodyHeight = 3.6;
    const bulletGroup = new THREE.Group();

    // Dark teal/green body
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x16a085, wireframe: true, transparent: true, opacity: 0.4 })
                           : new THREE.MeshStandardMaterial({ color: 0x16a085, roughness: 0.8, side: THREE.DoubleSide });

    const cylGeo = isCutaway ? new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32, 1, false, 0, Math.PI * 1.1) : new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32);
    const domeGeo = isCutaway ? new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 1.1, 0, Math.PI * 0.5) : new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);

    const cyl = new THREE.Mesh(cylGeo, mat);
    const dome = new THREE.Mesh(domeGeo, mat);
    dome.position.y = bodyHeight / 2;

    bulletGroup.add(cyl);
    bulletGroup.add(dome);

    if (!isHologram) {
      // Light green spikes
      const spikeGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.5, 6);
      const spikeMat = new THREE.MeshStandardMaterial({ color: 0x78e08f, roughness: 0.5 });
      
      const pos = cylGeo.attributes.position;
      for (let i = 0; i < pos.count; i += 12) {
         if (isCutaway && (i % 2 === 0)) continue;
         const v = new THREE.Vector3().fromBufferAttribute(pos, i);
         const norm = new THREE.Vector3(v.x, 0, v.z).normalize();
         if (norm.lengthSq() < 0.1) continue;
         const spike = new THREE.Mesh(spikeGeo, spikeMat);
         spike.position.copy(v).add(norm.clone().multiplyScalar(0.25));
         spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
         bulletGroup.add(spike);
      }
      const dpos = domeGeo.attributes.position;
      for (let i = 0; i < dpos.count; i += 12) {
         if (isCutaway && (i % 2 === 0)) continue;
         const v = new THREE.Vector3().fromBufferAttribute(dpos, i);
         const norm = v.clone().normalize();
         const spike = new THREE.Mesh(spikeGeo, spikeMat);
         spike.position.copy(v).add(norm.clone().multiplyScalar(0.25));
         spike.position.y += bodyHeight / 2;
         spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
         bulletGroup.add(spike);
      }
    }
    
    group.add(bulletGroup);
    return group;
  },\n\n  """, js, flags=re.DOTALL)

# 6. Update Bacteriophage T4
js = re.sub(r'buildBacteriophageT4\(mode = "surface"\) \{.*?(?=buildEbola|case)',
"""  buildBacteriophageT4(mode = "surface") {
    const group = new THREE.Group();
    group.name = "bacteriophage-t4";
    const isHologram = mode === "hologram";
    const isCutaway = mode === "cutaway";

    const headGroup = new THREE.Group();
    const sheathGroup = new THREE.Group();
    const plateGroup = new THREE.Group();
    
    // 1. Head (Red)
    const headGeo = new THREE.IcosahedronGeometry(1.6, 0);
    headGeo.scale(1.0, 1.4, 1.0);
    const headMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff4757, wireframe: true, transparent: true, opacity: 0.4 }) : new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.5, metalness: 0.1, flatShading: true });
    
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 2.4;
    headGroup.add(headMesh);

    // 2. Sheath (Blue)
    const sheathMat = new THREE.MeshStandardMaterial({ color: 0x3742fa, roughness: 0.6 });
    for(let i=0; i<8; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.15, 8, 16), sheathMat);
        ring.position.y = 0.8 + i * 0.2;
        ring.rotation.x = Math.PI/2;
        sheathGroup.add(ring);
    }
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.6, 12), sheathMat);
    tube.position.y = 1.5;
    sheathGroup.add(tube);

    // 3. Base Plate & Legs (Purple)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.7 });
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 6), legMat);
    plate.position.y = 0.6;
    plateGroup.add(plate);

    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        
        const legGroup = new THREE.Group();
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 6), legMat);
        thigh.position.set(0, -0.6, 0.6);
        thigh.rotation.x = Math.PI / 4;
        
        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 6), legMat);
        calf.position.set(0, -1.6, 1.1);
        calf.rotation.x = -Math.PI / 8;
        
        legGroup.add(thigh);
        legGroup.add(calf);
        
        legGroup.position.set(Math.cos(angle)*0.7, 0.6, Math.sin(angle)*0.7);
        legGroup.rotation.y = -angle + Math.PI/2;
        plateGroup.add(legGroup);
    }

    group.add(headGroup);
    group.add(sheathGroup);
    group.add(plateGroup);
    return group;
  },\n\n  """, js, flags=re.DOTALL)


# 7. Update SARS-CoV-2 (Corona) to Purple / Red (Bottom ref image)
js = re.sub(r'buildSARSCoV2\(mode = "surface"\) \{.*?(?=buildMpox|case)',
"""  buildSARSCoV2(mode = "surface") {
    const group = new THREE.Group();
    group.name = "sars-cov-2";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 3);
    
    // Purple envelope
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x8e44ad, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
      // Red S Protein (Club shape)
      const sGroup = new THREE.Group();
      sGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0xe84118 })));
      const sHead = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.1, 8, 16), new THREE.MeshStandardMaterial({ color: 0xe84118 }));
      sHead.position.y = 0.5;
      sHead.rotation.x = Math.PI/2;
      sGroup.add(sHead);
      
      const spikeCount = 60;
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();

        const noise = Math.sin(norm.x * 3) * Math.cos(norm.y * 3) * Math.sin(norm.z * 3) * 0.15;
        const spike = sGroup.clone();
        spike.position.copy(norm).multiplyScalar(envRadius + noise + 0.4);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
       const rna = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16, 2, 5), new THREE.MeshStandardMaterial({ color: 0xfbc531 }));
       group.add(rna);
    }
    return group;
  },\n\n  """, js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated all other requested references to match image styles!")
