const fs = require('fs');
const path = require('path');

const compPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'comparison.js');
let code = fs.readFileSync(compPath, 'utf8');

const regex = /const scaleA = Math\.min\(Math\.max\(dataA\.sizeNm \/ 120, 0\.5\), 2\.2\);\n    const scaleB = Math\.min\(Math\.max\(dataB\.sizeNm \/ 120, 0\.5\), 2\.2\);\n\n    this\.modelA\.scale\.set\(scaleA, scaleA, scaleA\);\n    this\.modelB\.scale\.set\(scaleB, scaleB, scaleB\);/;

const replacement = `    // Auto-scale based on bounding box so they always fit perfectly
    const boxA = new THREE.Box3().setFromObject(this.modelA);
    const sizeA = new THREE.Vector3();
    boxA.getSize(sizeA);
    const scaleA = 7.0 / Math.max(sizeA.x, sizeA.y, sizeA.z);
    this.modelA.scale.set(scaleA, scaleA, scaleA);

    const boxB = new THREE.Box3().setFromObject(this.modelB);
    const sizeB = new THREE.Vector3();
    boxB.getSize(sizeB);
    const scaleB = 7.0 / Math.max(sizeB.x, sizeB.y, sizeB.z);
    this.modelB.scale.set(scaleB, scaleB, scaleB);`;

if(code.match(regex)) {
   code = code.replace(regex, replacement);
   fs.writeFileSync(compPath, code, 'utf8');
   console.log("comparison.js updated for auto-scaling.");
} else {
   console.log("Regex didn't match.");
}
