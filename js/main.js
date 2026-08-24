/**
 * 3D 病毒互動探索百科 - 主程式 (Main Application Engine)
 */

class VirusApp {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.currentVirusId = "sars-cov-2";
    this.currentMode = "surface"; // "surface", "cutaway", "hologram"
    this.autoRotate = true;
    this.showHotspots = true;
    this.soundMuted = false;

    // Three.js 核心物件
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModelGroup = null;
    this.particles = null;

    // 互動與運鏡
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hotspotObjects = [];
    this.isTransitioningCamera = false;
    this.camTargetPos = new THREE.Vector3();
    this.camTargetLookAt = new THREE.Vector3(0, 0, 0);

    // 比對模組
    this.comparisonEngine = null;

    this.init();
  }

  setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text !== undefined ? text : "";
  }

  init() {
    console.log("Initializing VirusApp...");
    try {
      this.setupUI();
      this.setupEvents();
      this.setupScene();
      this.setupLights();
      this.setupBackgroundParticles();
      this.loadVirus(this.currentVirusId, this.currentMode);
      if (window.ComparisonEngine) {
        this.comparisonEngine = new window.ComparisonEngine("comparison-modal");
      }
      this.renderer.setAnimationLoop(() => this.animate());
      console.log("VirusApp initialized successfully!");
    } catch (err) {
      console.error("Error initializing VirusApp:", err);
    }
  }

  setupScene() {
    if (!this.container) {
      console.error("canvas-container not found!");
      return;
    }
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0c16);
    this.scene.fog = new THREE.FogExp2(0x0a0c16, 0.035);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 13.5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    
    // WebXR AR Setup
    this.renderer.xr.enabled = true;
    if (window.THREE && THREE.ARButton) {
      const arBtn = THREE.ARButton.createButton(this.renderer, { requiredFeatures: ['hit-test'] });
      document.body.appendChild(arBtn);
      
      this.renderer.xr.addEventListener('sessionstart', () => {
        // Fix for black screen in AR: remove background color and fog
        this._originalBg = this.scene.background;
        this.scene.background = null;
        this._originalFog = this.scene.fog;
        this.scene.fog = null;
        
        if (this.currentModelGroup) {
          this.currentModelGroup.userData.preARScale = this.currentModelGroup.scale.clone();
          this.currentModelGroup.userData.preARPos = this.currentModelGroup.position.clone();
          // Make the virus much smaller (0.5% scale) so it doesn't engulf the camera
          this.currentModelGroup.scale.set(0.02, 0.02, 0.02);
          
          // Place it exactly 1 meter straight in front of the camera
          this.currentModelGroup.position.set(0, 0, -1.0);
        }
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'none';
        if(this.particles) this.particles.visible = false;
      });

      this.renderer.xr.addEventListener('sessionend', () => {
        // Restore background and fog
        this.scene.background = this._originalBg || new THREE.Color(0x0a0c16);
        this.scene.fog = this._originalFog || new THREE.FogExp2(0x0a0c16, 0.035);
        
        if (this.currentModelGroup) {
          if (this.currentModelGroup.userData.preARScale) {
            this.currentModelGroup.scale.copy(this.currentModelGroup.userData.preARScale);
            this.currentModelGroup.position.copy(this.currentModelGroup.userData.preARPos);
          } else {
            this.currentModelGroup.scale.set(1, 1, 1);
            this.currentModelGroup.position.set(0, 0, 0);
          }
        }
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'flex';
        if(this.particles) this.particles.visible = true;
        this.resetCamera();
      });
    }
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls 自由 3D 控制 (旋轉、縮放、平移)
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 35;
      this.controls.minDistance = 2.5;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = 1.2;
    }
  }

  setupLights() {
    if (!this.scene) return;
    const ambientLight = new THREE.AmbientLight(0xdff9fb, 0.9);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(8, 12, 10);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d2d3, 0.8);
    fillLight.position.set(-10, -5, -8);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff3838, 1.2, 30);
    rimLight.position.set(0, 10, -8);
    this.scene.add(rimLight);
  }

  setupBackgroundParticles() {
    if (!this.scene) return;
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 40;

      colors[i] = 0.0;
      colors[i + 1] = 0.8 + Math.random() * 0.2;
      colors[i + 2] = 1.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  loadVirus(virusId, mode = "surface") {
    if (!this.scene) return;
    if (window.VirusAnimations) {
      window.VirusAnimations.stop(this.scene);
      const btnAnim = document.getElementById("btn-anim");
      const btnAnimStop = document.getElementById("btn-anim-stop");
      
      if (btnAnimStop) btnAnimStop.style.display = "none";
      if (["bacteriophage-t4", "mimivirus", "sars-cov-2", "pithovirus", "baculovirus", "atv"].includes(virusId)) {
        if (btnAnim) btnAnim.style.display = "inline-flex";
      } else {
        if (btnAnim) btnAnim.style.display = "none";
      }

    }

    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
    }
    this.clearHotspots();

    this.currentVirusId = virusId;
    this.currentMode = mode;

    // 建立 3D 模型
    if (window.VirusBuilder) {
      this.currentModelGroup = window.VirusBuilder.createVirus(virusId, mode);
      this.scene.add(this.currentModelGroup);
    }

    // 建立 3D 結構標籤熱點
    this.createHotspotMarkers();

    // 更新資訊面板
    this.updateInfoPanel();
  }

  clearHotspots() {
    this.hotspotObjects.forEach(h => {
      if (this.scene && h.mesh) this.scene.remove(h.mesh);
      if (h.domEl && h.domEl.parentNode) {
        h.domEl.parentNode.removeChild(h.domEl);
      }
    });
    this.hotspotObjects = [];
  }

  createHotspotMarkers() {
    const data = window.VIRUS_DATABASE ? window.VIRUS_DATABASE[this.currentVirusId] : null;
    if (!data || !data.hotspots) return;

    const overlay = document.getElementById("hotspot-overlay");
    if (!overlay) return;
    overlay.innerHTML = "";

    data.hotspots.forEach((spot) => {
      const isHiddenInSurface = spot.requiresCutaway && this.currentMode === "surface";

      const beaconGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: isHiddenInSurface ? 0.3 : 0.8
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(spot.position[0], spot.position[1], spot.position[2]);
      beaconMesh.userData = { hotspotData: spot };
      if (this.currentModelGroup) this.currentModelGroup.add(beaconMesh);

      // DOM 懸浮標籤
      const domEl = document.createElement("div");
      domEl.className = `hotspot-tag ${isHiddenInSurface ? "cutaway-only" : ""}`;
      domEl.innerHTML = `
        <span class="hotspot-pulse"></span>
        <span class="hotspot-title">${spot.name}</span>
      `;
      domEl.addEventListener("click", () => this.focusHotspot(spot));
      overlay.appendChild(domEl);

      this.hotspotObjects.push({
        mesh: beaconMesh,
        domEl: domEl,
        spot: spot,
        pos3D: beaconMesh.position
      });
    });
  }

  updateHotspotPositions() {
    const overlay = document.getElementById("hotspot-overlay");
    if (!overlay) return;

    if (!this.showHotspots) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.display = "block";

    if (!this.container || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const tempV = new THREE.Vector3();

    this.hotspotObjects.forEach(h => {
      tempV.copy(h.pos3D);
      if (this.currentModelGroup) {
        tempV.applyQuaternion(this.currentModelGroup.quaternion);
      }
      tempV.project(this.camera);

      const isBehind = tempV.z > 1;
      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-(tempV.y * 0.5) + 0.5) * height;

      if (isBehind || x < 0 || x > width || y < 0 || y > height) {
        h.domEl.style.display = "none";
      } else {
        h.domEl.style.display = "flex";
        h.domEl.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      }
    });
  }

  focusHotspot(spot) {
    if (window.soundEngine) window.soundEngine.playHotspot();

    if (spot.requiresCutaway && this.currentMode === "surface") {
      this.switchMode("cutaway");
    }

    const targetCam = spot.camPos || [0, 0, 7];
    this.camTargetPos.set(targetCam[0], targetCam[1], targetCam[2]);
    this.camTargetLookAt.set(spot.position[0] * 0.3, spot.position[1] * 0.3, spot.position[2] * 0.3);
    this.isTransitioningCamera = true;

    const cardEl = document.getElementById("hotspot-detail-card");
    const titleEl = document.getElementById("hotspot-card-title");
    const descEl = document.getElementById("hotspot-card-desc");

    if (titleEl) titleEl.textContent = spot.name;
    if (descEl) descEl.textContent = spot.desc;
    if (cardEl) cardEl.classList.remove("hidden");
  }

  switchMode(mode) {
    if (this.currentMode === mode) return;
    if (window.soundEngine) window.soundEngine.playModeSwitch();

    this.currentMode = mode;
    document.querySelectorAll(".mode-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.mode === mode);
    });

    this.loadVirus(this.currentVirusId, mode);
  }

  updateInfoPanel() {
    const data = window.VIRUS_DATABASE ? window.VIRUS_DATABASE[this.currentVirusId] : null;
    if (!data) return;

    this.setElText("virus-name-ch", data.chineseName);
    this.setElText("virus-name-en", data.name);
    this.setElText("virus-scientific", data.scientificName);
    this.setElText("virus-family", data.family);
    this.setElText("virus-category", data.category);
    this.setElText("virus-size", `約 ${data.sizeNm} nm`);
    this.setElText("virus-r0", data.r0);
    this.setElText("virus-fatality", data.fatalityRate);
    this.setElText("virus-trans", data.transmission);
    this.setElText("virus-receptor", data.receptor);
    this.setElText("virus-incubation", data.incubation);
    this.setElText("virus-symptoms", data.symptoms);
    this.setElText("virus-desc", data.description);
    this.setElText("virus-clinical", data.clinicalRelevance);

    // 特徵清單
    const featList = document.getElementById("virus-features");
    if (featList && data.keyFeatures) {
      featList.innerHTML = "";
      data.keyFeatures.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        featList.appendChild(li);
      });
    }

    // 內部結構快捷清單
    const structureList = document.getElementById("structure-nav-list");
    if (structureList && data.hotspots) {
      structureList.innerHTML = "";
      data.hotspots.forEach(spot => {
        const btn = document.createElement("button");
        btn.className = "struct-btn";
        btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> ${spot.name}`;
        btn.addEventListener("click", () => this.focusHotspot(spot));
        structureList.appendChild(btn);
      });
    }
  }

  resetCamera() {
    if (window.soundEngine) window.soundEngine.playClick();
    this.camTargetPos.set(0, 0, 13.5);
    this.camTargetLookAt.set(0, 0, 0);
    this.isTransitioningCamera = true;
  }

  setCameraPreset(preset) {
    if (window.soundEngine) window.soundEngine.playClick();
    switch (preset) {
      case "top":
        this.camTargetPos.set(0, 13.5, 0.1);
        break;
      case "side":
        this.camTargetPos.set(13.5, 0, 0);
        break;
      case "front":
        this.camTargetPos.set(0, 0, 13.5);
        break;
      case "close":
        this.camTargetPos.set(0, 2, 7.5);
        break;
    }
    this.camTargetLookAt.set(0, 0, 0);
    this.isTransitioningCamera = true;
  }

  exportScreenshot() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
      const dataUrl = this.renderer.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `virus-3d-${this.currentVirusId}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  }

  setupEvents() {
    window.addEventListener("resize", () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      if (this.comparisonEngine) this.comparisonEngine.handleResize();
    });

    document.getElementById("close-hotspot-card")?.addEventListener("click", () => {
      document.getElementById("hotspot-detail-card")?.classList.add("hidden");
    });
  }

  setupUI() {
    // 側邊欄病毒按鈕點擊
    document.querySelectorAll(".virus-card-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetBtn = e.currentTarget;
        const id = targetBtn.getAttribute("data-virus-id") || targetBtn.dataset.virusId;
        if (!id || id === this.currentVirusId) return;

        if (window.soundEngine) window.soundEngine.playSwitch();
        document.querySelectorAll(".virus-card-btn").forEach(b => b.classList.remove("active"));
        targetBtn.classList.add("active");

        this.loadVirus(id, this.currentMode);
        this.resetCamera();
      });
    });

    // 檢視模式切換 (全貌、剖面、透光)
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const mode = e.currentTarget.getAttribute("data-mode") || e.currentTarget.dataset.mode;
        if (mode) this.switchMode(mode);
      });
    });

    // 視角預設切換
    document.querySelectorAll("[data-cam]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const cam = e.currentTarget.getAttribute("data-cam") || e.currentTarget.dataset.cam;
        if (cam) this.setCameraPreset(cam);
      });
    });

    // 控制條功能按鈕
    document.getElementById("btn-reset-cam")?.addEventListener("click", () => this.resetCamera());

    document.getElementById("btn-toggle-rotate")?.addEventListener("click", e => {
      this.autoRotate = !this.autoRotate;
      if (this.controls) this.controls.autoRotate = this.autoRotate;
      e.currentTarget.classList.toggle("active", this.autoRotate);
      if (window.soundEngine) window.soundEngine.playClick();
    });

    document.getElementById("btn-toggle-labels")?.addEventListener("click", e => {
      this.showHotspots = !this.showHotspots;
      e.currentTarget.classList.toggle("active", this.showHotspots);
      if (window.soundEngine) window.soundEngine.playClick();
    });

    document.getElementById("btn-screenshot")?.addEventListener("click", () => this.exportScreenshot());

    document.getElementById("btn-toggle-sound")?.addEventListener("click", e => {
      this.soundMuted = !this.soundMuted;
      if (window.soundEngine) window.soundEngine.setMuted(this.soundMuted);
      e.currentTarget.classList.toggle("muted", this.soundMuted);
      e.currentTarget.innerHTML = this.soundMuted 
        ? `<i class="fa-solid fa-volume-xmark"></i> 靜音` 
        : `<i class="fa-solid fa-volume-high"></i> 音效`;
    });

    // 動畫控制按鈕
    const btnAnim = document.getElementById("btn-anim");
    const btnAnimStop = document.getElementById("btn-anim-stop");

    if (btnAnim) {
      btnAnim.addEventListener("click", () => {
        if (!["bacteriophage-t4", "mimivirus", "sars-cov-2", "pithovirus", "baculovirus", "atv"].includes(this.currentVirusId)) {
          alert("此病毒尚無專屬動畫！");
          return;
        }
        if (window.soundEngine) window.soundEngine.playClick();
        if (window.VirusAnimations && this.currentModelGroup) {
          if(this.currentVirusId === "bacteriophage-t4") window.VirusAnimations.playT4(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "mimivirus") window.VirusAnimations.playMimi(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "sars-cov-2") window.VirusAnimations.playSARS(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "pithovirus") window.VirusAnimations.playPitho(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "baculovirus") window.VirusAnimations.playBaculo(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "atv") window.VirusAnimations.playATV(this.scene, this.currentModelGroup);
          btnAnim.style.display = "none";
          btnAnimStop.style.display = "inline-flex";
          
          // Move camera to a good view tailored to each animation
          let targetZ = 16, targetY = 0;
          if (this.currentVirusId === "mimivirus") { targetZ = 16; targetY = 2; }
          else if (this.currentVirusId === "pithovirus") { targetZ = 18; targetY = 4; }
          else if (this.currentVirusId === "sars-cov-2") { targetZ = 18; targetY = 2; }
          else if (this.currentVirusId === "baculovirus") { targetZ = 15; targetY = -1; }
          else if (this.currentVirusId === "bacteriophage-t4") { targetZ = 14; targetY = 1.5; }
          
          this.camTargetPos.set(0, targetY, targetZ);
          this.camTargetLookAt.set(0, targetY, 0);
          if (this.controls) this.controls.target.set(0, targetY, 0);
          
          this.isTransitioningCamera = true;
        }
      });
    }

    if (btnAnimStop) {
      btnAnimStop.addEventListener("click", () => {
        if (window.soundEngine) window.soundEngine.playClick();
        if (window.VirusAnimations) {
          window.VirusAnimations.stop(this.scene);
        }
        btnAnimStop.style.display = "none";
        if(["bacteriophage-t4", "mimivirus", "sars-cov-2", "pithovirus", "baculovirus", "atv"].includes(this.currentVirusId)) btnAnim.style.display = "inline-flex";
        this.loadVirus(this.currentVirusId, this.currentMode); // Reload to reset parts
      });
    }

    // 雙病毒比對按鈕
    document.getElementById("btn-compare")?.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playClick();
      if (this.comparisonEngine) {
        this.comparisonEngine.open(this.currentVirusId, "mpox");
      }
    });

    document.getElementById("close-comparison")?.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playClick();
      if (this.comparisonEngine) {
        this.comparisonEngine.close();
      }
    });

    document.getElementById("select-comp-a")?.addEventListener("change", e => {
      if (this.comparisonEngine) this.comparisonEngine.setVirusA(e.target.value);
    });

    document.getElementById("select-comp-b")?.addEventListener("change", e => {
      if (this.comparisonEngine) this.comparisonEngine.setVirusB(e.target.value);
    });
  }

  animate() {

    if (this.isTransitioningCamera && this.camera && this.controls) {
      this.controls.autoRotate = false;
      this.camera.position.lerp(this.camTargetPos, 0.08);
      this.controls.target.lerp(this.camTargetLookAt, 0.08);

      if (this.camera.position.distanceTo(this.camTargetPos) < 0.1) {
        this.isTransitioningCamera = false;
        this.controls.autoRotate = this.autoRotate;
      }
    } else if (this.controls && !this.isTransitioningCamera) {
      this.controls.autoRotate = this.autoRotate;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.0006;
      this.particles.rotation.x += 0.0003;
    }

    if (this.currentModelGroup) {
      const time = performance.now() * 0.0015;
      const baseScale = this.renderer.xr.isPresenting ? 0.02 : 1.0;
      const scaleDelta = baseScale + Math.sin(time) * (0.015 * baseScale);
      this.currentModelGroup.scale.set(scaleDelta, scaleDelta, scaleDelta);
    }

    if (this.controls) this.controls.update();
    this.updateHotspotPositions();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// 可靠自動啟動機制 (支援已完成加載與未完成加載兩種狀態)
function launchApp() {
  if (!window.app) {
    window.app = new VirusApp();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", launchApp);
} else {
  launchApp();
}
