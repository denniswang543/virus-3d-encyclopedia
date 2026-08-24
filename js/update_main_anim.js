const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'main.js');
let code = fs.readFileSync(filePath, 'utf8');

// Inside bindEvents
const eventBindings = `
    const btnAnim = document.getElementById("btn-anim");
    const btnAnimStop = document.getElementById("btn-anim-stop");

    if (btnAnim) {
      btnAnim.addEventListener("click", () => {
        if (this.currentVirusId !== "bacteriophage-t4") {
          alert("目前僅完成『T4 噬菌體 (Bacteriophage T4)』的感染動畫展示，請先切換至該病毒！");
          return;
        }
        if (window.soundEngine) window.soundEngine.playClick();
        if (window.VirusAnimations && this.currentModelGroup) {
          window.VirusAnimations.playT4(this.scene, this.currentModelGroup);
          btnAnim.style.display = "none";
          btnAnimStop.style.display = "inline-flex";
          
          // Move camera to a good view
          this.camTargetPos.set(0, 0, 10);
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
        btnAnim.style.display = "inline-flex";
        btnAnimStop.style.display = "none";
        this.loadVirus(this.currentVirusId, this.currentMode); // Reload to reset parts
      });
    }
`;

code = code.replace(/bindEvents\(\) \{/, 'bindEvents() {' + eventBindings);

// Inside loadVirus, stop animation
const loadVirusHook = `
    if (window.VirusAnimations) {
      window.VirusAnimations.stop(this.scene);
      const btnAnim = document.getElementById("btn-anim");
      const btnAnimStop = document.getElementById("btn-anim-stop");
      if (btnAnim) btnAnim.style.display = "inline-flex";
      if (btnAnimStop) btnAnimStop.style.display = "none";
    }
`;
code = code.replace(/loadVirus\(virusId, mode = "surface"\) \{[\s\S]*?if \(!this\.scene\) return;/, 'loadVirus(virusId, mode = "surface") {\n    if (!this.scene) return;' + loadVirusHook);


fs.writeFileSync(filePath, code, 'utf8');
console.log("main.js updated with animation controls.");
