import os

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

replacement = """  createVirus(virusId, mode = "surface") {
    switch (virusId) {
        case "vzv":"""

js = js.replace('case "vzv":', replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Fixed syntax")
