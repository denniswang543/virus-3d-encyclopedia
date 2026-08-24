const fs = require('fs');
const path = require('path');

const mainPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'main.js');
let code = fs.readFileSync(mainPath, 'utf8');

if (!code.includes('THREE.ARButton.createButton')) {
  // 1. Change animate call
  code = code.replace(/this\.animate\(\);\s+console\.log\("VirusApp initialized successfully!"\);/, 
  \`this.renderer.setAnimationLoop(() => this.animate());
        console.log("VirusApp initialized successfully!");\`);

  // 2. Remove requestAnimationFrame from animate()
  code = code.replace(/requestAnimationFrame\(\(\) => this\.animate\(\)\);/g, \`\`);

  // 3. Inject AR Button at the end of setupScene()
  const setupSceneEnd = code.indexOf('this.resetCamera();');
  if (setupSceneEnd !== -1) {
    const arSetupCode = \`
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
    \`;
    
    code = code.substring(0, setupSceneEnd) + arSetupCode + '\\n    ' + code.substring(setupSceneEnd);
  }

  fs.writeFileSync(mainPath, code, 'utf8');
  console.log("WebXR injected perfectly.");
} else {
  console.log("Already injected.");
}
