/**
 * 雙病毒 3D 尺寸與醫學特性並排比對引擎 (Virus Comparison Engine)
 */

class ComparisonEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.virusAId = "sars-cov-2";
    this.virusBId = "mpox";
    this.active = false;
    this.sceneA = null;
    this.sceneB = null;
    this.cameraA = null;
    this.cameraB = null;
    this.rendererA = null;
    this.rendererB = null;
    this.modelA = null;
    this.modelB = null;
    this.controlsA = null;
    this.controlsB = null;
    this.animId = null;
  }

  setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
  }

  open(vA = "sars-cov-2", vB = "mpox") {
    this.virusAId = vA;
    this.virusBId = vB;
    this.active = true;
    if (this.container) this.container.classList.remove("hidden");

    // 同步下拉選單預設值
    const selectA = document.getElementById("select-comp-a");
    const selectB = document.getElementById("select-comp-b");
    if (selectA) selectA.value = this.virusAId;
    if (selectB) selectB.value = this.virusBId;

    this.initViews();
    this.updateUI();
    this.animate();
  }

  close() {
    this.active = false;
    if (this.container) this.container.classList.add("hidden");
    if (this.animId) cancelAnimationFrame(this.animId);
    this.dispose();
  }

  initViews() {
    const viewAEl = document.getElementById("comp-canvas-a");
    const viewBEl = document.getElementById("comp-canvas-b");

    if (!viewAEl || !viewBEl) return;

    // View A Setup
    const wA = viewAEl.clientWidth || 300;
    const hA = viewAEl.clientHeight || 300;

    this.sceneA = new THREE.Scene();
    this.cameraA = new THREE.PerspectiveCamera(45, wA / hA, 0.1, 1000);
    this.cameraA.position.set(0, 0, 13.5);

    this.rendererA = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.rendererA.setSize(wA, hA);
    this.rendererA.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewAEl.innerHTML = "";
    viewAEl.appendChild(this.rendererA.domElement);

    if (THREE.OrbitControls) {
      this.controlsA = new THREE.OrbitControls(this.cameraA, this.rendererA.domElement);
      this.controlsA.enableDamping = true;
      this.controlsA.dampingFactor = 0.05;
    }

    // View B Setup
    const wB = viewBEl.clientWidth || 300;
    const hB = viewBEl.clientHeight || 300;

    this.sceneB = new THREE.Scene();
    this.cameraB = new THREE.PerspectiveCamera(45, wB / hB, 0.1, 1000);
    this.cameraB.position.set(0, 0, 13.5);

    this.rendererB = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.rendererB.setSize(wB, hB);
    this.rendererB.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewBEl.innerHTML = "";
    viewBEl.appendChild(this.rendererB.domElement);

    if (THREE.OrbitControls) {
      this.controlsB = new THREE.OrbitControls(this.cameraB, this.rendererB.domElement);
      this.controlsB.enableDamping = true;
      this.controlsB.dampingFactor = 0.05;
    }

    // Lights
    [this.sceneA, this.sceneB].forEach(scene => {
      if (!scene) return;
      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      const blueRim = new THREE.DirectionalLight(0x00f2fe, 0.9);
      blueRim.position.set(-5, -5, -5);
      scene.add(blueRim);
    });

    this.loadModels();
  }

  loadModels() {
    if (this.modelA && this.sceneA) this.sceneA.remove(this.modelA);
    if (this.modelB && this.sceneB) this.sceneB.remove(this.modelB);

    const dataA = window.VIRUS_DATABASE[this.virusAId];
    const dataB = window.VIRUS_DATABASE[this.virusBId];
    if (!dataA || !dataB) return;

    this.modelA = window.VirusBuilder.createVirus(this.virusAId, "surface");
    this.modelB = window.VirusBuilder.createVirus(this.virusBId, "surface");

        // Auto-scale based on bounding box so they always fit perfectly
    const boxA = new THREE.Box3().setFromObject(this.modelA);
    const sizeA = new THREE.Vector3();
    boxA.getSize(sizeA);
    const scaleA = 7.0 / Math.max(sizeA.x, sizeA.y, sizeA.z);
    this.modelA.scale.set(scaleA, scaleA, scaleA);

    const boxB = new THREE.Box3().setFromObject(this.modelB);
    const sizeB = new THREE.Vector3();
    boxB.getSize(sizeB);
    const scaleB = 7.0 / Math.max(sizeB.x, sizeB.y, sizeB.z);
    this.modelB.scale.set(scaleB, scaleB, scaleB);

    if (this.sceneA) this.sceneA.add(this.modelA);
    if (this.sceneB) this.sceneB.add(this.modelB);
  }

  setVirusA(id) {
    this.virusAId = id;
    this.loadModels();
    this.updateUI();
  }

  setVirusB(id) {
    this.virusBId = id;
    this.loadModels();
    this.updateUI();
  }

  updateUI() {
    const dataA = window.VIRUS_DATABASE[this.virusAId];
    const dataB = window.VIRUS_DATABASE[this.virusBId];
    if (!dataA || !dataB) return;

    const fillData = (prefix, data) => {
      this.setElText(`${prefix}-title`, `${data.chineseName} (${data.name})`);
      this.setElText(`${prefix}-size`, `約 ${data.sizeNm} nm`);
      this.setElText(`${prefix}-category`, data.category);
      this.setElText(`${prefix}-receptor`, data.receptor);
      this.setElText(`${prefix}-r0`, data.r0);
      this.setElText(`${prefix}-fatality`, data.fatalityRate);
      this.setElText(`${prefix}-trans`, data.transmission);
      this.setElText(`${prefix}-symptoms`, data.symptoms);
    };

    fillData("comp-a", dataA);
    fillData("comp-b", dataB);
  }

  animate() {
    if (!this.active) return;
    this.animId = requestAnimationFrame(() => this.animate());

    if (this.modelA) this.modelA.rotation.y += 0.008;
    if (this.modelB) this.modelB.rotation.y += 0.008;

    if (this.controlsA) this.controlsA.update();
    if (this.controlsB) this.controlsB.update();

    if (this.rendererA && this.sceneA && this.cameraA) this.rendererA.render(this.sceneA, this.cameraA);
    if (this.rendererB && this.sceneB && this.cameraB) this.rendererB.render(this.sceneB, this.cameraB);
  }

  handleResize() {
    if (!this.active) return;
    const viewAEl = document.getElementById("comp-canvas-a");
    const viewBEl = document.getElementById("comp-canvas-b");
    if (!viewAEl || !viewBEl) return;

    const wA = viewAEl.clientWidth;
    const hA = viewAEl.clientHeight;
    if (this.cameraA && this.rendererA && wA && hA) {
      this.cameraA.aspect = wA / hA;
      this.cameraA.updateProjectionMatrix();
      this.rendererA.setSize(wA, hA);
    }

    const wB = viewBEl.clientWidth;
    const hB = viewBEl.clientHeight;
    if (this.cameraB && this.rendererB && wB && hB) {
      this.cameraB.aspect = wB / hB;
      this.cameraB.updateProjectionMatrix();
      this.rendererB.setSize(wB, hB);
    }
  }

  dispose() {
    if (this.rendererA) this.rendererA.dispose();
    if (this.rendererB) this.rendererB.dispose();
  }
}

if (typeof window !== "undefined") {
  window.ComparisonEngine = ComparisonEngine;
}
