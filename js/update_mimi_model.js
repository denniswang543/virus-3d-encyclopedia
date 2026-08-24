const fs = require('fs');
const path = require('path');

const modelsPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(modelsPath, 'utf8');

const regex = /buildMimivirus\(mode = "surface"\) \{[\s\S]*?return group;\n  \},/;

const newCode = `buildMimivirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "mimivirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    const radius = 3.5;
    
    // Icosahedron with cutaway capability
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI*2, 0, Math.PI*0.6) : new THREE.IcosahedronGeometry(radius, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true }) : this.createBiomaterial(0x4834d4, 0.7, 0.2);
    const bodyMesh = new THREE.Mesh(geo, mat);
    bodyMesh.name = "mimi_body";
    group.add(bodyMesh);

    // Stargate
    if (!isHologram && !isCutaway) {
      const starGeo = new THREE.CylinderGeometry(0, 1.2, 0.4, 5);
      const starMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(0, radius - 0.1, 0);
      star.name = "mimi_stargate";
      group.add(star);
    }

    // Hair fibers
    if (!isHologram) {
      const hairGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4);
      const hairMat = this.createBiomaterial(0x7ed6df, 0.5, 0.1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i += 4) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (isCutaway && v.y < -0.2 * radius) continue;
        v.normalize();
        if (v.y > 0.8) continue; // Leave stargate clear
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.copy(v).multiplyScalar(radius + 0.4);
        hair.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(hair);
      }
    }
    
    // DNA Core
    const dnaGeo = new THREE.IcosahedronGeometry(2, 1);
    const dnaMat = new THREE.MeshBasicMaterial({ color: 0xffda79, wireframe: true });
    const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
    dnaMesh.name = "mimi_dna";
    if (!isCutaway && !isHologram) {
      dnaMesh.visible = false;
    }
    group.add(dnaMesh);

    return group;
  },`;

code = code.replace(regex, newCode);
fs.writeFileSync(modelsPath, code, 'utf8');
console.log("virusModels.js updated for Mimivirus.");
