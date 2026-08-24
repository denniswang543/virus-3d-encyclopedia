import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Replace sessionstart and sessionend logic
sessionstart_old = """      this.renderer.xr.addEventListener('sessionstart', () => {
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
      });"""

sessionstart_new = """      this.renderer.xr.addEventListener('sessionstart', () => {
        // Fix for black screen in AR: remove background color and fog
        this._originalBg = this.scene.background;
        this.scene.background = null;
        this._originalFog = this.scene.fog;
        this.scene.fog = null;
        
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
      });"""

sessionend_old = """      this.renderer.xr.addEventListener('sessionend', () => {
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
      });"""

sessionend_new = """      this.renderer.xr.addEventListener('sessionend', () => {
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
      });"""

code = code.replace(sessionstart_old, sessionstart_new)
code = code.replace(sessionend_old, sessionend_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("AR background fix applied.")
