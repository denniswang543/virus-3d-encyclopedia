const fs = require('fs');
const path = require('path');

const cssPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'css', 'style.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const desktopCSS = `
/* Hide AR button on desktop */
@media (min-width: 769px) {
  #ARButton {
    display: none !important;
  }
}
`;

if (!cssCode.includes('Hide AR button on desktop')) {
  cssCode += desktopCSS;
  fs.writeFileSync(cssPath, cssCode, 'utf8');
  console.log("Desktop AR hide CSS added.");
}
