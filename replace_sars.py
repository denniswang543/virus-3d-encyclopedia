import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

with open('temp_original.js', 'r', encoding='utf-16') as f:
    orig = f.read()

def get_function(code, func_name):
    pattern = r'  ' + func_name + r'\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)'
    m = re.search(pattern, code, re.DOTALL)
    if m:
        return m.group(0)
    return None

sars_orig = get_function(orig, 'buildSARSCoV2')

if sars_orig:
    js = re.sub(r'  buildSARSCoV2\(mode = "surface"\) \{.*?(?=\n  build|\n    case |\n  createVirus)', sars_orig, js, flags=re.DOTALL)
    print("Replaced SARS-CoV-2")
else:
    print("Could not find SARS-CoV-2 in orig")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
