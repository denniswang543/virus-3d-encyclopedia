const fs = require('fs');
const path = require('path');

const cssPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'css', 'style.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const overrideStart = cssCode.indexOf('/* Mobile Responsive Overrides */');
if (overrideStart !== -1) {
  cssCode = cssCode.substring(0, overrideStart);
}

const correctMobileCSS = `
/* Mobile Responsive Overrides */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: 100dvh; 
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
  
  .top-navbar {
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    align-items: center;
    height: auto;
  }
  
  .nav-actions {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  
  .nav-actions button {
    padding: 8px 12px;
    font-size: 14px;
    white-space: nowrap;
    flex: 1;
    min-width: 100px;
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
  
  .viewport-wrapper {
    position: relative;
    width: 100vw;
    flex-grow: 1;
    height: auto;
  }
  
  #canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .right-sidebar {
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
    overflow-y: auto;
  }
  
  .bottom-dock {
    position: absolute;
    bottom: 30dvh; 
    width: 100vw;
    left: 0;
    transform: none;
    background: rgba(7, 9, 19, 0.9);
    border-radius: 0;
    padding: 10px 5px;
    overflow-x: auto;
    justify-content: flex-start;
    white-space: nowrap;
    z-index: 150;
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

cssCode += correctMobileCSS;
fs.writeFileSync(cssPath, cssCode, 'utf8');
console.log("Correct mobile CSS applied.");
