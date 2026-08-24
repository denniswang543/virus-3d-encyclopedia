const fs = require('fs');
const path = require('path');

const cssPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'css', 'style.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

// Replace everything from /* Mobile Responsive Overrides */ to the end
const overrideStart = cssCode.indexOf('/* Mobile Responsive Overrides */');
if (overrideStart !== -1) {
  cssCode = cssCode.substring(0, overrideStart);
}

const newMobileCSS = `
/* Mobile Responsive Overrides */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: 100dvh; /* use dynamic viewport height for mobile */
  }
  .left-sidebar {
    width: 100vw;
    height: auto;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(0, 242, 254, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 100;
    flex-shrink: 0;
  }
  .header {
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    align-items: center;
  }
  .header-controls {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .header-controls button {
    padding: 8px 12px;
    font-size: 14px;
    white-space: nowrap;
  }
  .virus-list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 5px;
    white-space: nowrap;
    height: 85px;
  }
  .virus-card-btn {
    min-width: 220px;
    margin-bottom: 0;
    margin-right: 10px;
    display: inline-flex;
    height: 65px;
  }
  
  .canvas-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    flex-grow: 1;
    height: auto;
  }
  
  .right-panel {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 30dvh;
    border-left: none;
    border-top: 1px solid rgba(0, 242, 254, 0.2);
    z-index: 100;
    background: rgba(7, 9, 19, 0.95);
    flex-shrink: 0;
  }
  
  .bottom-dock {
    position: absolute;
    bottom: 30dvh; /* sits right on top of right-panel */
    width: 100vw;
    left: 0;
    transform: none;
    background: rgba(7, 9, 19, 0.9);
    border-radius: 0;
    padding: 10px 5px;
    overflow-x: auto;
    justify-content: flex-start;
    white-space: nowrap;
  }
  .dock-group {
    margin: 0 5px;
  }
  .mode-btn {
    white-space: nowrap;
  }
  
  #ARButton {
    bottom: calc(30dvh + 70px) !important;
    z-index: 999999 !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    padding: 15px 30px !important;
    font-size: 16px !important;
    background: var(--accent-cyan) !important;
    color: #000 !important;
    border-radius: 30px !important;
  }
}
`;

cssCode += newMobileCSS;
fs.writeFileSync(cssPath, cssCode, 'utf8');
console.log("Improved mobile CSS added.");
