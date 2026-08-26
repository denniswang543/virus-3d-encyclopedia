import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. ADD NEW VIRUSES
new_builders = """
  buildPolio(mode = "surface") {
    const group = this.buildEnterovirus(mode);
    group.name = "polio";
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        if (hex === 0x0097e6) child.material.color.setHex(0x1e3799); // Dark blue
        if (hex === 0x8c7ae6) child.material.color.setHex(0xe67e22); // Orange
        if (hex === 0x44bd32) child.material.color.setHex(0xc0392b); // Red
        if (hex === 0xe1b12c) child.material.color.setHex(0x1e3799); // Dark blue
      }
    });
    return group;
  },

  buildHCV(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hcv";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 4);
    
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 0.6, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
       const spikeGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
       const spikeMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.5 });
       const spikeCount = 90;
       for(let i=0; i<spikeCount; i++) {
          const y = 1 - (i / (spikeCount - 1)) * 2;
          if (isCutaway && y < -0.1) continue;
          const tempR = Math.sqrt(1 - y*y);
          const theta = Math.PI * (3 - Math.sqrt(5)) * i;
          const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
          
          const noise = Math.sin(norm.x*4)*Math.cos(norm.y*4)*Math.sin(norm.z*4)*0.15;
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
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3);
    
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe84393, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : new THREE.MeshStandardMaterial({ color: 0xe84393, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
       const spikeGroup = new THREE.Group();
       spikeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0xfd79a8 })));
       const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshStandardMaterial({ color: 0x6c5ce7 }));
       head.position.y = 0.45;
       spikeGroup.add(head);

       const spikeCount = 120;
       for(let i=0; i<spikeCount; i++) {
          const y = 1 - (i / (spikeCount-1)) * 2;
          if (isCutaway && y < -0.1) continue;
          const tempR = Math.sqrt(1 - y*y);
          const theta = Math.PI * (3 - Math.sqrt(5)) * i;
          const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
          
          const noise = Math.sin(norm.x*3)*Math.cos(norm.y*3)*Math.sin(norm.z*3)*0.2;
          const spike = spikeGroup.clone();
          spike.position.copy(norm).multiplyScalar(envRadius + noise + 0.35);
          spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
          group.add(spike);
       }
    }
    return group;
  },
"""

js = js.replace('  createVirus(virusId, mode = "surface") {', new_builders + '\n  createVirus(virusId, mode = "surface") {')
cases = """        case "polio": return this.buildPolio(mode);
        case "hcv": return this.buildHCV(mode);
        case "rubella": return this.buildRubella(mode);
"""
js = js.replace('switch (virusId) {\n', 'switch (virusId) {\n' + cases)

# 2. UPDATE COLORS (Preserving geometries)
# Dengue
js = js.replace('0x0fb9b1', '0x3498db')
js = js.replace('0x2bcbba', '0x9b59b6')
js = js.replace('0x20bf6b', '0xf1c40f')

# Zika
js = js.replace('if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0xff7675);', 'if (c.material.color.getHex() === 0x9b59b6) c.material.color.setHex(0xe84393);')
js = js.replace('if (c.material.color.getHex() === 0x20bf6b) c.material.color.setHex(0x74b9ff);', 'if (c.material.color.getHex() === 0xf1c40f) c.material.color.setHex(0x74b9ff);')
js = js.replace('if (mode === "surface") {', 'if (mode === "surface") {\n         group.children[0].material.color.setHex(0x1abc9c);')

# HPV
js = re.sub(r'(buildHPV.*?color:\s*)0x0984e3(.*?color:\s*)0x0984e3', r'\1 0x8e44ad \2 0x8e44ad', js, flags=re.DOTALL)
js = re.sub(r'(buildHPV.*?color:\s*)0xfeca57', r'\1 0x9b59b6', js, flags=re.DOTALL)

# Rotavirus
js = re.sub(r'(buildRotavirus.*?color:\s*)0x4cd137', r'\1 0x0984e3', js, flags=re.DOTALL)
js = re.sub(r'(buildRotavirus.*?color:\s*)0xff6b81', r'\1 0xd63031', js, flags=re.DOTALL)

# Measles
js = re.sub(r'(buildMeasles.*?color:\s*)0xf3a683', r'\1 0xfeca57', js, flags=re.DOTALL)
js = re.sub(r'(buildMeasles.*?color:\s*)0xc44569', r'\1 0xe84118', js, flags=re.DOTALL)
js = re.sub(r'(buildMeasles.*?color:\s*)0x546de5', r'\1 0xfd79a8', js, flags=re.DOTALL)

# Influenza A
js = re.sub(r'(buildInfluenzaA.*?color:\s*)0x1e3799', r'\1 0x00cec9', js, flags=re.DOTALL)
js = re.sub(r'(buildInfluenzaA.*?color:\s*)0xeb2f06', r'\1 0x0984e3', js, flags=re.DOTALL)
js = re.sub(r'(buildInfluenzaA.*?color:\s*)0x00d2d3(.*?color:\s*)0x00d2d3', r'\1 0xff7979 \2 0xff7979', js, flags=re.DOTALL)

# Influenza B
js = js.replace('if (hex === 0x1e3799) child.material.color.setHex(0x0a3d62);', 'if (hex === 0x00cec9) child.material.color.setHex(0x6c5ce7);')
js = js.replace('if (hex === 0xeb2f06) child.material.color.setHex(0x54a0ff);', 'if (hex === 0x0984e3) child.material.color.setHex(0xfdcb6e);')
js = js.replace('if (hex === 0x00d2d3) child.material.color.setHex(0xfeca57);', 'if (hex === 0xff7979) child.material.color.setHex(0x00b894);')

# HIV
js = re.sub(r'(buildHIV1.*?color:\s*)0x10ac84(.*?color:\s*)0x10ac84', r'\1 0xd980fa \2 0xd980fa', js, flags=re.DOTALL)
js = re.sub(r'(buildHIV1.*?color:\s*)0x833471', r'\1 0x12cbc4', js, flags=re.DOTALL)
js = re.sub(r'(buildHIV1.*?color:\s*)0x9980FA', r'\1 0x5758bb', js, flags=re.DOTALL)

# Rabies (Old was 0xa4b0be body, 0xff4757 spikes. We want 0x00d2d3 body, 0x6c5ce7 spikes)
js = re.sub(r'(buildRabies.*?color:\s*)0xa4b0be(.*?color:\s*)0xa4b0be', r'\1 0x00d2d3 \2 0x00d2d3', js, flags=re.DOTALL)
js = re.sub(r'(buildRabies.*?color:\s*)0xff4757', r'\1 0x6c5ce7', js, flags=re.DOTALL)

# HBV (Old was 0xf1c40f env, 0xffda79/0xd35400 spikes. We want 0x00d2d3 env, 0x0a3d62 spikes)
js = re.sub(r'(buildHBV.*?color:\s*)0xf1c40f(.*?color:\s*)0xffda79(.*?color:\s*)0xffda79', r'\1 0x00d2d3 \2 0x00d2d3 \3 0x00d2d3', js, flags=re.DOTALL)
js = re.sub(r'(buildHBV.*?color:\s*)0xd35400', r'\1 0x0a3d62', js, flags=re.DOTALL)

# T4
js = re.sub(r'const mainColor = isHologram \? 0xa55eea : 0x4834d4;', 'const mainColor = isHologram ? 0xa55eea : 0xff4757;', js)
js = js.replace('const sheathMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const sheathMat = new THREE.MeshStandardMaterial({ color: 0x3742fa')
js = js.replace('const plateMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const plateMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')
js = js.replace('const legMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const legMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')

# Ebola (Old was 0xf39c12. Want 0xff4757)
js = re.sub(r'(buildEbola.*?color:\s*)0xf39c12(.*?color:\s*)0xf39c12', r'\1 0xff4757 \2 0xff4757', js, flags=re.DOTALL)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Finished comprehensive geometry+color restore.")
