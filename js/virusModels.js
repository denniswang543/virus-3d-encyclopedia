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

    // 膜外殼 (Lipid Envelope)
    const envRadius = 3.0;
    const envGeo = isCutaway 
      ? new THREE.SphereGeometry(envRadius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.58) 
      : new THREE.SphereGeometry(envRadius, 48, 48);

    const envMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({
          color: 0x4a1525,
          roughness: 0.7,
          metalness: 0.1,
          bumpScale: 0.05,
          side: THREE.DoubleSide
        });

    const envelope = new THREE.Mesh(envGeo, envMat);
    envelope.name = "sars_envelope";
    group.add(envelope);

    // 剖面切面包邊 (Cross-section lipid bilayer)
    if (isCutaway && !isHologram) {
      const cutCapGeo = new THREE.CircleGeometry(envRadius, 48);
      const cutCapMat = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        roughness: 0.5,
        side: THREE.DoubleSide
      });
      const cutCap = new THREE.Mesh(cutCapGeo, cutCapMat);
      cutCap.rotation.x = Math.PI / 2;
      cutCap.position.y = -Math.cos(Math.PI * 0.58) * envRadius; // 切面底處
      group.add(cutCap);
    }

    // S 刺突蛋白 (Spike Trimers) - 經典皇冠狀三聚體
    const spikeCount = isCutaway ? 45 : 75;
    const stalkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8);
    const headGeo = new THREE.DodecahedronGeometry(0.35, 1);
    
    // 建立單個 S 刺突蛋白複合幾何
    const singleSpikeGroup = new THREE.Group();
    const stalkMesh = new THREE.Mesh(
      stalkGeo,
      new THREE.MeshStandardMaterial({ color: 0xe84118, roughness: 0.4 })
    );
    stalkMesh.position.y = 0.6;
    singleSpikeGroup.add(stalkMesh);

    // 三瓣頂部受體結合域 (RBD Head)
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const petal = new THREE.Mesh(
        headGeo,
        new THREE.MeshStandardMaterial({ color: 0xff4757, roughness: 0.3, metalness: 0.2 })
      );
      petal.scale.set(0.6, 0.7, 0.6);
      petal.position.set(Math.sin(angle) * 0.22, 1.25, Math.cos(angle) * 0.22);
      singleSpikeGroup.add(petal);
    }

    // 斐波那契球面均勻分佈刺突
    const phi = Math.PI * (3 - Math.sqrt(5)); // 黃金角
    for (let i = 0; i < spikeCount; i++) {
      const y = 1 - (i / (spikeCount - 1)) * 2; // y 在 [-1, 1]
      if (isCutaway && y < -0.2) continue; // 剖面模式切除下部

      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const spike = singleSpikeGroup.clone();
      const pos = new THREE.Vector3(x, y, z).multiplyScalar(envRadius);
      spike.position.copy(pos);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      group.add(spike);
    }

    // M (Membrane) & E 小蛋白粒 (表面密集小顆粒)
    const mProteinGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const mProteinMat = new THREE.MeshStandardMaterial({ color: 0xffa502, roughness: 0.5 });
    const mInstanced = new THREE.InstancedMesh(mProteinGeo, mProteinMat, 150);
    const dummy = new THREE.Object3D();
    let validM = 0;
    for (let i = 0; i < 200; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phiAngle = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phiAngle);
      const y = Math.cos(phiAngle);
      if (isCutaway && y < -0.25) continue;
      if (validM >= 150) break;

      const x = sinPhi * Math.cos(theta);
      const z = sinPhi * Math.sin(theta);
      dummy.position.set(x, y, z).multiplyScalar(envRadius + 0.05);
      dummy.updateMatrix();
      mInstanced.setMatrixAt(validM++, dummy.matrix);
    }
    mInstanced.count = validM;
    group.add(mInstanced);

    // 內部結構 (剖面模式下可見 RNA 螺旋與 N 核蛋白)
    
    const coreGroup = new THREE.Group();
    coreGroup.name = "sars_coreGroup";
    if (!isCutaway && !isHologram) coreGroup.visible = false;
    {

      
      // RNA 螺旋曲線
      const curvePoints = [];
      const turns = 7;
      const count = 250;
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * turns;
        const r = (1.8 * Math.sin(t * Math.PI)) + 0.2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = (t - 0.5) * 3.5;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
      const rnaCurve = new THREE.CatmullRomCurve3(curvePoints);
      const rnaGeo = new THREE.TubeGeometry(rnaCurve, 200, 0.08, 8, false);
      const rnaMat = new THREE.MeshStandardMaterial({
        color: 0x00d2d3,
        emissive: 0x015555,
        roughness: 0.3
      });
      const rnaMesh = new THREE.Mesh(rnaGeo, rnaMat);
      coreGroup.add(rnaMesh);

      // N 蛋白小珍珠串
      const nGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const nMat = new THREE.MeshStandardMaterial({ color: 0x54a0ff, roughness: 0.4 });
      for (let i = 0; i < count; i += 4) {
        const pt = curvePoints[i];
        const nMesh = new THREE.Mesh(nGeo, nMat);
        nMesh.position.copy(pt);
        coreGroup.add(nMesh);
      }

      group.add(coreGroup);
    }

    return group;
  },

  // 2. Mpox (猴痘病毒 - 磚型雙層膜與啞鈴形核心)
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
    const envGeo = isCutaway
      ? new THREE.SphereGeometry(envRadius, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.55)
      : new THREE.SphereGeometry(envRadius, 40, 40);

    const envMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({ color: 0x1e3799, roughness: 0.6, side: THREE.DoubleSide });
    group.add(new THREE.Mesh(envGeo, envMat));

    // HA (血凝素 - 棒狀三聚體，紅色/亮橘) & NA (神經氨酸酶 - 蘑菇四聚體，藍/青色)
    const haGeo = new THREE.CylinderGeometry(0.1, 0.14, 1.1, 6);
    const haMat = new THREE.MeshStandardMaterial({ color: 0xeb2f06, roughness: 0.3 }); // HA: 紅色棒狀

    const naStalkGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.9, 6);
    const naHeadGeo = new THREE.BoxGeometry(0.4, 0.2, 0.4);
    const naMat = new THREE.MeshStandardMaterial({ color: 0x00d2d3, roughness: 0.3, metalness: 0.2 }); // NA: 蘑菇狀青色

    const singleNaGroup = new THREE.Group();
    const naStalk = new THREE.Mesh(naStalkGeo, naMat);
    naStalk.position.y = 0.45;
    const naHead = new THREE.Mesh(naHeadGeo, naMat);
    naHead.position.y = 0.95;
    singleNaGroup.add(naStalk);
    singleNaGroup.add(naHead);

    const totalSpikes = isCutaway ? 60 : 110;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < totalSpikes; i++) {
      const y = 1 - (i / (totalSpikes - 1)) * 2;
      if (isCutaway && y < -0.2) continue;

      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const pos = new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      ).multiplyScalar(envRadius);

      // HA 約佔 80%, NA 約佔 20%
      const isNA = (i % 5 === 0);
      let spike;
      if (isNA) {
        spike = singleNaGroup.clone();
      } else {
        spike = new THREE.Mesh(haGeo, haMat);
        spike.geometry.center();
        spike.position.y = 0.55;
        const wrapper = new THREE.Group();
        wrapper.add(spike);
        spike = wrapper;
      }

      spike.position.copy(pos);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      group.add(spike);
    }

    // 內部 8 條分節 RNA (8 Segments of vRNP)
    if (isCutaway || isHologram) {
      const rnpGroup = new THREE.Group();
      const rnpMat = new THREE.MeshStandardMaterial({
        color: 0xf6b93b,
        emissive: 0x785300,
        roughness: 0.4
      });

      // 排列 8 條具有不同長度的直立螺旋管狀片段
      for (let s = 0; s < 8; s++) {
        const segLen = 1.4 + (s % 4) * 0.3;
        const angle = (s * Math.PI * 2) / 7;
        const rad = s === 7 ? 0 : 0.85; // 第8條在正中心，7條環繞
        const px = Math.cos(angle) * rad;
        const pz = Math.sin(angle) * rad;

        // 用螺旋曲線表現每條 RNP
        const pts = [];
        for (let j = 0; j < 30; j++) {
          const t = j / 30;
          const theta = t * Math.PI * 8;
          const h = (t - 0.5) * segLen;
          pts.push(new THREE.Vector3(
            px + Math.cos(theta) * 0.12,
            h,
            pz + Math.sin(theta) * 0.12
          ));
        }
        const tubeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.05, 6, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, rnpMat);
        rnpGroup.add(tubeMesh);
      }
      group.add(rnpGroup);
    }

    return group;
  },

  // 4. Bacteriophage T4 (T4 噬菌體 - 幾何機械蜘蛛狀)
  buildBacteriophageT4(mode = "surface") {
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

  // 5. Ebola Virus (埃博拉病毒 - 牧羊杖/長絲狀牧羊鉤)
  buildEbola(mode = "surface") {
    const group = new THREE.Group();
    group.name = "ebola";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // 構建經典的 "6" 字形 / 牧羊杖絲狀曲線 (CatmullRom Curve)
    const curvePoints = [
      new THREE.Vector3(0, -3.5, 0),
      new THREE.Vector3(0.2, -2.0, 0.1),
      new THREE.Vector3(-0.1, 0.0, -0.1),
      new THREE.Vector3(0.3, 1.8, 0.2),
      new THREE.Vector3(1.2, 2.8, 0.0),
      new THREE.Vector3(1.5, 3.6, -0.3),
      new THREE.Vector3(0.6, 4.2, 0.1),
      new THREE.Vector3(-0.6, 3.8, 0.2),
      new THREE.Vector3(-1.0, 2.8, 0.0),
      new THREE.Vector3(-0.3, 2.1, -0.2)
    ];

    const ebolaCurve = new THREE.CatmullRomCurve3(curvePoints);
    const radius = 0.55;

    // 外膜管狀幾何 (Envelope Tube)
    const tubeGeo = new THREE.TubeGeometry(ebolaCurve, 120, radius, 24, false);
    const tubeMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xff4d4d, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({
          color: 0x990000,
          roughness: 0.6,
          metalness: 0.1,
          transparent: isCutaway,
          opacity: isCutaway ? 0.45 : 1.0
        });

    const envelope = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(envelope);

    // 表面密集 GP 刺突糖蛋白
    const spikeGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.35, 6);
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.3 });
    const samplePoints = ebolaCurve.getSpacedPoints(70);

    for (let i = 0; i < samplePoints.length; i++) {
      const pt = samplePoints[i];
      const tangent = ebolaCurve.getTangent(i / samplePoints.length);
      const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();

      for (let k = 0; k < 6; k++) {
        const angle = (k * Math.PI * 2) / 6;
        const rotatedNormal = normal.clone().applyAxisAngle(tangent, angle);
        const pos = pt.clone().add(rotatedNormal.clone().multiplyScalar(radius));

        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(pos);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rotatedNormal);
        group.add(spike);
      }
    }

    // 內部螺旋核衣殼管 (Inner Helical Nucleocapsid Core)
    if (isCutaway || isHologram) {
      const innerTubeGeo = new THREE.TubeGeometry(ebolaCurve, 120, 0.25, 16, false);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xffd32a,
        emissive: 0x594300,
        roughness: 0.3
      });
      const innerCore = new THREE.Mesh(innerTubeGeo, innerMat);
      group.add(innerCore);

      // 纏繞在核衣殼內部的 RNA 螺旋微線
      const helixMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const helixPoints = [];
      for (let i = 0; i < samplePoints.length; i++) {
        const pt = samplePoints[i];
        const tangent = ebolaCurve.getTangent(i / samplePoints.length);
        const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();
        const angle = i * 0.8;
        helixPoints.push(pt.clone().add(normal.clone().applyAxisAngle(tangent, angle).multiplyScalar(0.28)));
      }
      const helixGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints), 100, 0.03, 4, false);
      group.add(new THREE.Mesh(helixGeo, helixMat));
    }

    return group;
  },

  // 6. Dengue Virus (登革熱病毒 - 90人字形二聚體緊密平滑二十面體)
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
      ? new THREE.MeshBasicMaterial({ color: 0x2bcbba, wireframe: true, opacity: 0.5 })
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
      ? new THREE.MeshBasicMaterial({ color: 0x20bf6b, wireframe: true })
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

    // 子彈主體 (半球圓頂 + 圓柱軀幹)
    const bulletGroup = new THREE.Group();

    // 圓柱軀幹
    const cylGeo = isCutaway
      ? new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32, 1, false, 0, Math.PI * 1.1)
      : new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32);

    // 頂部半球
    const domeGeo = isCutaway
      ? new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 1.1, 0, Math.PI * 0.5)
      : new THREE.SphereGeometry(bodyRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);

    const bulletMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({
          color: 0xc23616,
          roughness: 0.6,
          metalness: 0.1,
          side: THREE.DoubleSide
        });

    const cylMesh = new THREE.Mesh(cylGeo, bulletMat);
    const domeMesh = new THREE.Mesh(domeGeo, bulletMat);
    domeMesh.position.y = bodyHeight * 0.5;

    bulletGroup.add(cylMesh);
    bulletGroup.add(domeMesh);

    // 底部內凹平基座 (Invaginated Base)
    if (!isHologram) {
      const baseGeo = new THREE.RingGeometry(0.3, bodyRadius, 32);
      const baseMesh = new THREE.Mesh(baseGeo, bulletMat);
      baseMesh.rotation.x = Math.PI / 2;
      baseMesh.position.y = -bodyHeight * 0.5;
      bulletGroup.add(baseMesh);
    }
    group.add(bulletGroup);

    // 表面 G 糖蛋白三聚體刺突 (均勻分佈於圓頂與圓柱側面)
    const gSpikeGeo = new THREE.ConeGeometry(0.12, 0.45, 6);
    const gSpikeMat = new THREE.MeshStandardMaterial({ color: 0xfbc531, roughness: 0.3 });

    const totalSpikes = isCutaway ? 60 : 120;
    for (let i = 0; i < totalSpikes; i++) {
      const h = ((i / totalSpikes) - 0.5) * bodyHeight * 0.95;
      const angle = i * 2.4;
      if (isCutaway && Math.sin(angle) < -0.1) continue;

      const spike = new THREE.Mesh(gSpikeGeo, gSpikeMat);
      spike.position.set(Math.cos(angle) * (bodyRadius + 0.2), h, Math.sin(angle) * (bodyRadius + 0.2));
      spike.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
      );
      group.add(spike);
    }

    // 內部緊密盤繞的 RNP 螺旋管 (Coiled RNP Spring Core)
    if (isCutaway || isHologram) {
      const coilPoints = [];
      const turns = 18;
      const ptsCount = 300;
      for (let i = 0; i < ptsCount; i++) {
        const t = i / ptsCount;
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * (bodyHeight + 0.6);
        const r = 0.95;
        coilPoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
      }
      const coilGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPoints), 200, 0.09, 8, false);
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0x4cd137,
        emissive: 0x145a0b,
        roughness: 0.3
      });
      group.add(new THREE.Mesh(coilGeo, coilMat));
    }

    return group;
  },

  // 8. HIV-1 (愛滋病毒 - gp120/gp41 刺突與經典錐形衣殼)
  buildHIV1(mode = "surface") {
    const group = new THREE.Group();
    group.name = "hiv-1";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const envRadius = 2.9;
    const envGeo = isCutaway
      ? new THREE.SphereGeometry(envRadius, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.55)
      : new THREE.SphereGeometry(envRadius, 36, 36);

    const envMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0x10ac84, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({
          color: 0x10ac84,
          roughness: 0.6,
          side: THREE.DoubleSide
        });
    group.add(new THREE.Mesh(envGeo, envMat));

    // gp120 / gp41 刺突複合物 (HIV 表面刺突數量稀少，約 10-18 個)
    const spikeCount = isCutaway ? 8 : 14;
    const gpStalkGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6);
    const gpHeadGeo = new THREE.DodecahedronGeometry(0.3, 1);
    const gpMat = new THREE.MeshStandardMaterial({ color: 0xff6b81, roughness: 0.3 });

    const singleGpGroup = new THREE.Group();
    const gpStalk = new THREE.Mesh(gpStalkGeo, gpMat);
    gpStalk.position.y = 0.4;
    const gpHead = new THREE.Mesh(gpHeadGeo, gpMat);
    gpHead.position.y = 0.9;
    singleGpGroup.add(gpStalk);
    singleGpGroup.add(gpHead);

    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < spikeCount; i++) {
      const y = 1 - (i / (spikeCount - 1)) * 2;
      if (isCutaway && y < -0.2) continue;

      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const pos = new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      ).multiplyScalar(envRadius);

      const spike = singleGpGroup.clone();
      spike.position.copy(pos);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      group.add(spike);
    }

    // 內部富勒烯錐形衣殼 (Conical p24 Capsid Core) + 逆轉錄酶 (RT) + 雙單鏈 RNA
    if (isCutaway || isHologram) {
      const coreGroup = new THREE.Group();

      // 錐形衣殼 (寬端頂部 ~1.2，窄端底部 ~0.5，高 ~2.4)
      const coneGeo = new THREE.CylinderGeometry(0.5, 1.2, 2.4, 18, 1, true);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x5f27cd,
        roughness: 0.4,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.rotation.z = Math.PI; // 寬端朝上，窄端朝下
      coreGroup.add(coneMesh);

      // 頂部與底部圓蓋
      const topCap = new THREE.Mesh(new THREE.CircleGeometry(1.2, 18), coneMat);
      topCap.position.y = 1.2;
      topCap.rotation.x = -Math.PI / 2;
      const btmCap = new THREE.Mesh(new THREE.CircleGeometry(0.5, 18), coneMat);
      btmCap.position.y = -1.2;
      btmCap.rotation.x = Math.PI / 2;
      coreGroup.add(topCap);
      coreGroup.add(btmCap);

      // 錐形衣殼內部的 2 條 RNA 鏈 (雙拷貝)
      const rna1Geo = new THREE.TorusGeometry(0.4, 0.05, 8, 24);
      const rnaMat = new THREE.MeshStandardMaterial({ color: 0x00d2d3, emissive: 0x004a4a });
      const rna1 = new THREE.Mesh(rna1Geo, rnaMat);
      rna1.position.set(0, 0.3, 0);
      rna1.rotation.x = 0.5;

      const rna2 = new THREE.Mesh(rna1Geo, rnaMat);
      rna2.position.set(0, -0.2, 0);
      rna2.rotation.x = -0.5;

      coreGroup.add(rna1);
      coreGroup.add(rna2);

      // 逆轉錄酶 (RT) 球體複合物
      const rtGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const rtMat = new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.2 });
      const rt1 = new THREE.Mesh(rtGeo, rtMat);
      rt1.position.set(0.2, 0.1, 0.2);
      const rt2 = new THREE.Mesh(rtGeo, rtMat);
      rt2.position.set(-0.2, -0.1, -0.2);
      coreGroup.add(rt1);
      coreGroup.add(rt2);

      group.add(coreGroup);
    }

    return group;
  },

  // 9. HBV
  buildHBV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    // Envelope
    const radius = 2.8;
    const envGeo = isCutaway ? new THREE.SphereGeometry(radius, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.SphereGeometry(radius, 48, 48);
      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 3.5);
    const envMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf1c40f, wireframe: true, transparent: true, opacity: 0.4 }) 
                              : this.createBiomaterial(0xffda79, 0.6, 0.2);
    const envelope = new THREE.Mesh(envGeo, envMat);
    group.add(envelope);

    // HBsAg Spikes
    if (!isHologram) {
      const spikeGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const spikeMat = this.createBiomaterial(0xd35400, 0.5, 0.1);
      const spikeCount = 80;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.2) continue;
        const tempRadius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * tempRadius;
        const z = Math.sin(theta) * tempRadius;
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x * radius, y * radius, z * radius);
        spike.scale.set(1.5, 1, 1.5);
        spike.lookAt(0, 0, 0);
        group.add(spike);
      }
    }

    // Capsid
    if (isCutaway || isHologram) {
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x27ae60, wireframe: true })
                                 : this.createBiomaterial(0xf39c12, 0.4, 0.1);
      const core = new THREE.Mesh(coreGeo, coreMat);
      if (isCutaway && !isHologram) {
         core.geometry = new THREE.IcosahedronGeometry(1.6, 1).toNonIndexed();
      }
      group.add(core);
    }
    return group;
  },

  // 10. Zika
  buildZika(mode = "surface") {
    // Reuse dengue logic but with different colors
    const group = this.buildDengue(mode);
    group.name = "zika";
    if (mode === "surface") {
       group.children.forEach(c => {
         if (c.material && c.material.color) {
            if (c.material.color.getHex() === 0x2bcbba) c.material.color.setHex(0xe84393);
            if (c.material.color.getHex() === 0x20bf6b) c.material.color.setHex(0xfd79a8);
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
      const capMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true })
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

    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true })
                           : new THREE.MeshStandardMaterial({ color: 0x0984e3, roughness: 0.6, bumpScale: 0.1 });
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
      
      const starMat = new THREE.MeshStandardMaterial({ color: 0xfeca57, roughness: 0.5 });
      
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
    const capsidGroup = new THREE.Group();
    
    if (!isHologram) {
      // High-poly capsomere assembly for Adenovirus (252 capsomeres)
      const baseGeo = new THREE.IcosahedronGeometry(2.8, 3); // Very dense
      const capsomereGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 6); // Hexons
      
      const mat = new THREE.MeshStandardMaterial({ 
          color: 0x0abde3, roughness: 0.7, metalness: 0.1,
          transparent: isCutaway, opacity: isCutaway ? 0.3 : 1.0 
      });
      
      const pos = baseGeo.attributes.position;
      const added = [];
      const vertices = []; // save 12 original vertices for fibers
      const origIco = new THREE.IcosahedronGeometry(2.8, 0);
      
      for(let i=0; i<origIco.attributes.position.count; i++) {
         vertices.push(new THREE.Vector3().fromBufferAttribute(origIco.attributes.position, i));
      }

      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        if (!added.find(a => a.distanceTo(v) < 0.2)) {
          added.push(v);
          if (isCutaway && v.y < -0.2) continue;
          
          const cap = new THREE.Mesh(capsomereGeo, mat);
          cap.position.copy(v);
          cap.lookAt(new THREE.Vector3(0,0,0));
          cap.rotation.x -= Math.PI/2;
          capsidGroup.add(cap);
        }
      }
      
      // Fibers
      const fiberGroup = new THREE.Group();
      const stalkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 5);
      const knobGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const fiberMat = new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.4 });
      
      vertices.forEach(v => {
         let isUnique = true;
         for(let c of fiberGroup.children) { if (c.position.distanceTo(v) < 0.1) isUnique = false; }
         if (isUnique) {
             const stalk = new THREE.Mesh(stalkGeo, fiberMat);
             stalk.position.copy(v).normalize().multiplyScalar(2.8 + 0.9);
             stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v.clone().normalize());
             
             const knob = new THREE.Mesh(knobGeo, fiberMat);
             knob.position.copy(v).normalize().multiplyScalar(2.8 + 1.8);
             
             fiberGroup.add(stalk);
             fiberGroup.add(knob);
         }
      });
      group.add(fiberGroup);

    } else {
      const geo = new THREE.IcosahedronGeometry(radius, 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x0abde3, wireframe: true, transparent: isCutaway, opacity: 0.5 });
      capsidGroup.add(new THREE.Mesh(geo, mat));
    }
    
    group.add(capsidGroup);

    if (isCutaway && !isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
      const dnaMat = new THREE.MeshStandardMaterial({ color: 0xee5253, roughness: 0.3 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
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
    // Structural twin of Influenza A, but with blue/cyan aesthetics instead of red/pink
    const group = this.buildInfluenzaA(mode);
    group.name = "influenza-b";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: 0x1e3799 -> slightly brighter blue for B
        if (hex === 0x1e3799) child.material.color.setHex(0x0a3d62);
        // HA (red 0xeb2f06) -> Blue/Cyan HA
        if (hex === 0xeb2f06) child.material.color.setHex(0x54a0ff);
        // NA (cyan 0x00d2d3) -> Yellow/Orange NA
        if (hex === 0x00d2d3) child.material.color.setHex(0xfeca57);
      }
    });
    return group;
  },

  
  
  buildVZV(mode = "surface") {
    // VZV is closely related to HSV, structurally identical (Envelope, Tegument, Capsid, DNA).
    // We will use the HSV builder and recolor it to a distinct "chickenpox" red/pink theme.
    const group = this.buildHSV(mode);
    group.name = "vzv";
    
    group.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const hex = child.material.color.getHex();
        // Envelope: 0xd63031 -> 0xff4757
        if (hex === 0xd63031 || hex === 0xff7675) child.material.color.setHex(0xff4757);
        // Spikes: 0x2d3436 -> 0xff7f50
        if (hex === 0x2d3436) child.material.color.setHex(0xff7f50);
        // Tegument: 0xffeaa7 -> 0xffa502
        if (hex === 0xffeaa7 || hex === 0xfdcb6e) child.material.color.setHex(0xffa502);
        // Capsid: 0x74b9ff -> 0x2ed573
        if (hex === 0x74b9ff || hex === 0x0984e3) child.material.color.setHex(0x2ed573);
      }
    });
    return group;
  },

  // Helper to make geometries look like organic lipid membranes or irregular proteins
  makeOrganic(geo, amplitude = 0.2, frequency = 4) {
    if (!geo.attributes.position) return;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      // Pseudo-random cellular noise using sine/cosine
      const noise = Math.sin(v.x * frequency) * Math.cos(v.y * frequency) * Math.sin(v.z * frequency) * amplitude;
      v.addScaledVector(v.clone().normalize(), noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  },

  createVirus(virusId, mode = "surface") {
    switch (virusId) {
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
