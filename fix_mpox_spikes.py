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
      // 短柱體 (加粗拉長一點讓它更明顯)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.05, 0.35, 5),
        new THREE.MeshStandardMaterial({ color: 0xFDA7DF, roughness: 0.6 })
      );
      stalk.position.y = 0.175;
      // 微小白亮突起頭部
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffcccc, roughness: 0.3 })
      );
      head.position.y = 0.38;
      spikeGroup.add(stalk);
      spikeGroup.add(head);

      const spikeCount = 600;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < spikeCount; i++) {
        const y = 1 - (i / (spikeCount - 1)) * 2;
        if (isCutaway && y < -0.1) continue;
        const tempR = Math.sqrt(1 - y * y);
        const theta = phi * i;
        
        // 先投影在單位球上，乘以 2.4 半徑，再套用 X 軸的 1.5 倍拉長
        const norm = new THREE.Vector3(Math.cos(theta) * tempR, y, Math.sin(theta) * tempR);
        const pos = norm.clone().multiplyScalar(envRadius);
        pos.x *= 1.5; 
        
        // 這時的 pos 才會對應到未變形的 envGeo 表面座標
        const noise1 = Math.sin(pos.x * 5) * Math.cos(pos.y * 5) * Math.sin(pos.z * 5);
        const noise2 = Math.sin(pos.x * 12 + pos.y * 8) * Math.cos(pos.z * 10);
        const totalNoise = (noise1 * 0.15) + (noise2 * 0.08);
        
        // 算出該點的法向量
        const spikeNormal = pos.clone().normalize();
        
        // 把刺突推到加上噪音起伏後的最外層，並預留一點厚度 (0.05) 避免穿模
        pos.add(spikeNormal.multiplyScalar(totalNoise - 0.05));
        
        const spike = spikeGroup.clone();
        spike.position.copy(pos);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spikeNormal);
        group.add(spike);
      }
    }

    return group;
  },"""

js = re.sub(r'\s*buildMpox\(mode = "surface"\) \{.*?(?=\s*buildInfluenzaA)', "\n" + new_mpox + "\n", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Fixed Mpox spikes")
