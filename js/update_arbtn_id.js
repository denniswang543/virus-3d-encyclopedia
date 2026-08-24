const fs = require('fs');
const path = require('path');

const arPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'ARButton.js');
let code = fs.readFileSync(arPath, 'utf8');

code = code.replace(/const message = document\.createElement\('a'\);/, `const message = document.createElement('a');\n        message.id = 'ARButton';`);

fs.writeFileSync(arPath, code, 'utf8');
console.log("ARButton fallback ID fixed.");
