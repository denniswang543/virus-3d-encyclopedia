import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# For T4:
# Change mainColor to 0xff4757 (Red Head)
js = re.sub(r'const mainColor = isHologram \? 0xa55eea : 0x4834d4;', 'const mainColor = isHologram ? 0xa55eea : 0xff4757;', js)
# Change sheath and plate colors specifically.
# Let's just find the exact lines in virusModels.js and replace them:
js = js.replace('const sheathMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const sheathMat = new THREE.MeshStandardMaterial({ color: 0x3742fa')
js = js.replace('const plateMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const plateMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')
js = js.replace('const legMat = new THREE.MeshStandardMaterial({ color: accentColor', 'const legMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6')

# For Ebola:
# The user liked the shape in aaf7582 (CatmullRomCurve3 with "6" shape). We just need to change its color to pink 0xff4757.
# And maybe hide the small green spikes? The user said "不要把模型也變成像水彩畫", which implies they LIKE the realistic details. So I'll keep the green spikes, but change the main tube to pink.
js = re.sub(r'(buildEbola.*?color:\s*)0xf39c12(.*?color:\s*)0xf39c12', r'\1 0xff4757 \2 0xff4757', js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated T4 and Ebola")
