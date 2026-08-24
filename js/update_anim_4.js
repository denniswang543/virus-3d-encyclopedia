const fs = require('fs');
const path = require('path');

const animPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusAnimations.js');
let code = fs.readFileSync(animPath, 'utf8');

const newAnimations = `
  // 新冠病毒 (SARS-CoV-2) 動畫
  playSARS(scene, sarsGroup) {
    this.stop(scene);
    
    // 建立細胞膜與 ACE2 受體
    if (!this.membraneMesh) {
      const memGeo = new THREE.PlaneGeometry(30, 30, 32, 32);
      const memMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.8, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      this.membraneMesh = new THREE.Mesh(memGeo, memMat);
      this.membraneMesh.rotation.x = -Math.PI / 2;
      this.membraneMesh.position.y = -5.0;
      
      // 加入 ACE2 受體
      const aceGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
      const aceMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
      for(let i=0; i<3; i++) {
        const ace = new THREE.Mesh(aceGeo, aceMat);
        ace.position.set(0, 0.75, 0);
        this.membraneMesh.add(ace); // Add to membrane, wait, membrane is rotated! So y becomes z!
      }
    }
    // Reposition ACE2 properly relative to membrane
    const aceMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
    while(this.membraneMesh.children.length > 0) this.membraneMesh.remove(this.membraneMesh.children[0]);
    
    // ACE2 1
    const ace1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8), aceMat);
    ace1.rotation.x = Math.PI/2;
    ace1.position.set(0, 0, 0.75); // z is 'up' relative to plane
    this.membraneMesh.add(ace1);

    scene.add(this.membraneMesh);
    
    const env = sarsGroup.getObjectByName("sars_envelope");
    const core = sarsGroup.getObjectByName("sars_coreGroup");
    
    // Reset positions
    sarsGroup.position.set(0, 8, 0);
    sarsGroup.scale.set(1, 1, 1);
    
    if (env) {
      env.material.transparent = true;
      env.material.opacity = 1.0;
    }
    if (core) {
      core.visible = true;
      if (core.userData.origY === undefined) core.userData.origY = core.position.y;
      core.position.y = core.userData.origY;
    }
    
    // reset membrane geometry flat
    const pos = this.membraneMesh.geometry.attributes.position;
    for(let i=0; i<pos.count; i++) pos.setZ(i, 0);
    this.membraneMesh.geometry.computeVertexNormals();
    this.membraneMesh.geometry.attributes.position.needsUpdate = true;

    this.startTime = Date.now();
    this.activeAnimation = requestAnimationFrame(() => this.animateSARS(sarsGroup, env, core, this.membraneMesh));
  },

  animateSARS(sarsGroup, env, core, membrane) {
    if (!this.activeAnimation) return;
    const elapsed = (Date.now() - this.startTime) / 1000;

    if (elapsed < 3.0) {
      this.showText("階段一：SARS-CoV-2 降落，棘突蛋白尋找 ACE2 受體");
      const progress = elapsed / 3.0;
      sarsGroup.position.y = 8 - 11.5 * Math.pow(progress, 2); // lands at y=-3.5
    } 
    else if (elapsed >= 3.0 && elapsed < 6.0) {
      this.showText("階段二：受體結合引發細胞膜內陷吞噬 (Endocytosis)");
      const progress = (elapsed - 3.0) / 3.0;
      
      // Membrane sinks
      const pos = membrane.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x*x + y*y);
        if (dist < 8) {
          const depth = Math.cos(dist * Math.PI / 16) * 4 * progress;
          pos.setZ(i, -depth); // Z is 'up' in plane local space, so -Z is down
        }
      }
      membrane.geometry.computeVertexNormals();
      membrane.geometry.attributes.position.needsUpdate = true;
      
      // Virus sinks into the pit
      sarsGroup.position.y = -3.5 - 4 * progress;
    }
    else if (elapsed >= 6.0 && elapsed < 9.0) {
      this.showText("階段三：膜融合與病毒核衣殼釋放");
      const progress = (elapsed - 6.0) / 3.0;
      if (env) env.material.opacity = 1 - progress;
      if (core) core.position.y = core.userData.origY + 2 * progress;
      // Close membrane pit
      const pos = membrane.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x*x + y*y);
        if (dist < 8) {
          const depth = Math.cos(dist * Math.PI / 16) * 4 * (1-progress);
          pos.setZ(i, Math.max(0, -depth));
        }
      }
      membrane.geometry.computeVertexNormals();
      membrane.geometry.attributes.position.needsUpdate = true;
    }
    else if (elapsed >= 9.0 && elapsed < 12.0) {
      this.showText("感染完成！RNA 準備開始挾持細胞機工進行複製。");
    }
    else {
      this.startTime = Date.now();
    }
    this.activeAnimation = requestAnimationFrame(() => this.animateSARS(sarsGroup, env, core, membrane));
  },

  // 闊口罐病毒 (Pithovirus)
  playPitho(scene, group) {
    this.stop(scene);
    
    const cork = group.getObjectByName("pitho_cork");
    const dna = group.getObjectByName("pitho_dna");
    
    if (cork && cork.userData.origY === undefined) {
      cork.userData.origY = cork.position.y;
    }
    
    group.position.set(0, -1, 0);
    group.rotation.set(0, 0, 0);
    
    if (cork) {
      cork.position.set(0, cork.userData.origY, 0);
      cork.rotation.set(0, 0, 0);
    }
    if (dna) {
      dna.visible = true;
      dna.position.set(0, 0, 0);
      dna.scale.set(0.1, 0.1, 0.1);
      dna.material.opacity = 1;
      dna.material.transparent = true;
    }
    
    this.startTime = Date.now();
    this.activeAnimation = requestAnimationFrame(() => this.animatePitho(group, cork, dna));
  },
  
  animatePitho(group, cork, dna) {
    if (!this.activeAnimation) return;
    const elapsed = (Date.now() - this.startTime) / 1000;
    
    if (elapsed < 2.0) {
      this.showText("階段一：闊口罐病毒接近宿主膜，準備開啟");
    }
    else if (elapsed >= 2.0 && elapsed < 5.0) {
      this.showText("階段二：頂部塞子如開香檳般彈開！");
      const progress = (elapsed - 2.0) / 3.0;
      if (cork) {
        cork.position.y = cork.userData.origY + progress * 6;
        cork.position.x = progress * 4;
        cork.rotation.z = -progress * Math.PI;
      }
    }
    else if (elapsed >= 5.0 && elapsed < 8.0) {
      this.showText("階段三：內部龐大的遺傳物質火山爆發式湧出");
      const progress = (elapsed - 5.0) / 3.0;
      if (dna) {
        dna.position.y = progress * 8;
        dna.scale.set(0.1 + progress*1.5, 0.1 + progress*3, 0.1 + progress*1.5);
      }
    }
    else if (elapsed >= 8.0 && elapsed < 11.0) {
      this.showText("感染完成！史前巨型病毒釋放完畢。");
      if (dna) dna.material.opacity = 1 - (elapsed - 8.0)/3.0;
    }
    else {
      this.startTime = Date.now();
    }
    this.activeAnimation = requestAnimationFrame(() => this.animatePitho(group, cork, dna));
  },

  // 桿狀病毒 (Baculovirus)
  playBaculo(scene, group) {
    this.stop(scene);
    const env = group.getObjectByName("baculo_envelope");
    const core = group.getObjectByName("baculo_core");
    
    group.position.set(0, 4, 0);
    group.rotation.set(0, 0, 0); // Vertical
    
    if (env) {
      env.material.transparent = true;
      env.material.opacity = 0.5;
    }
    if (core) {
      core.position.set(0, 0, 0);
    }
    
    // Membrane
    if (!this.membraneMesh) {
      const memGeo = new THREE.PlaneGeometry(20, 20);
      const memMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.8 });
      this.membraneMesh = new THREE.Mesh(memGeo, memMat);
      this.membraneMesh.rotation.x = -Math.PI / 2;
    }
    this.membraneMesh.position.y = -3.0;
    scene.add(this.membraneMesh);
    
    this.startTime = Date.now();
    this.activeAnimation = requestAnimationFrame(() => this.animateBaculo(group, env, core));
  },
  
  animateBaculo(group, env, core) {
    if (!this.activeAnimation) return;
    const elapsed = (Date.now() - this.startTime) / 1000;
    
    if (elapsed < 2.0) {
      this.showText("階段一：膠囊狀病毒附著於細胞膜");
      const progress = elapsed / 2.0;
      group.position.y = 4 - progress * 5; // lands at -1
    }
    else if (elapsed >= 2.0 && elapsed < 4.0) {
      this.showText("階段二：脂質外膜開始溶解");
      const progress = (elapsed - 2.0) / 2.0;
      if (env) env.material.opacity = 0.5 * (1 - progress);
    }
    else if (elapsed >= 4.0 && elapsed < 6.0) {
      this.showText("階段三：桿狀核衣殼如魚雷般發射貫穿細胞膜！");
      const progress = (elapsed - 4.0) / 2.0;
      if (core) {
        core.position.y = -progress * 6; // shoots down relative to group
      }
    }
    else if (elapsed >= 6.0 && elapsed < 9.0) {
      this.showText("感染完成！核心直達深處。");
    }
    else {
      this.startTime = Date.now();
    }
    this.activeAnimation = requestAnimationFrame(() => this.animateBaculo(group, env, core));
  },

  // 雙尾紡錘病毒 (ATV)
  playATV(scene, group) {
    this.stop(scene);
    const tail1 = group.getObjectByName("atv_tail1");
    const tail2 = group.getObjectByName("atv_tail2");
    
    group.position.set(0, 0, 0);
    
    if (tail1) {
      tail1.scale.y = 0.01;
      tail1.visible = true;
    }
    if (tail2) {
      tail2.scale.y = 0.01;
      tail2.visible = true;
    }
    
    this.startTime = Date.now();
    this.activeAnimation = requestAnimationFrame(() => this.animateATV(group, tail1, tail2));
  },

  animateATV(group, tail1, tail2) {
    if (!this.activeAnimation) return;
    const elapsed = (Date.now() - this.startTime) / 1000;
    
    if (elapsed < 2.0) {
      this.showText("階段一：ATV 離開宿主，進入極端高溫強酸環境");
      if (tail1) tail1.scale.y = 0.01;
      if (tail2) tail2.scale.y = 0.01;
    }
    else if (elapsed >= 2.0 && elapsed < 8.0) {
      this.showText("階段二：宛如異形般，極長尾部從兩端開始發育生長！");
      const progress = (elapsed - 2.0) / 6.0;
      if (tail1) tail1.scale.y = progress; // grows to 1
      if (tail2) tail2.scale.y = progress;
      group.rotation.y = elapsed * 0.5; // spin slowly
    }
    else if (elapsed >= 8.0 && elapsed < 11.0) {
      this.showText("生長完成！這是罕見的細胞外發育機制。");
      group.rotation.y = elapsed * 0.5;
    }
    else {
      this.startTime = Date.now();
    }
    this.activeAnimation = requestAnimationFrame(() => this.animateATV(group, tail1, tail2));
  },
`;

code = code.replace(/  stop\(scene\)/, newAnimations + '\n  stop(scene)');
fs.writeFileSync(animPath, code, 'utf8');
console.log("virusAnimations.js updated for 4 new animations.");
