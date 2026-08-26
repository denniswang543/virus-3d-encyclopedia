import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_rotavirus = """  buildRotavirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Outer Capsid (VP7) - Upgraded to look like the classic artistic green cratered sphere
    const radius = 3;
    const vp7Geo = isCutaway ? new THREE.SphereGeometry(radius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 12);
    
    // Perturb vertices to create a bumpy/cratered surface
    if (!isCutaway && !isHologram && vp7Geo.attributes.position) {
      const pos = vp7Geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Simple procedural noise for bumps
        const noise = Math.sin(v.x * 5) * Math.cos(v.y * 5) * Math.sin(v.z * 5);
        // Depress the areas where spikes might be to form craters, or just make it globally bumpy
        v.addScaledVector(v.clone().normalize(), noise * 0.15);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      vp7Geo.computeVertexNormals();
    }

    const vp7Mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0x4cd137, roughness: 0.7, bumpScale: 0.2, side: THREE.DoubleSide });
    const vp7 = new THREE.Mesh(vp7Geo, vp7Mat);
    group.add(vp7);

    // Spikes (VP4) - Upgraded to funnel/cup shape
    if (!isHologram) {
      // Compound spike geometry: base stalk + cup
      const spikeGroup = new THREE.Group();
      
      const stalkGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8);
      const cupGeo = new THREE.CylinderGeometry(0.3, 0.08, 0.3, 16, 1, true); // Open ended cone
      const cupInnerGeo = new THREE.CylinderGeometry(0.25, 0.05, 0.3, 16, 1, true); // Inner wall to give thickness
      const lipGeo = new THREE.TorusGeometry(0.3, 0.03, 8, 16); // Rim of the cup

      const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.5, side: THREE.DoubleSide });
      const innerMat = new THREE.MeshStandardMaterial({ color: 0xc23616, roughness: 0.8, side: THREE.DoubleSide }); // Darker inside
      
      const stalk = new THREE.Mesh(stalkGeo, spikeMat);
      stalk.position.y = 0.3; // Half of stalk height
      
      const cup = new THREE.Mesh(cupGeo, spikeMat);
      cup.position.y = 0.6 + 0.15; // Above stalk
      
      const cupInner = new THREE.Mesh(cupInnerGeo, innerMat);
      cupInner.position.y = 0.6 + 0.14; // Slightly lower inner wall
      
      const lip = new THREE.Mesh(lipGeo, spikeMat);
      lip.position.y = 0.6 + 0.3; // Top of the cup
      lip.rotation.x = Math.PI / 2;

      spikeGroup.add(stalk);
      spikeGroup.add(cup);
      spikeGroup.add(cupInner);
      spikeGroup.add(lip);

      const spikeCount = 60;
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        
        const spike = spikeGroup.clone();
        // Position at surface, embedded slightly
        spike.position.copy(norm).multiplyScalar(radius - 0.2);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Inner Core (VP6 & VP2)
    if (isCutaway || isHologram) {
      const vp6Geo = new THREE.IcosahedronGeometry(2.3, 2);
      const vp6Mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xfdcb6e, wireframe: true, transparent: true, opacity: 0.2 })
                                : this.createBiomaterial(0xf1c40f, 0.9, 0, true, 0.7);
      group.add(new THREE.Mesh(vp6Geo, vp6Mat));

      // 11 segments of dsRNA
      const rnaMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7675 })
                                : this.createBiomaterial(0xe84118, 0.5, 0);
      for (let i = 0; i < 11; i++) {
        const rnaGeo = new THREE.TorusKnotGeometry(0.8 + Math.random()*0.3, 0.08, 64, 8, 2, 3);
        const rna = new THREE.Mesh(rnaGeo, rnaMat);
        rna.position.set((Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5);
        rna.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        group.add(rna);
      }
    }
    return group;
  },"""

# Replace the old buildRotavirus function
js = re.sub(r'buildRotavirus\(mode = "surface"\) \{.*?(?=buildHSV|case)', new_rotavirus + "\n\n  ", js, flags=re.DOTALL)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Rotavirus model")
