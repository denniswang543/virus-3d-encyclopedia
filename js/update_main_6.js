const fs = require('fs');
const path = require('path');

const mainPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'main.js');
let code = fs.readFileSync(mainPath, 'utf8');

const supported = `["bacteriophage-t4", "mimivirus", "sars-cov-2", "pithovirus", "baculovirus", "atv"]`;

// 1. replace in button click guard
code = code.replace(/if \(\!\["bacteriophage-t4", "mimivirus"\]\.includes\(this\.currentVirusId\)\) \{/, `if (!${supported}.includes(this.currentVirusId)) {`);

// 2. replace the play routing
code = code.replace(/if\(this\.currentVirusId === "bacteriophage-t4"\) window\.VirusAnimations\.playT4\(this\.scene, this\.currentModelGroup\);\n          else if\(this\.currentVirusId === "mimivirus"\) window\.VirusAnimations\.playMimi\(this\.scene, this\.currentModelGroup\);/, 
`if(this.currentVirusId === "bacteriophage-t4") window.VirusAnimations.playT4(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "mimivirus") window.VirusAnimations.playMimi(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "sars-cov-2") window.VirusAnimations.playSARS(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "pithovirus") window.VirusAnimations.playPitho(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "baculovirus") window.VirusAnimations.playBaculo(this.scene, this.currentModelGroup);
          else if(this.currentVirusId === "atv") window.VirusAnimations.playATV(this.scene, this.currentModelGroup);`);

// 3. replace in loadVirus hide logic
code = code.replace(/if \(\["bacteriophage-t4", "mimivirus"\]\.includes\(virusId\)\) \{/, `if (${supported}.includes(virusId)) {`);

// 4. replace in reload logic
code = code.replace(/if\(\["bacteriophage-t4", "mimivirus"\]\.includes\(this\.currentVirusId\)\) btnAnim\.style\.display = "inline-flex";/, `if(${supported}.includes(this.currentVirusId)) btnAnim.style.display = "inline-flex";`);

fs.writeFileSync(mainPath, code, 'utf8');
console.log("main.js updated to support 6 animations.");
