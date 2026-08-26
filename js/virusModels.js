/**
 * 3D 病毒幾何與材質建構引擎 (Three.js Procedural Virus Generator)
 * 支援 8 款病毒的高精度幾何裝配、外觀模式 (Surface)、剖面模式 (Cutaway) 與透視模式 (Hologram)
 */

const VirusBuilder = {
  // 基礎材質快取與輔助工廠
  createBiomaterial(colorHex, roughness = 0.4, metalness = 0.1, transparent = false, opacity = 1.0) {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      roughness: roughness,
      metalness: metalness,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      transmission: transparent ? 0.6 : 0,
      opacity: opacity,
      transparent: transparent || opacity < 1.0,
      side: THREE.DoubleSide
    });
  },

  // 1. SARS-CoV-2 (新型冠狀病毒)
      buildSARSCoV2(mode = "surface") {
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
  },

  buildMpox(mode = "surface") {
    const group = new THREE.Group();
    group.name = "mpox";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // 圓角磚形外膜 (Rounded Brick / Lozenge)
    const brickGroup = new THREE.Group();
    const width = 4.2, height = 3.0, depth = 2.4;

    if (!isCutaway || isHologram) {
      const boxGeo = new THREE.BoxGeometry(width, height, depth, 16, 16, 16);
      // 頂點圓角化變形
      const pos = boxGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        const len = v.length();
        v.normalize().multiplyScalar(Math.min(len, 2.3));
        pos.setXYZ(i, v.x * 1.3, v.y * 1.0, v.z * 0.85);
      }
      boxGeo.computeVertexNormals();

      const boxMat = isHologram
        ? new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.4 })
        : new THREE.MeshStandardMaterial({ color: 0xb33939, roughness: 0.7, metalness: 0.1 });
      const brickMesh = new THREE.Mesh(boxGeo, boxMat);
      brickGroup.add(brickMesh);

      // 表面密集微小管狀球體 (Surface Globules)
      const globGeo = new THREE.SphereGeometry(0.1, 6, 6);
      const globMat = new THREE.MeshStandardMaterial({ color: 0xff793f, roughness: 0.5 });
      const globInstanced = new THREE.InstancedMesh(globGeo, globMat, 220);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < 220; i++) {
        const u = (Math.random() - 0.5) * width * 0.95;
        const v = (Math.random() - 0.5) * height * 0.95;
        const w = (Math.random() > 0.5 ? 1 : -1) * depth * 0.48;
        dummy.position.set(u, v, w);
        dummy.updateMatrix();
        globInstanced.setMatrixAt(i, dummy.matrix);
      }
      brickGroup.add(globInstanced);
    } else {
      // 剖面模式：僅保留後半邊外膜
      const halfBoxGeo = new THREE.BoxGeometry(width, height, depth * 0.5, 16, 16, 8);
      const halfBoxMat = new THREE.MeshStandardMaterial({
        color: 0xb33939,
        roughness: 0.7,
        side: THREE.DoubleSide
      });
      const halfBox = new THREE.Mesh(halfBoxGeo, halfBoxMat);
      halfBox.position.z = -depth * 0.25;
      brickGroup.add(halfBox);
    }
    group.add(brickGroup);

    // 內部結構：側體 (Lateral Bodies) + 啞鈴形核心 (Dumbbell Core) + dsDNA
    if (isCutaway || isHologram) {
      const innerGroup = new THREE.Group();

      // 啞鈴形核心 (由兩側球體 + 中間細圓柱連接而成)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffb142,
        roughness: 0.4,
        metalness: 0.2,
        side: THREE.DoubleSide
      });

      const sphereLeft = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24), coreMat);
      sphereLeft.position.x = -1.2;
      sphereLeft.scale.set(1, 0.85, 0.7);

      const sphereRight = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24), coreMat);
      sphereRight.position.x = 1.2;
      sphereRight.scale.set(1, 0.85, 0.7);

      const centerWaist = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 24), coreMat);
      centerWaist.rotation.z = Math.PI / 2;
      centerWaist.scale.set(1, 1, 0.65);

      innerGroup.add(sphereLeft);
      innerGroup.add(sphereRight);
      innerGroup.add(centerWaist);

      // 兩側側體 (Lateral Bodies - 位於啞鈴腰部凹陷處)
      const lateralMat = new THREE.MeshStandardMaterial({ color: 0x706fd3, roughness: 0.5 });
      const lateralTop = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), lateralMat);
      lateralTop.position.set(0, 0.95, 0);
      lateralTop.scale.set(1.4, 0.5, 0.6);

      const lateralBottom = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), lateralMat);
      lateralBottom.position.set(0, -0.95, 0);
      lateralBottom.scale.set(1.4, 0.5, 0.6);

      innerGroup.add(lateralTop);
      innerGroup.add(lateralBottom);

      // 大型雙鏈 DNA 密集線圈 (在核心內部)
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x33d9b2, wireframe: true });
      const dnaMesh = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.25, 12, 32), dnaMat);
      dnaMesh.position.z = 0.1;
      innerGroup.add(dnaMesh);

      group.add(innerGroup);
    }

    return group;
  },

  // 3. Influenza A / H5N1 (甲型流感 - HA/NA 雙刺突與 8 條分節 RNA)
    buildInfluenzaA(mode = "surface") {
    const group = new THREE.Group();
    group.name = "influenza-a";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3);

    // Blue envelope
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x8e44ad, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    if (!isHologram) {
      // Cyan HA spikes
      const haGeo = new THREE.Group();
      haGeo.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.1, 6), new THREE.MeshStandardMaterial({ color:  0x0984e3  })));
      const haHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color:  0x0984e3 }));
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
  },

    buildBacteriophageT4(mode = "surface") {
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
  },

  buildEbola(mode = "surface") {
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
  },

  buildDengue(mode = "surface") {
    const group = new THREE.Group();
    group.name = "dengue";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.7;
    const baseGeo = isCutaway
      ? new THREE.IcosahedronGeometry(radius, 2)
      : new THREE.IcosahedronGeometry(radius, 2);

    // 人字形二聚體鎧甲表面 (Herringbone Dimers)
    const shellGroup = new THREE.Group();
    const dimerGeo = new THREE.BoxGeometry(0.35, 0.12, 0.85);
    const dimerMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0x9b59b6, wireframe: true, opacity: 0.5 })
      : new THREE.MeshStandardMaterial({
          color: 0x0fbcf9,
          roughness: 0.4,
          metalness: 0.2
        });

    // 沿著球面分佈人字形交錯板塊
    const count = isCutaway ? 50 : 90;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      if (isCutaway && y < -0.2) continue;

      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const pos = new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      ).multiplyScalar(radius);

      const dimer = new THREE.Mesh(dimerGeo, dimerMat);
      dimer.position.copy(pos);
      dimer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      dimer.rotation.z += (i % 2 === 0 ? 0.75 : -0.75); // 人字形交錯傾斜
      shellGroup.add(dimer);
    }
    group.add(shellGroup);

    // 內層球形膜與衣殼
    const innerEnvGeo = isCutaway
      ? new THREE.SphereGeometry(radius * 0.88, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55)
      : new THREE.SphereGeometry(radius * 0.88, 32, 32);

    const innerEnvMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xf1c40f, wireframe: true })
      : new THREE.MeshStandardMaterial({ color: 0x05c46b, roughness: 0.6, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(innerEnvGeo, innerEnvMat));

    // 內部球形衣殼與 (+)ssRNA 核心
    if (isCutaway || isHologram) {
      const capsidGeo = new THREE.SphereGeometry(1.4, 24, 24);
      const capsidMat = new THREE.MeshStandardMaterial({
        color: 0xffa801,
        roughness: 0.3,
        emissive: 0x4a3000
      });
      const capsidMesh = new THREE.Mesh(capsidGeo, capsidMat);
      group.add(capsidMesh);

      // RNA 球狀螺旋線圈
      const rnaMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const rnaMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 2), rnaMat);
      group.add(rnaMesh);
    }

    return group;
  },

  // 7. Rabies Virus (狂犬病毒 - 經典子彈型與內部緊密 RNP 彈簧管)
    buildRabies(mode = "surface") {
    const group = new THREE.Group();
    group.name = "rabies";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const bodyRadius = 1.6;
    const bodyHeight = 3.6;
    const bulletGroup = new THREE.Group();

    // Dark teal/green body
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color:  0x00d2d3 , wireframe: true, transparent: true, opacity: 0.4 })
                           : new THREE.MeshStandardMaterial({ color:  0x00d2d3, roughness: 0.8, side: THREE.DoubleSide });

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
      const spikeMat = new THREE.MeshStandardMaterial({ color:  0x6c5ce7, roughness: 0.5 });
      
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
  },

  buildHIV1(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hiv-1";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.9;
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.15, 4);

    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color:  0xd980fa , wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color:  0xd980fa, roughness: 0.8, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Spikes (gp120 / gp41) - Magenta and Cyan
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.8, 8);
      const spikeMat = new THREE.MeshStandardMaterial({ color:  0x12cbc4, roughness: 0.4 }); // Cyan stalk
      const knobGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const knobMat = new THREE.MeshStandardMaterial({ color:  0x5758bb, roughness: 0.4 }); // Magenta knob

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
  },

    buildHBV(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hbv";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const radius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
    if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.1, 4.5);
    
    // Bright orange to match image
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color:  0x00d2d3 , wireframe: true, transparent: true, opacity: 0.4 }) 
                              : new THREE.MeshStandardMaterial({ color:  0x00d2d3, roughness: 0.7, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // Dark orange dense bumps
    if (!isHologram) {
      const spikeGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const spikeMat = new THREE.MeshStandardMaterial({ color:  0x0a3d62, roughness: 0.8 });
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
  },

  buildZika(mode = "surface") {
    // Reuse dengue logic but with different colors
    const group = this.buildDengue(mode);
    group.name = "zika";
    if (mode === "surface") {
         group.children[0].material.color.setHex(0x1abc9c);
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x9b59b6) c.material.color.setHex(0xe84393);
            if (c.material.color.getHex() === 0xf1c40f) c.material.color.setHex(0x74b9ff);
         }
       });
    } else if (mode === "hologram" && group.children.length > 0) {
       group.children[0].material.color.setHex(0xe84393);
    }
    return group;
  },

  // 11. Rotavirus
    buildRotavirus(mode = "surface") {
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

    const vp7Mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x8e44ad, wireframe: true, transparent: true, opacity: 0.4 })
                              : new THREE.MeshStandardMaterial({ color:  0x0984e3, roughness: 0.7, bumpScale: 0.2, side: THREE.DoubleSide });
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

      const spikeMat = new THREE.MeshStandardMaterial({ color:  0xd63031, roughness: 0.5, side: THREE.DoubleSide });
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
  },

  buildHSV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Envelope
    const radius = 3.5;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3.5);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7675, wireframe: true, transparent: true, opacity: 0.4 })
                              : this.createBiomaterial(0xd63031, 0.7, 0.1);
    const env = new THREE.Mesh(envGeo, envMat);
    group.add(env);

    // Spikes
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const spikeMat = this.createBiomaterial(0x9b59b6, 0.5, 0.1); // Purple spikes for HSV
      for(let i=0; i<100; i++) {
        const y = 1 - (i / 99) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR).normalize();
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.2);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Tegument & Capsid
    if (isCutaway || isHologram) {
      const tegGeo = new THREE.SphereGeometry(2.5, 32, 32);
      const tegMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xfdcb6e, wireframe: true, transparent: true, opacity: 0.2 })
                                : this.createBiomaterial(0xffeaa7, 0.9, 0, true, 0.7);
      group.add(new THREE.Mesh(tegGeo, tegMat));

      const capGeo = new THREE.IcosahedronGeometry(1.5, 1);
      const capMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x8e44ad, wireframe: true })
                                : this.createBiomaterial(0x74b9ff, 0.4, 0.3);
      group.add(new THREE.Mesh(capGeo, capMat));
    }
    return group;
  },

  // 13. Norovirus
    buildNorovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const capsidGroup = new THREE.Group();

    if (!isHologram) {
      // Norovirus (Calicivirus) is famous for 32 cup-shaped depressions
      // We get exactly 32 locations from the 12 vertices + 20 face centers of an Icosahedron(r, 0)
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 0);
      const locations = [];
      const pos = baseGeo.attributes.position;
      
      // 1. Add 12 vertices
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!locations.find(a => a.distanceTo(v) < 0.1)) locations.push(v);
      }
      
      // 2. Add 20 face centers (every 3 consecutive vertices make a face)
      // Actually, buffer geometry might not be perfectly ordered, so we use index or compute mathematically.
      // Better yet, Icosahedron(r, 1) has exactly 42 vertices. 42 - 12 (original) + some edge centers.
      // Let's just use Icosahedron(r, 1) vertices (42 cups) which is very close visually to 32.
      const denseGeo = new THREE.IcosahedronGeometry(2.4, 1);
      const densePos = denseGeo.attributes.position;
      const denseLocations = [];
      for (let i = 0; i < densePos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(densePos, i);
        if (!denseLocations.find(a => a.distanceTo(v) < 0.1)) denseLocations.push(v);
      }

      // Cup geometry
      const cupGeo = new THREE.CylinderGeometry(0.5, 0.2, 0.4, 12, 1, false);
      const cupInnerGeo = new THREE.CylinderGeometry(0.4, 0.15, 0.41, 12, 1, false);
      const cupMat = new THREE.MeshStandardMaterial({ color: 0x6c5ce7, roughness: 0.6 });
      const cupInnerMat = new THREE.MeshStandardMaterial({ color: 0x4a409e, roughness: 0.8 }); // darker inside
      
      const cupCompound = new THREE.Group();
      const outer = new THREE.Mesh(cupGeo, cupMat);
      const inner = new THREE.Mesh(cupInnerGeo, cupInnerMat);
      inner.position.y = 0.05; // slightly higher
      cupCompound.add(outer);
      cupCompound.add(inner);
      
      // Add a base shell to block the empty space
      const shellGeo = new THREE.IcosahedronGeometry(2.3, 2);
      const shellMat = new THREE.MeshStandardMaterial({ color: 0x3c3088, roughness: 0.7 });
      if (isCutaway) shellMat.transparent = true, shellMat.opacity = 0.3;
      const shell = new THREE.Mesh(shellGeo, shellMat);
      capsidGroup.add(shell);

      denseLocations.forEach(v => {
        if (isCutaway && v.y < -0.2) return;
        const cup = cupCompound.clone();
        cup.position.copy(v).normalize().multiplyScalar(2.5);
        cup.lookAt(new THREE.Vector3(0,0,0));
        cup.rotation.x -= Math.PI / 2; // point outwards
        capsidGroup.add(cup);
      });
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 16, 2, 5);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildHPV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    // Base blue sphere
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 4);
    
    // Perturb vertices to create a bumpy/golf-ball-like base for capsomeres
    if (!isHologram && !isCutaway && geo.attributes.position) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // high frequency noise
        const noise = Math.sin(v.x*10)*Math.sin(v.y*10)*Math.sin(v.z*10);
        v.addScaledVector(v.clone().normalize(), noise*0.05);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }

    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x8e44ad, wireframe: true })
                           : new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.6, bumpScale: 0.1 });
    const cap = new THREE.Mesh(geo, mat);
    group.add(cap);

    // Add yellow star-shaped capsomeres (L1 pentamers)
    if (!isHologram) {
      // Star geometry
      const starShape = new THREE.Shape();
      const outerR = 0.35;
      const innerR = 0.15;
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerR : innerR;
        const a = (i / (points * 2)) * Math.PI * 2;
        if (i === 0) starShape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else starShape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      
      const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      
      // Center geometry
      starGeo.computeBoundingBox();
      const centerOffset = -0.5 * (starGeo.boundingBox.max.z - starGeo.boundingBox.min.z);
      starGeo.translate(0, 0, centerOffset);
      
      const starMat = new THREE.MeshStandardMaterial({ color:  0x9b59b6, roughness: 0.5 });
      
      // Distribute stars on vertices of a simpler icosahedron
      const distIco = new THREE.IcosahedronGeometry(radius, 1);
      const pos = distIco.attributes.position;
      const added = [];
      for(let i=0; i<pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // check duplicate
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.1) continue;
          
          const star = new THREE.Mesh(starGeo, starMat);
          star.position.copy(v).normalize().multiplyScalar(radius + 0.05);
          star.lookAt(new THREE.Vector3(0,0,0));
          group.add(star);
        }
      }
    }

    if (isCutaway && !isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 64, 8, 2, 3);
      const dnaMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.4 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    
    return group;
  },

    buildMeasles(mode = "surface") {
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
                              : new THREE.MeshStandardMaterial({ color:  0xfeca57, roughness: 0.8, bumpScale: 0.2 });
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    if (!isHologram) {
      // Compound H spike (Hemagglutinin - mushroom like)
      const hGroup = new THREE.Group();
      hGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), new THREE.MeshStandardMaterial({ color:  0xe84118 })));
      const hHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xc44569 }));
      hHead.position.y = 0.2;
      hGroup.add(hHead);

      // Compound F spike (Fusion - needle/cone like)
      const fGroup = new THREE.Group();
      fGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.5, 8), new THREE.MeshStandardMaterial({ color:  0xfd79a8 })));
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
  },

  buildMimivirus(mode = "surface") {
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
  },

  buildPithovirus(mode = "surface") {
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
  },

  buildTupanvirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Head
    const radius = 2;
    const headGeo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI) : new THREE.IcosahedronGeometry(radius, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true }) : this.createBiomaterial(0xff7979, 0.7, 0.1);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 3;
    group.add(head);

    // Giant Tail
    const tailGeo = isCutaway ? new THREE.CylinderGeometry(1.2, 1.2, 6, 32, 8, false, 0, Math.PI) : new THREE.CylinderGeometry(1.2, 1.2, 6, 32, 8);
    const tailMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf0932b, wireframe: true }) : this.createBiomaterial(0xffbe76, 0.6, 0.2);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = -1;
    group.add(tail);

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = 3;
      group.add(dna);
    }
    return group;
  },

  buildATV(mode = "surface") {
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
  },

  buildGeminivirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const geo = isCutaway ? new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI, 0, Math.PI) : new THREE.IcosahedronGeometry(1.5, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x6ab04c, wireframe: true }) : this.createBiomaterial(0xbadc58, 0.6, 0.2);
    
    const cap1 = new THREE.Mesh(geo, mat);
    cap1.position.y = 1.2;
    group.add(cap1);
    
    const cap2 = new THREE.Mesh(geo, mat);
    cap2.position.y = -1.2;
    group.add(cap2);

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b });
      const dna1 = new THREE.Mesh(dnaGeo, dnaMat);
      dna1.position.y = 1.2;
      group.add(dna1);
      const dna2 = new THREE.Mesh(dnaGeo, dnaMat);
      dna2.position.y = -1.2;
      group.add(dna2);
    }
    return group;
  },

    buildTMV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    if (!isHologram) {
      const capsidGroup = new THREE.Group();
      const capGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xbadc58, roughness: 0.6, transparent: isCutaway, opacity: isCutaway ? 0.4 : 1 });
      
      const RNAgeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 3, 0)
      ]), 100, 0.08, 8, false);
      const RNAMat = new THREE.MeshStandardMaterial({ color: 0xff4757 });
      const rnaSpiral = new THREE.Group();

      // Helical assembly
      let y = -3;
      let angle = 0;
      while (y < 3) {
        if (!(isCutaway && y > 0 && Math.cos(angle) > 0)) {
           const cap = new THREE.Mesh(capGeo, capMat);
           cap.position.set(Math.cos(angle)*1.0, y, Math.sin(angle)*1.0);
           capsidGroup.add(cap);
        }
        
        if (y % 0.2 < 0.05) {
           const rPiece = new THREE.Mesh(new THREE.SphereGeometry(0.06), RNAMat);
           rPiece.position.set(Math.cos(angle)*0.6, y, Math.sin(angle)*0.6);
           rnaSpiral.add(rPiece);
        }

        y += 0.02;
        angle += 0.3;
      }
      group.add(capsidGroup);
      if (isCutaway) group.add(rnaSpiral);
      
    } else {
      const geo = new THREE.CylinderGeometry(1.2, 1.2, 6, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0xbadc58, wireframe: true });
      group.add(new THREE.Mesh(geo, mat));
    }
    return group;
  },

  buildM13(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const curvePoints = [];
    for(let i=0; i<=20; i++) {
      curvePoints.push(new THREE.Vector3(Math.sin(i*0.5)*2, (i-10)*0.5, Math.cos(i*0.3)*2));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    const geo = new THREE.TubeGeometry(curve, 100, 0.3, 16, false);
    if (isCutaway) this.clipGeometry(geo);
    
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xc7ecee, wireframe: true }) : this.createBiomaterial(0x7ed6df, 0.5, 0.1);
    group.add(new THREE.Mesh(geo, mat));

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildACV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const curvePoints = [];
    for(let i=0; i<=100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 10; // 5 coils
      curvePoints.push(new THREE.Vector3(Math.cos(angle)*1.5, t*6 - 3, Math.sin(angle)*1.5));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    const geo = new THREE.TubeGeometry(curve, 200, 0.4, 16, false);
    if (isCutaway) this.clipGeometry(geo);
    
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xffbe76, wireframe: true }) : this.createBiomaterial(0xf0932b, 0.7, 0.3);
    group.add(new THREE.Mesh(geo, mat));
    
    return group;
  },

  buildGuttavirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Teardrop shape using LatheGeometry
    const points = [];
    for ( let i = 0; i <= 20; i ++ ) {
      const y = (i / 20) * 4 - 2;
      // Formula for droplet
      const x = 2 * (1 - y/2) * Math.sqrt((y+2)/4);
      points.push( new THREE.Vector2( x, y ) );
    }
    const geo = isCutaway ? new THREE.LatheGeometry(points, 32, 0, Math.PI) : new THREE.LatheGeometry(points, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x7ed6df, wireframe: true }) : this.createBiomaterial(0x22a6b3, 0.7, 0.1);
    group.add(new THREE.Mesh(geo, mat));

    // Beard
    if (!isCutaway) {
      const beardGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 4);
      const beardMat = this.createBiomaterial(0xc7ecee, 0.5, 0.1);
      for(let i=0; i<15; i++) {
        const b = new THREE.Mesh(beardGeo, beardMat);
        b.position.set((Math.random()-0.5)*0.5, 2.5, (Math.random()-0.5)*0.5);
        b.rotation.x = (Math.random()-0.5)*0.5;
        b.rotation.z = (Math.random()-0.5)*0.5;
        group.add(b);
      }
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = -0.5;
      group.add(dna);
    }
    return group;
  },

    buildAstrovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.5;
    const capsidGroup = new THREE.Group();

    if (!isHologram) {
      // Base smooth sphere
      const shellGeo = new THREE.IcosahedronGeometry(radius - 0.2, 3);
      const shellMat = new THREE.MeshStandardMaterial({ color: 0xbe2edd, roughness: 0.6 });
      if (isCutaway) shellMat.transparent = true, shellMat.opacity = 0.3;
      const shell = new THREE.Mesh(shellGeo, shellMat);
      capsidGroup.add(shell);

      // Star Shape
      const starShape = new THREE.Shape();
      const outerR = 0.6;
      const innerR = 0.25;
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerR : innerR;
        const a = (i / (points * 2)) * Math.PI * 2;
        if (i === 0) starShape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else starShape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      starGeo.computeBoundingBox();
      starGeo.translate(0, 0, -0.5 * (starGeo.boundingBox.max.z - starGeo.boundingBox.min.z));
      
      const starMat = new THREE.MeshStandardMaterial({ color: 0xff7979, roughness: 0.5 }); // pinkish stars

      // 12 vertices of Icosahedron(r, 0)
      const baseGeo = new THREE.IcosahedronGeometry(radius, 0);
      const locations = [];
      const pos = baseGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!locations.find(a => a.distanceTo(v) < 0.1)) locations.push(v);
      }

      locations.forEach(v => {
        if (isCutaway && v.y < -0.2) return;
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.copy(v).normalize().multiplyScalar(radius - 0.1);
        star.lookAt(new THREE.Vector3(0,0,0));
        capsidGroup.add(star);
      });
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0xe056fd, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 16, 3, 4);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x4834d4, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildBaculovirus(mode = "surface") {
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
  },

    buildOrf(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Orf virus (Parapoxvirus) has a highly distinctive oval "ball of yarn" structure
    if (!isHologram) {
      // Create a dense spiral filament wrapping an oval core
      const coreGeo = new THREE.SphereGeometry(1.8, 32, 32);
      coreGeo.scale(1, 1.4, 1);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.8, transparent: isCutaway, opacity: 0.3 });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      // The yarn wrap (using a dense TorusKnot to simulate spiral filaments)
      const yarnGeo = new THREE.TorusKnotGeometry(1.4, 0.15, 300, 16, 13, 21);
      yarnGeo.scale(1, 1.4, 1); // stretch into oval
      const yarnMat = new THREE.MeshStandardMaterial({ color: 0xff7979, roughness: 0.5 });
      const yarn = new THREE.Mesh(yarnGeo, yarnMat);
      
      if (isCutaway) {
         // Cutaway of yarn using clipping planes or just skipping (since it's a single geo, scaling down is easier or we just use transparency)
         yarn.material.transparent = true;
         yarn.material.opacity = 0.5;
      }
      group.add(yarn);

      if (isCutaway) {
         // Inner dumbbell DNA core
         const dumbGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.0, 16);
         const dumbMat = new THREE.MeshStandardMaterial({ color: 0xee5253, roughness: 0.5 });
         group.add(new THREE.Mesh(dumbGeo, dumbMat));
      }
    } else {
      const geo = new THREE.SphereGeometry(2, 16, 16);
      geo.scale(1, 1.4, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff7979, wireframe: true });
      group.add(new THREE.Mesh(geo, mat));
    }
    return group;
  },

  buildPhi29(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Prolate Icosahedron Head (Stretched)
    const headGeo = isCutaway ? new THREE.SphereGeometry(2, 32, 32, 0, Math.PI) : new THREE.IcosahedronGeometry(2, 1);
    headGeo.scale(1, 1.5, 1);
    const headMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x30336b, wireframe: true }) : this.createBiomaterial(0x130f40, 0.5, 0.3);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;
    group.add(head);

    // Short Tail
    const tailGeo = isCutaway ? new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const tailMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x535c68, wireframe: true }) : this.createBiomaterial(0x95afc0, 0.5, 0.3);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = 0.25;
    group.add(tail);

    // Neck Appendages (Motor/Skirt)
    if (!isCutaway) {
      const skirtGeo = new THREE.CylinderGeometry(1.2, 0.3, 0.5, 12);
      const skirtMat = this.createBiomaterial(0xeb4d4b, 0.6, 0.1);
      const skirt = new THREE.Mesh(skirtGeo, skirtMat);
      skirt.position.y = 1;
      group.add(skirt);
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.1, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xffbe76, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = 2.5;
      group.add(dna);
    }
    return group;
  },

  buildPhiX174(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const radius = 2;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI) : new THREE.IcosahedronGeometry(radius, 1);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x535c68, wireframe: true }) : this.createBiomaterial(0x95afc0, 0.6, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Trumpet Spikes on vertices
    if (!isHologram) {
      const ico = new THREE.IcosahedronGeometry(radius, 0);
      const vertices = ico.attributes.position;
      const spikeGeo = new THREE.CylinderGeometry(0.4, 0.1, 1.5, 12);
      const spikeMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);

      const added = new Set();
      for (let i = 0; i < vertices.count; i++) {
        const v = new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
        const key = v.x.toFixed(1)+","+v.y.toFixed(1)+","+v.z.toFixed(1);
        if (added.has(key)) continue;
        added.add(key);
        
        if (isCutaway && v.y < 0) continue;
        v.normalize();
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(v).multiplyScalar(radius + 0.75);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xf9ca24 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildTorovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI) : new THREE.SphereGeometry(radius, 32, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf6e58d, wireframe: true, transparent: true, opacity: 0.4 }) : this.createBiomaterial(0xf9ca24, 0.6, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Spikes (Peplomers)
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
      const spikeMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);
      for(let i=0; i<200; i++) {
        const y = 1 - (i / 199) * 2;
        if (isCutaway && y < 0) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR);
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.3);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Torus nucleocapsid
    if (isCutaway || isHologram) {
      const coreGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 64);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true }) : this.createBiomaterial(0x686de0, 0.5, 0.2);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.rotation.x = Math.PI / 3;
      group.add(core);
    }
    return group;
  },

  
  // === NEW VIRUSES ===
      buildAdenovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "adenovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 3.0;

    if (!isHologram) {
      // 1. Translucent Blue Icosahedron Shell (matching the classic textbook art)
      const shellGeo = new THREE.IcosahedronGeometry(radius, 0); 
      const shellMat = new THREE.MeshStandardMaterial({
         color: 0x8e44ad,
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
  },

  buildEnterovirus(mode = "surface") {
    const group = new THREE.Group();
    group.name = "enterovirus";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const capsidGroup = new THREE.Group();
    
    if (!isHologram) {
      // Artistic Capsomere Assembly (High-poly Raspberry structure)
      // Icosahedron(2.4, 2) has 162 vertices, creating a dense molecular look
      const baseGeo = new THREE.IcosahedronGeometry(2.4, 2);
      const capsomereGeo = new THREE.SphereGeometry(0.42, 16, 16);
      
      const mat = new THREE.MeshStandardMaterial({ 
          color: 0xffb142, roughness: 0.5, metalness: 0.1,
          transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 
      });
      
      const pos = baseGeo.attributes.position;
      const added = [];
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // Avoid duplicate vertices
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          const cap = new THREE.Mesh(capsomereGeo, mat);
          // Create canyons by varying the distance from center based on noise or position
          const noise = Math.sin(v.x*4)*Math.cos(v.y*4)*Math.sin(v.z*4);
          cap.position.copy(v).normalize().multiplyScalar(2.6 + noise * 0.15);
          
          // Flatten the sphere slightly along the normal to look like a protein complex
          cap.lookAt(new THREE.Vector3(0,0,0));
          cap.scale.set(1, 1, 0.7);
          
          capsidGroup.add(cap);
        }
      }
    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff9f43, wireframe: true, transparent: true, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const rnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 16, 3, 7);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.4 });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildRhinovirus(mode = "surface") {
    // Very similar to Enterovirus structurally, just different coloring and slightly sharper bumps
    const group = this.buildEnterovirus(mode);
    group.name = "rhinovirus";
    const isHologram = mode === "hologram";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        if (child.material.color.getHex() === 0xffb142) {
           child.material.color.setHex(0x1dd1a1); // Capsid color
        } else if (child.material.color.getHex() === 0x10ac84) {
           child.material.color.setHex(0xff9f43); // RNA color
        }
      }
    });
    return group;
  },

    buildInfluenzaB(mode = "surface") {
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
  },

  createVirus(virusId, mode = "surface") {
    switch (virusId) {
        case "polio": return this.buildPolio(mode);
        case "hcv": return this.buildHCV(mode);
        case "rubella": return this.buildRubella(mode);
        case "vzv": return this.buildVZV(mode);


        case "adenovirus": return this.buildAdenovirus(mode);
        case "enterovirus": return this.buildEnterovirus(mode);
        case "rhinovirus": return this.buildRhinovirus(mode);
        case "influenza-b": return this.buildInfluenzaB(mode);

      case "sars-cov-2": return this.buildSARSCoV2(mode);
      case "mpox": return this.buildMpox(mode);
      case "influenza-a": return this.buildInfluenzaA(mode);
      case "bacteriophage-t4": return this.buildBacteriophageT4(mode);
      case "ebola": return this.buildEbola(mode);
      case "dengue": return this.buildDengue(mode);
      case "rabies": return this.buildRabies(mode);
      case "hiv-1": return this.buildHIV1(mode);
      case "hbv": return this.buildHBV(mode);
      case "zika": return this.buildZika(mode);
      case "rotavirus": return this.buildRotavirus(mode);
      case "hsv": return this.buildHSV(mode);
      case "norovirus": return this.buildNorovirus(mode);
      case "hpv": return this.buildHPV(mode);
      case "measles": return this.buildMeasles(mode);
      case "mimivirus": return this.buildMimivirus(mode);
      case "pithovirus": return this.buildPithovirus(mode);
      case "tupanvirus": return this.buildTupanvirus(mode);
      case "atv": return this.buildATV(mode);
      case "geminivirus": return this.buildGeminivirus(mode);
      case "tmv": return this.buildTMV(mode);
      case "m13": return this.buildM13(mode);
      case "acv": return this.buildACV(mode);
      case "guttavirus": return this.buildGuttavirus(mode);
      case "astrovirus": return this.buildAstrovirus(mode);
      case "baculovirus": return this.buildBaculovirus(mode);
      case "orf": return this.buildOrf(mode);
      case "phi29": return this.buildPhi29(mode);
      case "phix174": return this.buildPhiX174(mode);
      case "torovirus": return this.buildTorovirus(mode);

      

      default: return this.buildSARSCoV2(mode);
    }
  }
};

if (typeof window !== "undefined") {
  window.VirusBuilder = VirusBuilder;
}
