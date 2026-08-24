const fs = require('fs');
const path = require('path');

const mainPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'main.js');
let code = fs.readFileSync(mainPath, 'utf8');

// 1. Change `this.animate();` in `init()` to `this.renderer.setAnimationLoop(() => this.animate());`
code = code.replace(/this\.animate\(\);\n      console\.log\("VirusApp initialized successfully!"\);/, 
`this.renderer.setAnimationLoop(() => this.animate());
      console.log("VirusApp initialized successfully!");`);

// 2. Remove `requestAnimationFrame(() => this.animate());` from `animate()`
code = code.replace(/animate\(\) \{\n    requestAnimationFrame\(\(\) => this\.animate\(\)\);/, `animate() {`);

// 3. Setup ARButton in `setupScene`
const arSetupCode = `
    this.renderer.xr.enabled = true;
    if (THREE.ARButton) {
      const arBtn = THREE.ARButton.createButton(this.renderer, { requiredFeatures: ['hit-test'] });
      arBtn.style.bottom = '120px';
      arBtn.style.background = 'var(--accent-cyan)';
      arBtn.style.color = '#000';
      arBtn.style.fontWeight = 'bold';
      document.body.appendChild(arBtn);
      
      this.renderer.xr.addEventListener('sessionstart', () => {
        if (this.currentModelGroup) {
          // Store original transform
          this.currentModelGroup.userData.preARScale = this.currentModelGroup.scale.clone();
          this.currentModelGroup.userData.preARPos = this.currentModelGroup.position.clone();
          
          // Shrink virus for AR (radius 3.5m is too big, shrink to 20cm = 0.05 scale)
          this.currentModelGroup.scale.set(0.02, 0.02, 0.02);
          
          // Position it 1 meter in front of the camera
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
    }`;

code = code.replace(/this\.renderer\.setSize\(window\.innerWidth, window\.innerHeight\);\n    this\.container\.appendChild\(this\.renderer\.domElement\);/, 
`this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
${arSetupCode}`);

fs.writeFileSync(mainPath, code, 'utf8');
console.log("main.js updated with WebXR support.");
