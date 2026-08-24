const fs = require('fs');
const path = require('path');

const animPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusAnimations.js');
let code = fs.readFileSync(animPath, 'utf8');

code = code.replace(/if \(core\) core\.position\.y = core\.userData\.origY \+ 2 \* progress;/, `if (core) {
        core.position.y = core.userData.origY + 5 * progress;
        core.scale.set(1 + progress, 1 + progress, 1 + progress);
      }`);

code = code.replace(/core\.position\.y = core\.userData\.origY;/, `core.position.y = core.userData.origY;\n      core.scale.set(1, 1, 1);`);

fs.writeFileSync(animPath, code, 'utf8');
console.log("SARS core pop-out logic added");
