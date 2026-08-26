import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_measles = """  buildMeasles(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.2;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 64, 64);
    
    // Measles is pleomorphic (irregularly shaped), not a perfect sphere
    if (!isCutaway && !isHologram && envGeo.attributes.position) {
      const pos = envGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Add low-frequency noise to make it blobby
        const blob = Math.sin(v.x * 1.5) * Math.cos(v.y * 1.5) * Math.sin(v.z * 1.5) * 0.4;
        v.addScaledVector(v.clone().normalize(), blob);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      envGeo.computeVertexNormals();
    }

    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe15f41, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0xf3a683, roughness: 0.8, bumpScale: 0.2 });
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    if (!isHologram) {
      // Compound H spike (Hemagglutinin - mushroom like)
      const hGroup = new THREE.Group();
      hGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xc44569 })));
      const hHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xc44569 }));
      hHead.position.y = 0.2;
      hGroup.add(hHead);

      // Compound F spike (Fusion - needle/cone like)
      const fGroup = new THREE.Group();
      fGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x546de5 })));
      const fHead = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.08, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0x546de5 }));
      fHead.position.y = 0.25;
      fGroup.add(fHead);
      
      const spikeCount = 140;
      for(let i=0; i<spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        
        // Match the blobby surface displacement
        const blob = Math.sin(norm.x*radius * 1.5) * Math.cos(norm.y*radius * 1.5) * Math.sin(norm.z*radius * 1.5) * 0.4;
        
        const isH = i % 2 === 0;
        const spike = isH ? hGroup.clone() : fGroup.clone();
        spike.position.copy(norm).multiplyScalar(radius + blob);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      const rnpGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16, 2, 9);
      const rnpMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff793f, wireframe: true })
                                : new THREE.MeshStandardMaterial({ color: 0xff793f, roughness: 0.9 });
      group.add(new THREE.Mesh(rnpGeo, rnpMat));
    }
    return group;
  },"""

js = re.sub(r'buildMeasles\(mode = "surface"\) \{.*?(?=buildMimivirus|case)', new_measles + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Measles to high-poly blob")
