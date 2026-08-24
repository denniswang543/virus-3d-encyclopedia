import os

path = r"d:\__AI\SLF\virus-3d\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace('this.animate();\n      console.log("VirusApp initialized successfully!");', 'this.renderer.setAnimationLoop(() => this.animate());\n      console.log("VirusApp initialized successfully!");')
code = code.replace('requestAnimationFrame(() => this.animate());', '')

inject = """
    this.renderer.xr.enabled = true;
    if (THREE.ARButton) {
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
        document.querySelector('.app-container').style.display = 'none';
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
        document.querySelector('.app-container').style.display = 'flex';
        if(this.particles) this.particles.visible = true;
        this.resetCamera();
      });
    }
    this.resetCamera();
"""
code = code.replace('this.resetCamera();', inject, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Done")
