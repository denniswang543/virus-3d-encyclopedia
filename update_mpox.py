import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

new_mpox = """  buildMpox(mode = "surface") {
    const group = new THREE.Group();
    group.name = "mpox";
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // 橢圓形/圓角磚形外膜 (Rounded Oval/Brick)
    const envRadius = 2.4;
    // 使用高解析度球體來做形變
    const envGeo = isCutaway ? new THREE.SphereGeometry(envRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55) : new THREE.SphereGeometry(envRadius, 64, 64);
    
    // 將球體拉長為經典的 Mpox 橢圓磚塊形
    envGeo.scale(1.5, 1.0, 1.0);

    if (!isHologram && !isCutaway) {
      // 產生類似「大腦皺褶」的超精細凹凸紋理 (Brain-like convoluted ridges)
      if (envGeo.attributes.position) {
        const pos = envGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3().fromBufferAttribute(pos, i);
          const dist = v.length();
          if (dist === 0) continue;
          
          // 複合高頻率 noise 製造細密皺褶
          const noise1 = Math.sin(v.x * 5) * Math.cos(v.y * 5) * Math.sin(v.z * 5);
          const noise2 = Math.sin(v.x * 12 + v.y * 8) * Math.cos(v.z * 10);
          const totalNoise = (noise1 * 0.15) + (noise2 * 0.08);
          
          v.normalize().multiplyScalar(dist + totalNoise);
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        pos.needsUpdate = true;
        envGeo.computeVertexNormals();
      }
    }

    const envMat = isHologram
      ? new THREE.MeshBasicMaterial({ color: 0xd980fa, wireframe: true, transparent: true, opacity: 0.4 })
      : new THREE.MeshStandardMaterial({ color: 0x6F1E51, roughness: 0.8, metalness: 0.1, side: THREE.DoubleSide });
      
    group.add(new THREE.Mesh(envGeo, envMat));

    // 內部結構 (Core & Lateral Bodies)
    if (isCutaway) {
      // 啞鈴形核心 (Dumbbell Core)
      const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 32);
      coreGeo.rotateZ(Math.PI / 2);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x833471, roughness: 0.6 });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      // 兩側側體 (Lateral Bodies)
      const lateralGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const lateralMat = new THREE.MeshStandardMaterial({ color: 0xFDA7DF, roughness: 0.5 });
      const lb1 = new THREE.Mesh(lateralGeo, lateralMat);
      lb1.scale.set(1.5, 1, 0.5);
      lb1.position.set(0, 1.2, 0);
      const lb2 = lb1.clone();
      lb2.position.set(0, -1.2, 0);
      group.add(lb1);
      group.add(lb2);
    }

    // 表面密集細小刺突 (Fine surface tubules/spikes)
    if (!isHologram) {
      const spikeGroup = new THREE.Group();
      // 短柱體
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.04, 0.3, 5),
        new THREE.MeshStandardMaterial({ color: 0xFDA7DF })
      );
      stalk.position.y = 0.15;
      // 微小白亮突起頭部
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffcccc })
      );
      head.position.y = 0.32;
      spikeGroup.add(stalk);
      spikeGroup.add(head);

      const spikeCount = 600;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y * y);
        const theta = phi * i;
        
        // 算出在球體上的分佈點，再做一樣的變形拉長
        const norm = new THREE.Vector3(Math.cos(theta) * tempR, y, Math.sin(theta) * tempR);
        const pos = norm.clone();
        pos.x *= 1.5; // 對應 envGeo.scale(1.5, 1.0, 1.0)
        
        // 加入相同 noise 的偏移量，讓刺突能貼齊皺褶表面
        const noise1 = Math.sin(pos.x * 5) * Math.cos(pos.y * 5) * Math.sin(pos.z * 5);
        const noise2 = Math.sin(pos.x * 12 + pos.y * 8) * Math.cos(pos.z * 10);
        const totalNoise = (noise1 * 0.15) + (noise2 * 0.08);
        
        // 取法向量 (稍微近似)
        const spike = spikeGroup.clone();
        const baseRadius = 2.4;
        spike.position.copy(pos).normalize().multiplyScalar(baseRadius * pos.length() / 2.4 + totalNoise);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        group.add(spike);
      }
    }

    return group;
  },"""

js = re.sub(r'  buildMpox\(mode = "surface"\) \{.*?(?=\n  buildInfluenzaA)', new_mpox, js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated Mpox")
