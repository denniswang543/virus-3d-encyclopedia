const fs = require('fs');
const path = require('path');

const mainPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'main.js');
let code = fs.readFileSync(mainPath, 'utf8');

// The logic inside setupEvents for btnAnim click
code = code.replace(/if \(this\.currentVirusId !== "bacteriophage-t4"\) \{[\s\S]*?return;\n        \}/, `if (!["bacteriophage-t4", "mimivirus"].includes(this.currentVirusId)) {
          alert("此病毒尚無專屬動畫！");
          return;
        }`);

// Also change the call to play animation
code = code.replace(/window\.VirusAnimations\.playT4\(this\.scene, this\.currentModelGroup\);/, `if(this.currentVirusId === "bacteriophage-t4") window.VirusAnimations.playT4(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "mimivirus") window.VirusAnimations.playMimi(this.scene, this.currentModelGroup);`);

// In loadVirus, hide button if not supported
const hideLogic = `
      if (btnAnimStop) btnAnimStop.style.display = "none";
      if (["bacteriophage-t4", "mimivirus"].includes(virusId)) {
        if (btnAnim) btnAnim.style.display = "inline-flex";
      } else {
        if (btnAnim) btnAnim.style.display = "none";
      }
`;

code = code.replace(/if \(btnAnim\) btnAnim\.style\.display = "inline-flex";\n      if \(btnAnimStop\) btnAnimStop\.style\.display = "none";/, hideLogic);

// Wait, the button display logic in stop/reload click needs to check array too
code = code.replace(/btnAnim\.style\.display = "inline-flex";\n        btnAnimStop\.style\.display = "none";\n        this\.loadVirus\(this\.currentVirusId, this\.currentMode\); \/\/ Reload to reset parts/, `btnAnimStop.style.display = "none";
        if(["bacteriophage-t4", "mimivirus"].includes(this.currentVirusId)) btnAnim.style.display = "inline-flex";
        this.loadVirus(this.currentVirusId, this.currentMode); // Reload to reset parts`);

fs.writeFileSync(mainPath, code, 'utf8');
console.log("main.js updated for conditional button");
