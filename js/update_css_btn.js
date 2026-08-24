const fs = require('fs');
const path = require('path');

const cssPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'css', 'style.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
#btn-anim {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border-color: #2ecc71;
  animation: pulse-glow 2s infinite;
}
#btn-anim:hover {
  background: #2ecc71;
  color: #070913;
  box-shadow: 0 0 15px #2ecc71;
}
@keyframes pulse-glow {
  0% { box-shadow: 0 0 5px rgba(46,204,113,0.2); }
  50% { box-shadow: 0 0 15px rgba(46,204,113,0.6); }
  100% { box-shadow: 0 0 5px rgba(46,204,113,0.2); }
}
`;

cssCode += newCSS;
fs.writeFileSync(cssPath, cssCode, 'utf8');
console.log("style.css updated for button color.");
