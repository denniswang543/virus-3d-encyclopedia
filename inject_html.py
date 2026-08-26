import os

# 1. Update index.html
html_path = r'd:\__AI\SLF\virus-3d\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_buttons = """
        <!-- New Outbreaks -->
        <button class="virus-card-btn" data-virus-id="adenovirus">
          <div class="card-icon" style="color: #00d2d3;"><i class="fa-solid fa-satellite"></i></div>
          <div class="card-info">
            <div class="card-title">腺病毒 (Adenovirus)</div>
            <div class="card-meta"><span class="tag-badge tag-dna">dsDNA</span> <span class="tag-size">90 nm</span></div>
          </div>
        </button>
        <button class="virus-card-btn" data-virus-id="enterovirus">
          <div class="card-icon" style="color: #ff9f43;"><i class="fa-solid fa-child-reaching"></i></div>
          <div class="card-info">
            <div class="card-title">腸病毒 (Enterovirus)</div>
            <div class="card-meta"><span class="tag-badge tag-rna">+ssRNA</span> <span class="tag-size">30 nm</span></div>
          </div>
        </button>
        <button class="virus-card-btn" data-virus-id="rhinovirus">
          <div class="card-icon" style="color: #1dd1a1;"><i class="fa-solid fa-head-side-cough"></i></div>
          <div class="card-info">
            <div class="card-title">鼻病毒 (Rhinovirus)</div>
            <div class="card-meta"><span class="tag-badge tag-rna">+ssRNA</span> <span class="tag-size">30 nm</span></div>
          </div>
        </button>
        <button class="virus-card-btn" data-virus-id="influenza-b">
          <div class="card-icon" style="color: #54a0ff;"><i class="fa-solid fa-snowflake"></i></div>
          <div class="card-info">
            <div class="card-title">B型流感病毒</div>
            <div class="card-meta"><span class="tag-badge tag-rna">-ssRNA</span> <span class="tag-size">100 nm</span></div>
          </div>
        </button>
"""

# Insert after Influenza A
if "data-virus-id=\"adenovirus\"" not in html:
    parts = html.split('<!-- 4. Bacteriophage T4 -->')
    html = parts[0] + new_buttons + '<!-- 4. Bacteriophage T4 -->' + parts[1]
    
    # Update total count text
    html = html.replace('29款精選模型', '34款精選模型')
    html = html.replace('30款精選模型', '34款精選模型')
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

print("Updated index.html")
