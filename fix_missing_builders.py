import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. FIX CORONAVIRUS (Orange glossy)
js = js.replace('color: 0xa4b0be, roughness: 0.6, metalness: 0.1,', 'color: 0xf39c12, roughness: 0.3, metalness: 0.5,')
js = js.replace('color: 0xff4757,', 'color: 0xe67e22,') # Make spikes dark orange

# 2. RESTORE HBV and VZV
with open('temp_models.js', 'r', encoding='utf-16') as f:
    temp_js = f.read()

def get_function(code, func_name):
    # Matches buildXXX(mode="surface") { ... } up to the next buildXXX
    pattern = r'  ' + func_name + r'\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)'
    m = re.search(pattern, code, re.DOTALL)
    if m:
        return m.group(0)
    return None

hbv_code = get_function(temp_js, 'buildHBV')
vzv_code = get_function(temp_js, 'buildVZV')

if hbv_code and 'buildHBV(mode = "surface") {' not in js:
    # Let's change HBV colors to the Cyan/Blue palette from the cartoon reference image
    # (Cyan body 0x00d2d3, Dark Blue spikes 0x0a3d62)
    hbv_code = re.sub(r'(color:\s*)0xf1c40f(.*?color:\s*)0xffda79(.*?color:\s*)0xffda79', r'\1 0x00d2d3 \2 0x00d2d3 \3 0x00d2d3', hbv_code, flags=re.DOTALL)
    hbv_code = re.sub(r'(color:\s*)0xd35400', r'\1 0x0a3d62', hbv_code, flags=re.DOTALL)
    # Insert it right before buildZika
    js = js.replace('  buildZika(mode = "surface") {', hbv_code + '\n  buildZika(mode = "surface") {')
    print("Injected HBV")

if vzv_code and 'buildVZV(mode = "surface") {' not in js:
    # Insert it right before makeOrganic
    js = js.replace('  // Helper to make geometries look like organic', vzv_code + '\n  // Helper to make geometries look like organic')
    print("Injected VZV")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Finished fixes")
