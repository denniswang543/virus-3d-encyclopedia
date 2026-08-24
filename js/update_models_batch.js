const fs = require('fs');
const path = require('path');

const modelsPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(modelsPath, 'utf8');

// Pithovirus
code = code.replace(/buildPithovirus\(mode = "surface"\) \{[\s\S]*?return group;\n  \},/, `buildPithovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "pithovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const points = [];
    for(let i=0; i<=10; i++) {
       points.push(new THREE.Vector2(2.5 * Math.cos(-Math.PI/2 + (i/10)*Math.PI/2), -3 + 1.5 * Math.sin(-Math.PI/2 + (i/10)*Math.PI/2)));
    }
    points.push(new THREE.Vector2(2.5, 3));
    const geo = isCutaway ? new THREE.LatheGeometry(points, 32, 0, Math.PI) : new THREE.LatheGeometry(points, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x22a6b3, wireframe: true }) : this.createBiomaterial(0x1e90ff, 0.7, 0.2);
    const bodyMesh = new THREE.Mesh(geo, mat);
    bodyMesh.name = "pitho_body";
    group.add(bodyMesh);

    if (!isHologram && !isCutaway) {
      const corkGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.5, 32);
      const corkMat = this.createBiomaterial(0x535c68, 0.4, 0.1);
      const cork = new THREE.Mesh(corkGeo, corkMat);
      cork.position.set(0, 3.25, 0);
      cork.name = "pitho_cork";
      group.add(cork);
      
      const gridGeo = new THREE.PlaneGeometry(2.8, 2.8, 8, 8);
      const gridMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.position.set(0, 0.26, 0);
      grid.rotation.x = -Math.PI / 2;
      grid.name = "pitho_grid";
      cork.add(grid); // Add grid to cork so it moves with it
    }
    
    const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 64, 8);
    const dnaMat = new THREE.MeshBasicMaterial({ color: 0x4cd137, wireframe: true });
    const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
    dnaMesh.name = "pitho_dna";
    if (!isCutaway && !isHologram) dnaMesh.visible = false;
    group.add(dnaMesh);
    
    return group;
  },`);

// Baculovirus
code = code.replace(/buildBaculovirus\(mode = "surface"\) \{[\s\S]*?return group;\n  \},/, `buildBaculovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "baculovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envPoints = [];
    for(let i=0; i<=10; i++) {
       envPoints.push(new THREE.Vector2(1.5 * Math.cos(-Math.PI/2 + (i/10)*Math.PI/2), -1.5 + 1.5 * Math.sin(-Math.PI/2 + (i/10)*Math.PI/2)));
    }
    for(let i=0; i<=10; i++) {
       envPoints.push(new THREE.Vector2(1.5 * Math.cos((i/10)*Math.PI/2), 1.5 + 1.5 * Math.sin((i/10)*Math.PI/2)));
    }
    const geo = isCutaway ? new THREE.LatheGeometry(envPoints, 32, 0, Math.PI) : new THREE.LatheGeometry(envPoints, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true }) : new THREE.MeshStandardMaterial({ color: 0x686de0, transparent: true, opacity: 0.5, roughness: 0.1 });
    const envMesh = new THREE.Mesh(geo, mat);
    envMesh.name = "baculo_envelope";
    group.add(envMesh);

    const coreGeo = isCutaway ? new THREE.CylinderGeometry(0.8, 0.8, 4, 32, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7979, wireframe: true }) : this.createBiomaterial(0xeb4d4b, 0.6, 0.2);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.name = "baculo_core";
    group.add(coreMesh);

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xf9ca24 });
      for(let i=-1.5; i<=1.5; i+=0.5) {
        const dna = new THREE.Mesh(dnaGeo, dnaMat);
        dna.position.y = i;
        dna.rotation.x = Math.PI/2;
        coreMesh.add(dna); // attached to core
      }
    }
    return group;
  },`);

// ATV
code = code.replace(/buildATV\(mode = "surface"\) \{[\s\S]*?return group;\n  \},/, `buildATV(mode = "surface") {
    const group = new THREE.Group();
    group.name = "atv";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const points = [];
    for ( let i = 0; i <= 20; i ++ ) {
      const y = (i / 20) * 4 - 2;
      const x = 1.5 * (1 - (y*y)/4);
      points.push( new THREE.Vector2( x, y ) );
    }
    const geo = isCutaway ? new THREE.LatheGeometry(points, 32, 0, Math.PI) : new THREE.LatheGeometry(points, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf9ca24, wireframe: true }) : this.createBiomaterial(0xf6e58d, 0.7, 0.2);
    const lemon = new THREE.Mesh(geo, mat);
    lemon.rotation.z = Math.PI / 4;
    lemon.name = "atv_body";
    group.add(lemon);

    const tailGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    // translate geometry so origin is at the base
    tailGeo.translate(0, 2, 0);
    const tailMat = this.createBiomaterial(0xf9ca24, 0.5, 0.1);
    
    const tail1 = new THREE.Mesh(tailGeo, tailMat);
    tail1.position.set(1.4, 1.4, 0);
    tail1.rotation.z = -Math.PI / 4;
    tail1.name = "atv_tail1";
    if (!isCutaway) group.add(tail1);
    
    const tail2 = new THREE.Mesh(tailGeo, tailMat);
    tail2.position.set(-1.4, -1.4, 0);
    tail2.rotation.z = -Math.PI / 4 + Math.PI;
    tail2.name = "atv_tail2";
    if (!isCutaway) group.add(tail2);
    
    const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.1, 64, 8);
    const dnaMat = new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true });
    const dna = new THREE.Mesh(dnaGeo, dnaMat);
    dna.rotation.z = Math.PI / 4;
    if (isCutaway || isHologram) group.add(dna);
    
    return group;
  },`);

fs.writeFileSync(modelsPath, code, 'utf8');
console.log("virusModels.js updated for 3 new models");
