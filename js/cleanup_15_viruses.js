const fs = require('fs');
const path = require('path');

// 1. Clean index.html
const indexPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Remove from <!-- 16. HCV --> up to the end of Nipah button
indexHtml = indexHtml.replace(/<!-- 16\. HCV -->[\s\S]*?<!-- 30\. Nipah -->[\s\S]*?<\/button>/, '');
// Remove options from hcv to nipah
indexHtml = indexHtml.replace(/<option value="hcv">HCV \(C型肝炎病毒\)<\/option>[\s\S]*?<option value="nipah">Nipah \(立百病毒\)<\/option>/g, '');
fs.writeFileSync(indexPath, indexHtml, 'utf8');

// 2. Clean virusData.js
const dataPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusData.js');
let dataJs = fs.readFileSync(dataPath, 'utf8');
// Find the start of "hcv"
const hcvIndex = dataJs.indexOf(',\\n\\n  "hcv":');
if (hcvIndex !== -1) {
    const closingBrace = dataJs.lastIndexOf('};');
    dataJs = dataJs.substring(0, hcvIndex) + '\\n' + dataJs.substring(closingBrace);
    fs.writeFileSync(dataPath, dataJs, 'utf8');
}

// 3. Clean virusModels.js
const modelsPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let modelsJs = fs.readFileSync(modelsPath, 'utf8');

// Remove cases in switch
modelsJs = modelsJs.replace(/case "hcv": return this\.buildHCV\(mode\);[\s\S]*?case "nipah": return this\.buildNipah\(mode\);/g, '');
// Remove methods
const methodsStart = modelsJs.indexOf('  // 16. HCV');
const methodsEnd = modelsJs.indexOf('  createVirus(virusId, mode = "surface") {');
if (methodsStart !== -1 && methodsEnd !== -1) {
    modelsJs = modelsJs.substring(0, methodsStart) + modelsJs.substring(methodsEnd);
    fs.writeFileSync(modelsPath, modelsJs, 'utf8');
}

console.log("Cleanup complete!");
