import re
import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Fix corrupted setupUI
corrupted_regex = r"this\.loadVirus\(id, this\.currentMode\);[\s\S]*?this\.switchMode\(mode\);"
fixed_setupUI = """this.loadVirus(id, this.currentMode);
        this.resetCamera();
      });
    });

    // 檢視模式切換 (全貌、剖面、透光)
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const mode = e.currentTarget.getAttribute("data-mode") || e.currentTarget.dataset.mode;
        if (mode) this.switchMode(mode);"""
code = re.sub(corrupted_regex, fixed_setupUI, code)

# Fix init()
corrupted_init = r"init\(\) \{[\s\S]*?setupScene\(\) \{"
fixed_init = """init() {
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

  setupScene() {"""
code = re.sub(corrupted_init, fixed_init, code)

# Inject AR code
setup_scene_end = r"this\.renderer\.toneMappingExposure = 1\.1;"
ar_setup_code = """this.renderer.toneMappingExposure = 1.1;
    
    // WebXR AR Setup
    this.renderer.xr.enabled = true;
    if (window.THREE && THREE.ARButton) {
      const arBtn = THREE.ARButton.createButton(this.renderer, { requiredFeatures: ['hit-test'] });
      document.body.appendChild(arBtn);
      
      this.renderer.xr.addEventListener('sessionstart', () => {
        if (this.currentModelGroup) {
          this.currentModelGroup.userData.preARScale = this.currentModelGroup.scale.clone();
          this.currentModelGroup.userData.preARPos = this.currentModelGroup.position.clone();
          this.currentModelGroup.scale.set(0.02, 0.02, 0.02);
          
          const cameraDir = new THREE.Vector3();
          this.camera.getWorldDirection(cameraDir);
          const spawnPos = this.camera.position.clone().add(cameraDir.multiplyScalar(0.8));
          this.currentModelGroup.position.copy(spawnPos);
        }
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'none';
        if(this.particles) this.particles.visible = false;
      });

      this.renderer.xr.addEventListener('sessionend', () => {
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
    }"""
code = re.sub(setup_scene_end, ar_setup_code, code)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Done")
