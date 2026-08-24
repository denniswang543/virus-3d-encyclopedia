const fs = require('fs');
const path = require('path');

const indexPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'index.html');
let code = fs.readFileSync(indexPath, 'utf8');

const animatedViruses = [
  "sars-cov-2",
  "bacteriophage-t4",
  "mimivirus",
  "pithovirus",
  "baculovirus",
  "atv"
];

for (const vid of animatedViruses) {
  // Regex to match the start of the button for this specific virus and find its card-meta
  const regex = new RegExp('(<button class="virus-card-btn" data-virus-id="' + vid + '">[\\s\\S]*?<div class="card-meta">[\\s\\S]*?)(</div>)');
  
  // We want to insert the tag right before the closing </div> of card-meta, ONLY IF it doesn't already have it
  if (!code.match(new RegExp('data-virus-id="' + vid + '"[\\s\\S]*?🎬 動畫'))) {
    code = code.replace(regex, '$1\\n              <span class="tag-badge" style="background: rgba(46,204,113,0.2); color: #2ecc71; border: 1px solid #2ecc71;"><i class="fa-solid fa-play"></i> 動畫</span>$2');
  }
}

fs.writeFileSync(indexPath, code, 'utf8');
console.log("index.html updated with animation tags.");
