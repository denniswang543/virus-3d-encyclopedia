const fs = require('fs');
const path = require('path');

const animPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusAnimations.js');
let code = fs.readFileSync(animPath, 'utf8');

// We want to fade the membrane in stage 3, and keep it faded in stage 4, and reset it in playSARS.
code = code.replace(/if \(env\) env\.material\.opacity = 1 - progress;/, `if (env) env.material.opacity = 1 - progress;\n      membrane.material.opacity = Math.max(0.1, 0.8 - 0.7 * progress); // fade membrane to reveal inside`);

// In playSARS, reset membrane opacity
code = code.replace(/this\.membraneMesh\.geometry\.attributes\.position\.needsUpdate = true;/, `this.membraneMesh.geometry.attributes.position.needsUpdate = true;\n    this.membraneMesh.material.opacity = 0.8;`);

fs.writeFileSync(animPath, code, 'utf8');
console.log("SARS membrane fade logic added");
