const fs = require('fs');
const path = require('path');

const modelsPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(modelsPath, 'utf8');

// For SARS-CoV-2
code = code.replace(/const envelope = new THREE\.Mesh\(envGeo, envMat\);/, `const envelope = new THREE.Mesh(envGeo, envMat);\n    envelope.name = "sars_envelope";`);
code = code.replace(/const coreGroup = new THREE\.Group\(\);/, `const coreGroup = new THREE.Group();\n      coreGroup.name = "sars_coreGroup";`);

fs.writeFileSync(modelsPath, code, 'utf8');
console.log("virusModels.js updated for SARS-CoV-2 names");
