import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Fix Influenza B Colors
# Influenza A currently uses: envelope 0x00cec9, HA 0x0984e3, NA 0xff7979
# We want Influenza B to swap these to something distinct. 
new_influenza_b = """  buildInfluenzaB(mode = "surface") {
    // Structural twin of Influenza A, but with different aesthetics
    const group = this.buildInfluenzaA(mode);
    group.name = "influenza-b";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: 0x00cec9 (Cyan) -> 0x6c5ce7 (Purple)
        if (hex === 0x00cec9) child.material.color.setHex(0x6c5ce7);
        // HA: 0x0984e3 (Dark Blue) -> 0xfdcb6e (Yellow/Orange)
        if (hex === 0x0984e3) child.material.color.setHex(0xfdcb6e);
        // NA: 0xff7979 (Pink) -> 0x00b894 (Green)
        if (hex === 0xff7979) child.material.color.setHex(0x00b894);
      }
    });
    return group;
  },"""
js = re.sub(r'buildInfluenzaB\(mode = "surface"\) \{.*?(?=case|buildSARSCoV2)', new_influenza_b + "\n\n  ", js, flags=re.DOTALL)

# 2. Revert SARS-CoV-2 to the "grey/red" organic version
new_sars_cov_2 = """  buildSARSCoV2(mode = "surface") {
    const group = new THREE.Group();
    group.name = "sars-cov-2";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 3);
    
    // Greyish envelope (Original preferred color)
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0xa4b0be, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Red Spikes (S Protein)
    if (!isHologram) {
      const sGroup = new THREE.Group();
      
      const stalkGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.8, 8);
      const stalkMat = new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.4 });
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      sGroup.add(stalk);
      
      // Tulip-like head for Spike
      const headGroup = new THREE.Group();
      const headGeo1 = new THREE.SphereGeometry(0.15, 12, 12);
      const headGeo2 = new THREE.SphereGeometry(0.12, 12, 12);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.3 });
      
      const head1 = new THREE.Mesh(headGeo1, headMat);
      head1.position.set(0, 0.4, 0);
      const head2 = new THREE.Mesh(headGeo2, headMat);
      head2.position.set(0.1, 0.5, 0);
      const head3 = new THREE.Mesh(headGeo2, headMat);
      head3.position.set(-0.1, 0.5, 0);
      
      headGroup.add(head1, head2, head3);
      sGroup.add(headGroup);

      const spikeCount = 60;
      for(let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();

        const noise = Math.sin(norm.x * 3) * Math.cos(norm.y * 3) * Math.sin(norm.z * 3) * 0.15;
        const spike = sGroup.clone();
        spike.position.copy(norm).multiplyScalar(envRadius + noise + 0.3);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
      
      // E & M proteins (Small orange/yellow bumps)
      const emGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const emMat = new THREE.MeshStandardMaterial({ color: 0xffa502, roughness: 0.8 });
      for (let i = 0; i < 200; i++) {
        const y = 1 - (i / 199) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (5 - Math.sqrt(21)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        
        const noise = Math.sin(norm.x * 3) * Math.cos(norm.y * 3) * Math.sin(norm.z * 3) * 0.15;
        const em = new THREE.Mesh(emGeo, emMat);
        em.position.copy(norm).multiplyScalar(envRadius + noise + 0.02);
        em.scale.set(1, 1, 0.5);
        em.lookAt(new THREE.Vector3(0,0,0));
        group.add(em);
      }
    }

    if (isCutaway || isHologram) {
       const rna = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.2, 100, 16, 3, 7), new THREE.MeshStandardMaterial({ color: 0xff7f50 }));
       group.add(rna);
    }
    return group;
  },"""
js = re.sub(r'buildSARSCoV2\(mode = "surface"\) \{.*?(?=buildMpox|case)', new_sars_cov_2 + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Influenza B and reverted SARS-CoV-2")
