const fs = require('fs');
const path = require('path');

const indexPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'index.html');
let code = fs.readFileSync(indexPath, 'utf8');

const newButtons = `
        <!-- 16. HCV -->
        <button class="virus-card-btn" data-virus-id="hcv">
          <div class="card-icon" style="color: #ffb142;"><i class="fa-solid fa-virus"></i></div>
          <div class="card-info">
            <div class="card-title">C型肝炎病毒 (HCV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">50 nm</span>
            </div>
          </div>
        </button>

        <!-- 17. Poliovirus -->
        <button class="virus-card-btn" data-virus-id="poliovirus">
          <div class="card-icon" style="color: #34ace0;"><i class="fa-solid fa-bowling-ball"></i></div>
          <div class="card-info">
            <div class="card-title">小兒麻痺病毒 (Polio)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">30 nm</span>
            </div>
          </div>
        </button>

        <!-- 18. Marburg -->
        <button class="virus-card-btn" data-virus-id="marburg">
          <div class="card-icon" style="color: #b33939;"><i class="fa-solid fa-worm"></i></div>
          <div class="card-info">
            <div class="card-title">馬堡病毒 (Marburg)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">-ssRNA</span>
              <span class="tag-size">800 nm</span>
            </div>
          </div>
        </button>

        <!-- 19. RSV -->
        <button class="virus-card-btn" data-virus-id="rsv">
          <div class="card-icon" style="color: #33d9b2;"><i class="fa-solid fa-lungs-virus"></i></div>
          <div class="card-info">
            <div class="card-title">呼吸道融合病毒 (RSV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">-ssRNA</span>
              <span class="tag-size">150 nm</span>
            </div>
          </div>
        </button>

        <!-- 20. EBV -->
        <button class="virus-card-btn" data-virus-id="ebv">
          <div class="card-icon" style="color: #706fd3;"><i class="fa-solid fa-certificate"></i></div>
          <div class="card-info">
            <div class="card-title">EB 病毒 (EBV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">150 nm</span>
            </div>
          </div>
        </button>

        <!-- 21. VZV -->
        <button class="virus-card-btn" data-virus-id="vzv">
          <div class="card-icon" style="color: #ff5252;"><i class="fa-solid fa-certificate"></i></div>
          <div class="card-info">
            <div class="card-title">水痘帶狀皰疹病毒 (VZV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">180 nm</span>
            </div>
          </div>
        </button>

        <!-- 22. CMV -->
        <button class="virus-card-btn" data-virus-id="cmv">
          <div class="card-icon" style="color: #227093;"><i class="fa-solid fa-certificate"></i></div>
          <div class="card-info">
            <div class="card-title">巨細胞病毒 (CMV)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">200 nm</span>
            </div>
          </div>
        </button>

        <!-- 23. Yellow Fever -->
        <button class="virus-card-btn" data-virus-id="yellow-fever">
          <div class="card-icon" style="color: #fbc531;"><i class="fa-solid fa-gem"></i></div>
          <div class="card-info">
            <div class="card-title">黃熱病毒 (Yellow Fever)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">50 nm</span>
            </div>
          </div>
        </button>

        <!-- 24. West Nile -->
        <button class="virus-card-btn" data-virus-id="west-nile">
          <div class="card-icon" style="color: #40739e;"><i class="fa-solid fa-gem"></i></div>
          <div class="card-info">
            <div class="card-title">西尼羅病毒 (West Nile)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">50 nm</span>
            </div>
          </div>
        </button>

        <!-- 25. Chikungunya -->
        <button class="virus-card-btn" data-virus-id="chikungunya">
          <div class="card-icon" style="color: #9c88ff;"><i class="fa-solid fa-dice-d20"></i></div>
          <div class="card-info">
            <div class="card-title">屈公病毒 (Chikungunya)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">70 nm</span>
            </div>
          </div>
        </button>

        <!-- 26. MERS-CoV -->
        <button class="virus-card-btn" data-virus-id="mers-cov">
          <div class="card-icon" style="color: #c23616;"><i class="fa-solid fa-virus"></i></div>
          <div class="card-info">
            <div class="card-title">MERS-CoV</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">120 nm</span>
            </div>
          </div>
        </button>

        <!-- 27. Adenovirus -->
        <button class="virus-card-btn" data-virus-id="adenovirus">
          <div class="card-icon" style="color: #0097e6;"><i class="fa-solid fa-satellite"></i></div>
          <div class="card-info">
            <div class="card-title">腺病毒 (Adenovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-dna">dsDNA</span>
              <span class="tag-size">90 nm</span>
            </div>
          </div>
        </button>

        <!-- 28. Rhinovirus -->
        <button class="virus-card-btn" data-virus-id="rhinovirus">
          <div class="card-icon" style="color: #4cd137;"><i class="fa-solid fa-head-side-cough"></i></div>
          <div class="card-info">
            <div class="card-title">鼻病毒 (Rhinovirus)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">+ssRNA</span>
              <span class="tag-size">30 nm</span>
            </div>
          </div>
        </button>

        <!-- 29. Lassa -->
        <button class="virus-card-btn" data-virus-id="lassa">
          <div class="card-icon" style="color: #e056fd;"><i class="fa-solid fa-circle-nodes"></i></div>
          <div class="card-info">
            <div class="card-title">拉薩病毒 (Lassa)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">Ambisense RNA</span>
              <span class="tag-size">100 nm</span>
            </div>
          </div>
        </button>

        <!-- 30. Nipah -->
        <button class="virus-card-btn" data-virus-id="nipah">
          <div class="card-icon" style="color: #5f27cd;"><i class="fa-solid fa-brain"></i></div>
          <div class="card-info">
            <div class="card-title">立百病毒 (Nipah)</div>
            <div class="card-meta">
              <span class="tag-badge tag-rna">-ssRNA</span>
              <span class="tag-size">200 nm</span>
            </div>
          </div>
        </button>
`;

const newOptions = `
              <option value="hcv">HCV (C型肝炎病毒)</option>
              <option value="poliovirus">Poliovirus (小兒麻痺病毒)</option>
              <option value="marburg">Marburg (馬堡病毒)</option>
              <option value="rsv">RSV (呼吸道融合病毒)</option>
              <option value="ebv">EBV (EB 病毒)</option>
              <option value="vzv">VZV (水痘帶狀皰疹病毒)</option>
              <option value="cmv">CMV (巨細胞病毒)</option>
              <option value="yellow-fever">Yellow Fever (黃熱病毒)</option>
              <option value="west-nile">West Nile (西尼羅病毒)</option>
              <option value="chikungunya">Chikungunya (屈公病毒)</option>
              <option value="mers-cov">MERS-CoV</option>
              <option value="adenovirus">Adenovirus (腺病毒)</option>
              <option value="rhinovirus">Rhinovirus (鼻病毒)</option>
              <option value="lassa">Lassa (拉薩病毒)</option>
              <option value="nipah">Nipah (立百病毒)</option>
`;

// Insert new buttons before "      </div>\n    </aside>"
code = code.replace(/(<!-- 15\. Measles -->[\s\S]*?<\/button>\s*)(<\/div>\s*<\/aside>)/, `$1${newButtons}$2`);

// Insert new options into both selects
code = code.replace(/(<option value="measles">Measles \(麻疹病毒\)<\/option>\s*)(<\/select>\s*<\/div>\s*<div class="comp-3d-viewport" id="comp-canvas-a">)/g, `$1${newOptions}$2`);
code = code.replace(/(<option value="measles">Measles \(麻疹病毒\)<\/option>\s*)(<\/select>\s*<\/div>\s*<div class="comp-3d-viewport" id="comp-canvas-b">)/g, `$1${newOptions}$2`);

fs.writeFileSync(indexPath, code, 'utf8');
console.log('Updated index.html with 15 new viruses');
