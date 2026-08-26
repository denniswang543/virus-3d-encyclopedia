import re

# Read current (7e15ec9) which has Polio, HCV, Rubella, and fixed Flu B / Corona.
with open('js/virusModels.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Read original (aaf7582) - Fix encoding issue from PS redirect
with open('models_original.js', 'r', encoding='utf-16') as f:
    orig = f.read()

def get_function(code, func_name):
    pattern = r'  ' + func_name + r'\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)'
    m = re.search(pattern, code, re.DOTALL)
    if m:
        return m.group(0)
    return None

# 1. Restore T4 and color it (Red head, Blue Sheath, Purple Plate/Legs)
t4_orig = get_function(orig, 'buildBacteriophageT4')
t4_orig = re.sub(r'const mainColor = isHologram \? 0xa55eea : 0x4834d4;', 'const mainColor = isHologram ? 0xa55eea : 0xff4757;', t4_orig)
t4_orig = t4_orig.replace('const sheathMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const sheathMat = new THREE.MeshStandardMaterial({ color: 0x3742fa')
t4_orig = t4_orig.replace('const plateMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const plateMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')
t4_orig = t4_orig.replace('const legMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const legMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')

js = re.sub(r'  buildBacteriophageT4\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', t4_orig, js, flags=re.DOTALL)


# 2. Restore Ebola and color it (Pink 0xff4757)
ebola_orig = get_function(orig, 'buildEbola')
ebola_orig = re.sub(r'(color:\s*)0xf39c12(.*?color:\s*)0xf39c12', r'\1 0xff4757 \2 0xff4757', ebola_orig, flags=re.DOTALL)
js = re.sub(r'  buildEbola\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', ebola_orig, js, flags=re.DOTALL)


# 3. Restore Rabies and color it (Cyan body 0x00d2d3, Purple spikes 0x6c5ce7)
rabies_orig = get_function(orig, 'buildRabies')
rabies_orig = re.sub(r'(color:\s*)0xa4b0be(.*?color:\s*)0xa4b0be', r'\1 0x00d2d3 \2 0x00d2d3', rabies_orig, flags=re.DOTALL)
rabies_orig = re.sub(r'(color:\s*)0xff4757', r'\1 0x6c5ce7', rabies_orig, flags=re.DOTALL)
js = re.sub(r'  buildRabies\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', rabies_orig, js, flags=re.DOTALL)


# 4. Restore HIV1, add makeOrganic, and color it (Magenta body 0xd980fa, Cyan stalk 0x12cbc4, Purple knob 0x5758bb)
hiv_orig = get_function(orig, 'buildHIV1')
hiv_orig = hiv_orig.replace('const envGeo = isCutaway', 'const envGeo = isCutaway') # anchor
hiv_orig = re.sub(r'(const envGeo = isCutaway\n.*?;\n)', r'\1      if (!isHologram && !isCutaway) this.makeOrganic(envGeo, 0.2, 4);\n', hiv_orig, flags=re.DOTALL)
hiv_orig = re.sub(r'(color:\s*)0x10ac84(.*?color:\s*)0x10ac84', r'\1 0xd980fa \2 0xd980fa', hiv_orig, flags=re.DOTALL)
hiv_orig = re.sub(r'(color:\s*)0x833471', r'\1 0x12cbc4', hiv_orig, flags=re.DOTALL)
hiv_orig = re.sub(r'(color:\s*)0x9980FA', r'\1 0x5758bb', hiv_orig, flags=re.DOTALL)
js = re.sub(r'  buildHIV1\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', hiv_orig, js, flags=re.DOTALL)


# 5. Restore HBV, ensure makeOrganic, and color it (Cyan body 0x00d2d3, Dark Blue spikes 0x0a3d62)
hbv_orig = get_function(orig, 'buildHBV')
hbv_orig = re.sub(r'(color:\s*)0xf1c40f(.*?color:\s*)0xffda79(.*?color:\s*)0xffda79', r'\1 0x00d2d3 \2 0x00d2d3 \3 0x00d2d3', hbv_orig, flags=re.DOTALL)
hbv_orig = re.sub(r'(color:\s*)0xd35400', r'\1 0x0a3d62', hbv_orig, flags=re.DOTALL)
js = re.sub(r'  buildHBV\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', hbv_orig, js, flags=re.DOTALL)


with open('js/virusModels.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Restored original complex geometries for T4, Ebola, Rabies, HIV, HBV with new colors.")
