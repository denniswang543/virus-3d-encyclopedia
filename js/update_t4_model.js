const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(filePath, 'utf8');

const t4Regex = /buildBacteriophageT4\(mode = "surface"\) \{[\s\S]*?\/\/ 5\. Ebola Virus/;

const newT4Code = `buildBacteriophageT4(mode = "surface") {
    const group = new THREE.Group();
    group.name = "bacteriophage-t4";
    const isHologram = mode === "hologram";
    const isCutaway = mode === "cutaway";

    const mainColor = isHologram ? 0xa55eea : 0x4834d4;
    const accentColor = isHologram ? 0xd6a2e8 : 0x686de0;

    // --- 動畫用群組 ---
    const headGroup = new THREE.Group();
    headGroup.name = "t4_headGroup";
    const sheathGroup = new THREE.Group();
    sheathGroup.name = "t4_sheathGroup";
    const plateGroup = new THREE.Group();
    plateGroup.name = "t4_plateGroup";
    
    // 1. 二十面體頭部
    const headGeo = new THREE.IcosahedronGeometry(1.6, 0);
    headGeo.scale(1.0, 1.4, 1.0);
    const headMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xd6a2e8, wireframe: true })
      : new THREE.MeshPhysicalMaterial({ color: mainColor, roughness: 0.3, metalness: 0.2, transmission: 0.4, opacity: 0.85, transparent: true });
    
    if (isCutaway) this.clipGeometry(headGeo);
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 2.4;
    headGroup.add(headMesh);

    // 內部 DNA
    const dnaMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const innerDna = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), dnaMat);
    innerDna.scale.set(0.8, 1.1, 0.8);
    innerDna.position.y = 2.4;
    innerDna.name = "t4_dna";
    headGroup.add(innerDna);

    // 2. 領圈
    const collarGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 12);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xbe2edd, roughness: 0.4 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.y = 1.0;
    headGroup.add(collarMesh);

    // 中心注射管 (Inner Tube) - 固定在頭部下方
    const tubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 16);
    const tubeMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }) : new THREE.MeshStandardMaterial({ color: 0x95afc0 });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.position.y = -0.1;
    headGroup.add(tubeMesh);

    // 加入頭部群組
    group.add(headGroup);

    // 3. 收縮尾鞘 (Sheath)
    const sheathGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.0, 16);
    const sheathMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5, metalness: 0.3 });
    const sheathMesh = new THREE.Mesh(sheathGeo, sheathMat);
    sheathGroup.add(sheathMesh);

    for (let r = -0.9; r <= 0.7; r += 0.25) {
      const ringGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 16);
      const ringMesh = new THREE.Mesh(ringGeo, collarMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = r;
      sheathGroup.add(ringMesh);
    }
    sheathGroup.position.y = -0.1;
    group.add(sheathGroup);

    // 4. 基板 (Baseplate)
    const plateGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.25, 6);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x22a6b3, roughness: 0.3, metalness: 0.4 });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateGroup.add(plateMesh);

    const pinGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
    const pinMesh = new THREE.Mesh(pinGeo, plateMat);
    pinMesh.rotation.x = Math.PI;
    pinMesh.position.y = -0.35;
    plateGroup.add(pinMesh);

    // 尾絲
    const fiberMat = new THREE.MeshStandardMaterial({ color: 0x30336b, roughness: 0.3 });
    for (let f = 0; f < 6; f++) {
      const angle = (f * Math.PI * 2) / 6;
      const legGroup = new THREE.Group();

      const upperGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6);
      const upperMesh = new THREE.Mesh(upperGeo, fiberMat);
      upperMesh.position.set(0, 0.7, 0.3);
      upperMesh.rotation.x = 0.5;

      const jointMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), collarMat);
      jointMesh.position.set(0, 1.35, 0.7);

      const lowerGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6);
      const lowerMesh = new THREE.Mesh(lowerGeo, fiberMat);
      lowerMesh.position.set(0, 0.8, 1.3);
      lowerMesh.rotation.x = -0.6;

      legGroup.add(upperMesh);
      legGroup.add(jointMesh);
      legGroup.add(lowerMesh);

      legGroup.position.set(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
      legGroup.rotation.y = -angle;
      plateGroup.add(legGroup);
    }
    plateGroup.position.y = -1.2;
    group.add(plateGroup);

    // DNA Inject Line (隱藏的 DNA 注入特效)
    const injectGeo = new THREE.CylinderGeometry(0.03, 0.03, 4.0, 8);
    const injectMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    const injectMesh = new THREE.Mesh(injectGeo, injectMat);
    injectMesh.position.y = 0;
    injectMesh.name = "t4_injectDna";
    headGroup.add(injectMesh);

    return group;
  },

  // 5. Ebola Virus`;

code = code.replace(t4Regex, newT4Code);
fs.writeFileSync(filePath, code, 'utf8');
console.log("virusModels.js updated for T4 animation structure.");
