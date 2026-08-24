const fs = require('fs');
const path = require('path');

const animPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusAnimations.js');
let code = fs.readFileSync(animPath, 'utf8');

const mimiCode = `
  // 啟動 Mimivirus 動畫
  playMimi(scene, mimiGroup) {
    this.stop(scene);
    
    const stargate = mimiGroup.getObjectByName("mimi_stargate");
    const dna = mimiGroup.getObjectByName("mimi_dna");

    if (!dna) return;

    if (stargate && stargate.userData.origY === undefined) {
      stargate.userData.origY = stargate.position.y;
      stargate.userData.origScale = stargate.scale.clone();
    }
    if (dna.userData.origY === undefined) {
      dna.userData.origY = dna.position.y;
      dna.userData.origScale = dna.scale.clone();
    }

    // Reset
    mimiGroup.position.set(0, 0, 0);
    if (stargate) {
      stargate.position.y = stargate.userData.origY;
      stargate.scale.copy(stargate.userData.origScale);
      stargate.material.opacity = 1;
      stargate.material.transparent = true;
    }
    dna.position.y = dna.userData.origY;
    dna.scale.set(0.1, 0.1, 0.1);
    dna.visible = true;
    dna.material.opacity = 1;
    dna.material.transparent = true;

    this.startTime = Date.now();
    this.activeAnimation = requestAnimationFrame(() => this.animateMimi(mimiGroup, stargate, dna, this.showText));
  },

  animateMimi(mimiGroup, stargate, dna, showText) {
    if (!this.activeAnimation) return;

    const elapsed = (Date.now() - this.startTime) / 1000;

    // 階段 1: 星門溶解/開啟 (0 ~ 3 秒)
    if (elapsed < 3.0) {
      this.showText("階段一：星門 (Stargate) 結構開始溶解開啟");
      const progress = elapsed / 3.0;
      if (stargate) {
        stargate.position.y = stargate.userData.origY + progress * 0.5;
        stargate.scale.set(1 + progress, 1 - progress, 1 + progress);
        stargate.material.opacity = 1 - progress;
      }
      dna.scale.set(0.1, 0.1, 0.1);
    } 
    // 階段 2: 核心釋放 (3 ~ 7 秒)
    else if (elapsed >= 3.0 && elapsed < 7.0) {
      this.showText("階段二：巨大的膜質核心與 DNA 被釋放到宿主細胞質內");
      if (stargate) stargate.material.opacity = 0;
      
      const progress = (elapsed - 3.0) / 4.0;
      // Scale up to 1.0
      const s = 0.1 + progress * 0.9;
      dna.scale.set(s, s, s);
      // Move up through the opened stargate
      dna.position.y = dna.userData.origY + progress * 5.0;
      
      // Pulse color
      dna.material.color.setHSL(0.15, 1, 0.5 + 0.3 * Math.sin(elapsed * 8));
    }
    // 階段 3: 完成
    else if (elapsed >= 7.0 && elapsed < 10.0) {
      this.showText("感染完成！核心準備釋放龐大基因組。");
      dna.material.opacity = 1 - (elapsed - 7.0)/3.0;
    }
    else {
      // Loop
      this.startTime = Date.now();
    }

    this.activeAnimation = requestAnimationFrame(() => this.animateMimi(mimiGroup, stargate, dna, showText));
  },
`;

code = code.replace(/showText\("感染完成！DNA 已進入宿主準備複製。"\);\n      if \(injectDna\) injectDna\.material\.opacity = 0;\n    \}\n    else \{\n      \/\/ Loop\n      this\.startTime = Date\.now\(\);\n    \}\n\n    this\.activeAnimation = requestAnimationFrame\(\(\) => this\.animateT4\(t4Group, headGroup, sheathGroup, dna, injectDna, showText\)\);\n  \},/, 
`showText("感染完成！DNA 已進入宿主準備複製。");
      if (injectDna) injectDna.material.opacity = 0;
    }
    else {
      // Loop
      this.startTime = Date.now();
    }

    this.activeAnimation = requestAnimationFrame(() => this.animateT4(t4Group, headGroup, sheathGroup, dna, injectDna, showText));
  },
` + mimiCode);

// Also need to pull showText out of playT4 so playMimi can use it
const fixShowText = `
  showText(text) {
    let el = document.getElementById("anim-subtitle");
    if (!el) {
      el = document.createElement("div");
      el.id = "anim-subtitle";
      el.style.position = "absolute";
      el.style.bottom = "100px";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
      el.style.color = "#00ffff";
      el.style.fontSize = "24px";
      el.style.fontWeight = "bold";
      el.style.textShadow = "0 0 10px rgba(0,255,255,0.8), 2px 2px 4px #000";
      el.style.pointerEvents = "none";
      el.style.zIndex = "100";
      document.body.appendChild(el);
    }
    el.innerText = text;
  },
`;

code = code.replace(/const showText = \([\s\S]*?\}\;/g, '');
code = code.replace(/this\.activeAnimation = requestAnimationFrame\(\(\) => this\.animateT4\(t4Group, headGroup, sheathGroup, dna, injectDna, showText\)\);/g, `this.activeAnimation = requestAnimationFrame(() => this.animateT4(t4Group, headGroup, sheathGroup, dna, injectDna));`);
code = code.replace(/animateT4\(t4Group, headGroup, sheathGroup, dna, injectDna, showText\) \{/g, `animateT4(t4Group, headGroup, sheathGroup, dna, injectDna) {`);
code = code.replace(/showText\(/g, `this.showText(`);

code = code.replace(/playT4\(scene, t4Group\) \{/, fixShowText + '\n  playT4(scene, t4Group) {');

fs.writeFileSync(animPath, code, 'utf8');
console.log("virusAnimations.js updated for Mimivirus.");
