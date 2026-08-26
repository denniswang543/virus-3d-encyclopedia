import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_adenovirus = """  buildAdenovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "adenovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.0;

    if (!isHologram) {
      // 1. Translucent Blue Icosahedron Shell (matching the classic textbook art)
      const shellGeo = new THREE.IcosahedronGeometry(radius, 0); 
      const shellMat = new THREE.MeshStandardMaterial({
         color: 0x0984e3,
         roughness: 0.3,
         metalness: 0.2,
         flatShading: true, // gives the distinct flat faces
         transparent: true,
         opacity: isCutaway ? 0.3 : 0.75, // Always translucent to reveal core
         side: THREE.DoubleSide
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);

      // 2. Red Inner Core (DNA/Protein complex) visible through the blue shell
      const coreGeo = new THREE.IcosahedronGeometry(radius * 0.65, 1);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.8, flatShading: true });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      // 3. Penton Bases, Yellow Fibers, and Green Knobs
      const fiberGroup = new THREE.Group();
      const pentonGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const pentonMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.5 }); // Green base
      
      const stalkGeo = new THREE.CylinderGeometry(0.08, 0.1, 2.0, 8);
      const stalkMat = new THREE.MeshStandardMaterial({ color: 0xfeca57, roughness: 0.5 }); // Yellow stalk

      const knobGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const knobMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.5 }); // Green knob
      
      const pos = shellGeo.attributes.position;
      const added = [];
      for(let i = 0; i < pos.count; i++) {
         const v = new THREE.Vector3().fromBufferAttribute(pos, i);
         if (!added.find(a => a.distanceTo(v) < 0.1)) {
            added.push(v);
            
            if (isCutaway && v.y < -0.2) continue; // remove bottom fibers in cutaway

            // Base
            const penton = new THREE.Mesh(pentonGeo, pentonMat);
            penton.position.copy(v);
            fiberGroup.add(penton);

            // Stalk (Yellow)
            const stalk = new THREE.Mesh(stalkGeo, stalkMat);
            stalk.position.copy(v).normalize().multiplyScalar(radius + 1.0);
            stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v.clone().normalize());
            fiberGroup.add(stalk);

            // Knob (Green)
            const knob = new THREE.Mesh(knobGeo, knobMat);
            knob.position.copy(v).normalize().multiplyScalar(radius + 2.0);
            fiberGroup.add(knob);
         }
      }
      group.add(fiberGroup);

    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 0);
      const mat = new THREE.MeshBasicMaterial({ color: 0x0abde3, wireframe: true, transparent: isCutaway, opacity: 0.5 });
      group.add(new THREE.Mesh(geo, mat));
    }
    
    return group;
  },"""

# Replace the existing buildAdenovirus
js = re.sub(r'buildAdenovirus\(mode = "surface"\) \{.*?(?=buildEnterovirus|case)', new_adenovirus + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Adenovirus to match reference image")
