const fs = require('fs');
const path = require('path');

const cssPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'css', 'style.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const mobileCSS = `
/* Mobile Responsive Overrides */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  .left-sidebar {
    width: 100vw;
    height: auto;
    max-height: 150px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 242, 254, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
  .header {
    flex-direction: row;
    padding: 10px;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .header-controls {
    gap: 5px;
  }
  .header-controls button {
    padding: 5px 10px;
    font-size: 12px;
  }
  .virus-list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 5px;
    white-space: nowrap;
    height: 90px;
  }
  .virus-card-btn {
    min-width: 200px;
    margin-bottom: 0;
    margin-right: 10px;
    display: inline-flex;
    height: 70px;
  }
  .canvas-container {
    position: absolute;
    top: 150px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 150px - 35vh);
  }
  .right-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 35vh;
    border-left: none;
    border-top: 1px solid rgba(0, 242, 254, 0.2);
    z-index: 100;
  }
  .bottom-dock {
    bottom: 35vh;
    width: 100vw;
    left: 0;
    transform: none;
    background: rgba(7, 9, 19, 0.8);
    border-radius: 0;
    padding: 5px;
    overflow-x: auto;
    justify-content: flex-start;
  }
  .dock-group {
    margin: 0 5px;
  }
  #ARButton {
    bottom: calc(35vh + 60px) !important;
    z-index: 9999 !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
`;

if (!cssCode.includes('Mobile Responsive Overrides')) {
  cssCode += mobileCSS;
  fs.writeFileSync(cssPath, cssCode, 'utf8');
  console.log("Mobile CSS added.");
}
