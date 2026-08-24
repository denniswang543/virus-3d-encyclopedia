const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'index.html');
let code = fs.readFileSync(filePath, 'utf8');

// Add virusAnimations.js
if(!code.includes('virusAnimations.js')) {
    code = code.replace('<script src="js/virusModels.js"></script>', '<script src="js/virusModels.js"></script>\\n  <script src="js/virusAnimations.js"></script>');
}

// Add the Animation Button to the control bar
const buttonHtml = `
      <button class="icon-btn" id="btn-anim" title="播放感染動畫">
        <i class="fa-solid fa-play"></i> 播放動畫
      </button>
      <button class="icon-btn" id="btn-anim-stop" title="停止動畫" style="display:none; color: #ff4d4d;">
        <i class="fa-solid fa-stop"></i> 停止
      </button>
      <div class="divider"></div>`;

code = code.replace(/<button class="icon-btn" id="btn-reset" title="重設視角">/g, buttonHtml + '\\n      <button class="icon-btn" id="btn-reset" title="重設視角">');

fs.writeFileSync(filePath, code, 'utf8');
console.log("index.html updated with animation script and buttons.");
