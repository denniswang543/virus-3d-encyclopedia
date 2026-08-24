const fs = require('fs');
const path = require('path');

const modelsPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(modelsPath, 'utf8');

// For SARS-CoV-2
// Move `coreGroup` creation outside the `if (isCutaway || isHologram)`
code = code.replace(/if \(isCutaway \|\| isHologram\) \{\n      const coreGroup = new THREE\.Group\(\);\n      coreGroup\.name = "sars_coreGroup";/g, `
    const coreGroup = new THREE.Group();
    coreGroup.name = "sars_coreGroup";
    if (!isCutaway && !isHologram) coreGroup.visible = false;
    {
`);

fs.writeFileSync(modelsPath, code, 'utf8');
console.log("virusModels.js updated to always create SARS coreGroup");
