import re

html_path = r'd:\__AI\SLF\virus-3d\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract Influenza B button block
inf_b_pattern = r'(\s*<button class="virus-card-btn" data-virus-id="influenza-b">.*?B型流感病毒.*?</button>)'
inf_b_match = re.search(inf_b_pattern, html, flags=re.DOTALL)
if inf_b_match:
    inf_b_html = inf_b_match.group(1)
    # Remove it from its current position
    html = html.replace(inf_b_html, "")
    
    # Insert it right after influenza-a
    inf_a_pattern = r'(<button class="virus-card-btn" data-virus-id="influenza-a">.*?</button>)'
    inf_a_match = re.search(inf_a_pattern, html, flags=re.DOTALL)
    if inf_a_match:
        html = html.replace(inf_a_match.group(1), inf_a_match.group(1) + inf_b_html)

# 2. Inject VZV (Chickenpox) after HSV (hsv) or Orf depending on logical grouping.
# The user asked about Waterpox (Chickenpox) and Sheep pox (Orf). Let's put VZV right before Orf, or just after HSV.
# Let's put it right after HSV.
vzv_html = """
        <!-- VZV -->
        <button class="virus-card-btn" data-virus-id="vzv">
          <div class="card-icon" style="color: #ff4757;"><i class="fa-solid fa-droplet"></i></div>
          <div class="card-info">
            <div class="card-title">水痘病毒 (VZV)</div>
            <div class="card-meta"><span class="tag-badge tag-dna">dsDNA</span> <span class="tag-size">200 nm</span></div>
          </div>
        </button>"""

hsv_pattern = r'(<button class="virus-card-btn" data-virus-id="hsv">.*?</button>)'
hsv_match = re.search(hsv_pattern, html, flags=re.DOTALL)
if hsv_match and 'data-virus-id="vzv"' not in html:
    html = html.replace(hsv_match.group(1), hsv_match.group(1) + vzv_html)

# Update count (34 -> 35)
html = html.replace('34款精選模型', '35款精選模型')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")
