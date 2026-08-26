import re

html_path = r'd:\__AI\SLF\virus-3d\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add to the button list. Let's find the end of the virus cards list.
# We'll just insert them right before the closing </div> of the sidebar-menu.
new_buttons = """
        <!-- Poliovirus -->
        <button class="virus-card-btn" data-virus-id="polio">
          <div class="card-icon" style="color: #ff9f43;"><i class="fa-solid fa-disease"></i></div>
          <div class="card-info">
            <div class="card-title">小兒麻痺病毒 (Polio)</div>
            <div class="card-meta"><span class="tag-badge tag-rna">+ssRNA</span> <span class="tag-size">30 nm</span></div>
          </div>
        </button>

        <!-- Hepatitis C -->
        <button class="virus-card-btn" data-virus-id="hcv">
          <div class="card-icon" style="color: #00d2d3;"><i class="fa-solid fa-vial-virus"></i></div>
          <div class="card-info">
            <div class="card-title">C型肝炎病毒 (HCV)</div>
            <div class="card-meta"><span class="tag-badge tag-rna">+ssRNA</span> <span class="tag-size">50 nm</span></div>
          </div>
        </button>

        <!-- Rubella -->
        <button class="virus-card-btn" data-virus-id="rubella">
          <div class="card-icon" style="color: #fd79a8;"><i class="fa-solid fa-child-reaching"></i></div>
          <div class="card-info">
            <div class="card-title">德國麻疹病毒 (Rubella)</div>
            <div class="card-meta"><span class="tag-badge tag-rna">+ssRNA</span> <span class="tag-size">60 nm</span></div>
          </div>
        </button>
"""

# Find the last button
last_btn_idx = html.rfind('</button>')
if last_btn_idx != -1:
    insert_pos = last_btn_idx + 9
    html = html[:insert_pos] + new_buttons + html[insert_pos:]

# Update count
html = re.sub(r'(\d+)款精選模型', '38款精選模型', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated HTML")
