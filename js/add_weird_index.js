const fs = require('fs');
const path = require('path');

const indexPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'index.html');
let code = fs.readFileSync(indexPath, 'utf8');

const newButtons = `
        <!-- 16. Mimivirus -->
        <button class="virus-card-btn" data-virus-id="mimivirus">
          <div class="card-icon" style="color: #686de0;"><i class="fa-brands fa-galactic-senate"></i></div>
          <div class="card-info">
            <div class="card-title">米米病毒 (Mimivirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">750 nm</span>
            </div>
          </div>
        </button>

        <!-- 17. Pithovirus -->
        <button class="virus-card-btn" data-virus-id="pithovirus">
          <div class="card-icon" style="color: #f0932b;"><i class="fa-solid fa-jar"></i></div>
          <div class="card-info">
            <div class="card-title">闊口罐病毒 (Pithovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">1500 nm</span>
            </div>
          </div>
        </button>

        <!-- 18. Tupanvirus -->
        <button class="virus-card-btn" data-virus-id="tupanvirus">
          <div class="card-icon" style="color: #eb4d4b;"><i class="fa-solid fa-meteor"></i></div>
          <div class="card-info">
            <div class="card-title">圖潘病毒 (Tupanvirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">1200 nm</span>
            </div>
          </div>
        </button>

        <!-- 19. ATV -->
        <button class="virus-card-btn" data-virus-id="atv">
          <div class="card-icon" style="color: #f9ca24;"><i class="fa-solid fa-lemon"></i></div>
          <div class="card-info">
            <div class="card-title">雙尾紡錘病毒 (ATV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">140 nm</span>
            </div>
          </div>
        </button>

        <!-- 20. Geminivirus -->
        <button class="virus-card-btn" data-virus-id="geminivirus">
          <div class="card-icon" style="color: #6ab04c;"><i class="fa-solid fa-capsules"></i></div>
          <div class="card-info">
            <div class="card-title">雙子星病毒 (Geminivirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">ssDNA</span>
              <span class="tag-size">30 nm</span>
            </div>
          </div>
        </button>

        <!-- 21. TMV -->
        <button class="virus-card-btn" data-virus-id="tmv">
          <div class="card-icon" style="color: #badc58;"><i class="fa-solid fa-lines-leaning"></i></div>
          <div class="card-info">
            <div class="card-title">菸草鑲嵌病毒 (TMV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">300 nm</span>
            </div>
          </div>
        </button>

        <!-- 22. M13 Phage -->
        <button class="virus-card-btn" data-virus-id="m13">
          <div class="card-icon" style="color: #c7ecee;"><i class="fa-solid fa-worm"></i></div>
          <div class="card-info">
            <div class="card-title">M13 噬菌體</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">ssDNA</span>
              <span class="tag-size">900 nm</span>
            </div>
          </div>
        </button>

        <!-- 23. ACV -->
        <button class="virus-card-btn" data-virus-id="acv">
          <div class="card-icon" style="color: #ffbe76;"><i class="fa-solid fa-tornado"></i></div>
          <div class="card-info">
            <div class="card-title">彈簧病毒 (ACV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">ssDNA</span>
              <span class="tag-size">230 nm</span>
            </div>
          </div>
        </button>

        <!-- 24. Guttavirus -->
        <button class="virus-card-btn" data-virus-id="guttavirus">
          <div class="card-icon" style="color: #7ed6df;"><i class="fa-solid fa-droplet"></i></div>
          <div class="card-info">
            <div class="card-title">淚滴形病毒 (Guttavirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">110 nm</span>
            </div>
          </div>
        </button>

        <!-- 25. Astrovirus -->
        <button class="virus-card-btn" data-virus-id="astrovirus">
          <div class="card-icon" style="color: #e056fd;"><i class="fa-solid fa-star"></i></div>
          <div class="card-info">
            <div class="card-title">星狀病毒 (Astrovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">35 nm</span>
            </div>
          </div>
        </button>

        <!-- 26. Baculovirus -->
        <button class="virus-card-btn" data-virus-id="baculovirus">
          <div class="card-icon" style="color: #4834d4;"><i class="fa-solid fa-hotdog"></i></div>
          <div class="card-info">
            <div class="card-title">桿狀病毒 (Baculovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">300 nm</span>
            </div>
          </div>
        </button>

        <!-- 27. Orf Virus -->
        <button class="virus-card-btn" data-virus-id="orf">
          <div class="card-icon" style="color: #ff7979;"><i class="fa-solid fa-yarn"></i></div>
          <div class="card-info">
            <div class="card-title">羊痘病毒 (Orf Virus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">260 nm</span>
            </div>
          </div>
        </button>

        <!-- 28. Phi29 -->
        <button class="virus-card-btn" data-virus-id="phi29">
          <div class="card-icon" style="color: #30336b;"><i class="fa-solid fa-robot"></i></div>
          <div class="card-info">
            <div class="card-title">Phi29 噬菌體</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">80 nm</span>
            </div>
          </div>
        </button>

        <!-- 29. Phi X 174 -->
        <button class="virus-card-btn" data-virus-id="phix174">
          <div class="card-icon" style="color: #535c68;"><i class="fa-solid fa-sun-plant-wilt"></i></div>
          <div class="card-info">
            <div class="card-title">刺錘噬菌體 (Phi X 174)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">ssDNA</span>
              <span class="tag-size">30 nm</span>
            </div>
          </div>
        </button>

        <!-- 30. Torovirus -->
        <button class="virus-card-btn" data-virus-id="torovirus">
          <div class="card-icon" style="color: #f6e58d;"><i class="fa-solid fa-ring"></i></div>
          <div class="card-info">
            <div class="card-title">環曲病毒 (Torovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">140 nm</span>
            </div>
          </div>
        </button>
`;

const newOptions = `
              <option value="mimivirus">Mimivirus (米米病毒)</option>
              <option value="pithovirus">Pithovirus (闊口罐病毒)</option>
              <option value="tupanvirus">Tupanvirus (圖潘病毒)</option>
              <option value="atv">ATV (雙尾紡錘病毒)</option>
              <option value="geminivirus">Geminivirus (雙子星病毒)</option>
              <option value="tmv">TMV (菸草鑲嵌病毒)</option>
              <option value="m13">M13 Phage (M13 噬菌體)</option>
              <option value="acv">ACV (彈簧病毒)</option>
              <option value="guttavirus">Guttavirus (淚滴形病毒)</option>
              <option value="astrovirus">Astrovirus (星狀病毒)</option>
              <option value="baculovirus">Baculovirus (桿狀病毒)</option>
              <option value="orf">Orf Virus (羊痘病毒)</option>
              <option value="phi29">Phi29 Phage (Phi29 噬菌體)</option>
              <option value="phix174">Phi X 174 (刺錘噬菌體)</option>
              <option value="torovirus">Torovirus (環曲病毒)</option>
`;

// Insert new buttons before "      </div>\n    </aside>"
code = code.replace(/(<!-- 15\. Measles -->[\s\S]*?<\/button>\s*)(<\/div>\s*<\/aside>)/, `$1${newButtons}$2`);

// Insert new options into both selects
code = code.replace(/(<option value="measles">Measles \(麻疹病毒\)<\/option>\s*)(<\/select>\s*<\/div>\s*<div class="comp-3d-viewport" id="comp-canvas-a">)/g, `$1${newOptions}$2`);
code = code.replace(/(<option value="measles">Measles \(麻疹病毒\)<\/option>\s*)(<\/select>\s*<\/div>\s*<div class="comp-3d-viewport" id="comp-canvas-b">)/g, `$1${newOptions}$2`);

fs.writeFileSync(indexPath, code, 'utf8');
console.log('Updated index.html with 15 weird viruses');
