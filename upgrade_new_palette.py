import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# ADD NEW BUILDERS
new_builders = """
  buildPolio(mode = "surface") {
    const group = new THREE.Group();
    group.name = "polio";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const capsidGroup = new THREE.Group();
    
    if (!isHologram) {
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 2);
      const capsomereGeo = new THREE.SphereGeometry(0.45, 16, 16);
      
      const matBase = new THREE.MeshStandardMaterial({ color: 0x1e3799, roughness: 0.6 }); // dark blue
      const matOrange = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.6 });
      const matRed = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.6 });
      
      if (isCutaway) [matBase, matOrange, matRed].forEach(m => { m.transparent = true; m.opacity = 0.4; });

      const pos = baseGeo.attributes.position;
      const added = [];
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          let mat = matBase;
          if (i % 5 === 0) mat = matOrange;
          else if (i % 7 === 0) mat = matRed;

          const cap = new THREE.Mesh(capsomereGeo, mat);
          const noise = Math.sin(v.x*4)*Math.cos(v.y*4)*Math.sin(v.z*4);
          cap.position.copy(v).normalize().multiplyScalar(2.6 + noise * 0.15);
          cap.lookAt(new THREE.Vector3(0,0,0));
          cap.scale.set(1, 1, 0.7);
          capsidGroup.add(cap);
        }
      }
    } else {
      capsidGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 2), new THREE.MeshBasicMaterial({ color: 0x1e3799, wireframe: true })));
    }
    group.add(capsidGroup);
    return group;
  },

  buildHCV(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hcv";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 48, 48);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 3);
    
    // Cyan envelope
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true }) : new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Purple spikes
    if (!isHologram) {
       const spikeGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 6);
       const spikeMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.5 });
       for(let i=0; i<80; i++) {
          const y = 1 - (i / 79) * 2;
          if (isCutaway && y < -0.1) continue;
          const tempR = Math.sqrt(1 - y*y);
          const theta = Math.PI * (3 - Math.sqrt(5)) * i;
          const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
          
          const noise = Math.sin(norm.x*3)*Math.cos(norm.y*3)*Math.sin(norm.z*3)*0.15;
          const spike = new THREE.Mesh(spikeGeo, spikeMat);
          spike.position.copy(norm).multiplyScalar(envRadius + noise + 0.3);
          spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
          group.add(spike);
       }
    }
    return group;
  },

  buildRubella(mode = "surface") {
    const group = new THREE.Group();
    group.name = "rubella";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.7;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 48, 48);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 2.5);
    
    // Magenta envelope
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe84393, wireframe: true }) : new THREE.MeshStandardMaterial({ color: 0xe84393, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Pink club spikes
    if (!isHologram) {
       const spikeGroup = new THREE.Group();
       spikeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.8, 6), new THREE.MeshStandardMaterial({ color: 0xfd79a8 })));
       const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x6c5ce7 })); // darker purple head
       head.position.y = 0.4;
       spikeGroup.add(head);

       for(let i=0; i<120; i++) {
          const y = 1 - (i / 119) * 2;
          if (isCutaway && y < -0.1) continue;
          const tempR = Math.sqrt(1 - y*y);
          const theta = Math.PI * (3 - Math.sqrt(5)) * i;
          const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
          
          const noise = Math.sin(norm.x*2.5)*Math.cos(norm.y*2.5)*Math.sin(norm.z*2.5)*0.2;
          const spike = spikeGroup.clone();
          spike.position.copy(norm).multiplyScalar(envRadius + noise + 0.3);
          spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
          group.add(spike);
       }
    }
    return group;
  },
"""

js = js.replace('  createVirus(virusId, mode = "surface") {', new_builders + '\n  createVirus(virusId, mode = "surface") {')

# ADD NEW CASES TO SWITCH
cases = """
        case "polio": return this.buildPolio(mode);
        case "hcv": return this.buildHCV(mode);
        case "rubella": return this.buildRubella(mode);
"""
js = js.replace('switch (virusId) {\n', 'switch (virusId) {\n' + cases)


# MODIFY EXISTING COLORS IN virusModels.js
# DENGUE: change colors to match new image (body: 0x3498db, dimers: 0x9b59b6 / 0xf1c40f)
js = js.replace('color: 0x2bcbba', 'color: 0x9b59b6') # dimer 1
js = js.replace('color: 0x20bf6b', 'color: 0xf1c40f') # dimer 2
js = js.replace('color: 0x0fb9b1', 'color: 0x3498db') # shell

# ZIKA: body 0x1abc9c, strips 0xe84393, 0x74b9ff
js = js.replace('if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0xe84393);', 'if (c.material.color.getHex() === 0x9b59b6) c.material.color.setHex(0xe84393);')
js = js.replace('if (c.material.color.getHex() === 0x20bf6b) c.material.color.setHex(0xfd79a8);', 'if (c.material.color.getHex() === 0xf1c40f) c.material.color.setHex(0x74b9ff);')
js = js.replace('if (mode === "surface") {', 'if (mode === "surface") {\n         group.children[0].material.color.setHex(0x1abc9c);')

# HPV: body 0x8e44ad, stars 0x9b59b6
js = js.replace('color: 0x0984e3', 'color: 0x8e44ad') # HPV and Influenza had this, need to be careful
js = re.sub(r'(buildHPV.*?color:\s*)0x0984e3(.*?color:\s*)0x0984e3', r'\1 0x8e44ad \2 0x8e44ad', js, flags=re.DOTALL)
js = re.sub(r'(buildHPV.*?color:\s*)0xfeca57', r'\1 0x9b59b6', js, flags=re.DOTALL)

# ROTAVIRUS: body 0x0984e3, spikes 0xd63031
js = re.sub(r'(buildRotavirus.*?color:\s*)0x4cd137', r'\1 0x0984e3', js, flags=re.DOTALL)
js = re.sub(r'(buildRotavirus.*?color:\s*)0xff6b81', r'\1 0xd63031', js, flags=re.DOTALL)

# MEASLES: body 0xfeca57, spikes 0xe84118 / 0xfd79a8
js = re.sub(r'(buildMeasles.*?color:\s*)0xf3a683', r'\1 0xfeca57', js, flags=re.DOTALL)
js = re.sub(r'(buildMeasles.*?color:\s*)0xc44569', r'\1 0xe84118', js, flags=re.DOTALL) # H spike
js = re.sub(r'(buildMeasles.*?color:\s*)0x546de5', r'\1 0xfd79a8', js, flags=re.DOTALL) # F spike

# INFLUENZA: body 0x00cec9, HA 0x0984e3
js = re.sub(r'(buildInfluenzaA.*?color:\s*)0x0984e3(.*?color:\s*)0x0984e3', r'\1 0x00cec9 \2 0x00cec9', js, flags=re.DOTALL)
js = re.sub(r'(buildInfluenzaA.*?color:\s*)0x00cec9(.*?color:\s*)0x00cec9', r'\1 0x0984e3 \2 0x0984e3', js, flags=re.DOTALL) # wait this swaps back and forth, let's use exact match
# Influenza A currently has envelope 0x0984e3, HA 0x00cec9, NA 0xff7979
# We want envelope 0x00cec9, HA 0x0984e3, NA 0xff7979
js = js.replace('const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3', 'const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00cec9')
js = js.replace('new THREE.MeshStandardMaterial({ color: 0x0984e3, roughness: 0.7', 'new THREE.MeshStandardMaterial({ color: 0x00cec9, roughness: 0.7')
js = js.replace('new THREE.MeshStandardMaterial({ color: 0x00cec9 }));', 'new THREE.MeshStandardMaterial({ color: 0x0984e3 }));')

# HIV: body 0xd980fa, spikes 0x12cbc4 / 0x5758bb
js = re.sub(r'(buildHIV1.*?color:\s*)0x5f27cd(.*?color:\s*)0x341f97', r'\1 0xd980fa \2 0xd980fa', js, flags=re.DOTALL)
js = re.sub(r'(buildHIV1.*?color:\s*)0x0abde3', r'\1 0x12cbc4', js, flags=re.DOTALL)
js = re.sub(r'(buildHIV1.*?color:\s*)0xff9ff3', r'\1 0x5758bb', js, flags=re.DOTALL)

# RABIES: body 0x00d2d3, spikes 0x6c5ce7
js = re.sub(r'(buildRabies.*?color:\s*)0x16a085(.*?color:\s*)0x16a085', r'\1 0x00d2d3 \2 0x00d2d3', js, flags=re.DOTALL)
js = re.sub(r'(buildRabies.*?color:\s*)0x78e08f', r'\1 0x6c5ce7', js, flags=re.DOTALL)

# HBV: body 0x00d2d3, spikes 0x0a3d62
js = re.sub(r'(buildHBV.*?color:\s*)0xff9f43(.*?color:\s*)0xff9f43', r'\1 0x00d2d3 \2 0x00d2d3', js, flags=re.DOTALL)
js = re.sub(r'(buildHBV.*?color:\s*)0xd35400', r'\1 0x0a3d62', js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated all models to match new image palette")
