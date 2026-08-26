import os

data_path = r'd:\__AI\SLF\virus-3d\js\virusData.js'
with open(data_path, 'r', encoding='utf-8') as f:
    data = f.read()

vzv_data = """
  "vzv": {
    id: "vzv",
    name: "Varicella-Zoster Virus (VZV)",
    chineseName: "水痘-帶狀疱疹病毒 (VZV)",
    scientificName: "Human alphaherpesvirus 3",
    family: "疱疹病毒科 (Herpesviridae)",
    category: "雙股 DNA 病毒 (dsDNA)",
    sizeNm: 180,
    r0: "10.0 - 12.0",
    fatalityRate: "極低 (但成人與免疫缺乏者併發症多)",
    transmission: "空氣、飛沫傳播、直接接觸水泡體液",
    receptor: "IDE / Mannose-6-phosphate",
    incubation: "10 - 21 天",
    symptoms: "發燒、強烈搔癢、全身性紅疹與水泡。再活化則導致帶狀疱疹 (皮蛇) 伴隨劇烈神經痛。",
    colorTheme: "#ff4757",
    accentColor: "#ff708d",
    description: "引發水痘與皮蛇的雙面殺手，是傳染力最強的病毒之一。它擁有一個標準的正二十面體蛋白質衣殼，外層包覆著來自宿主細胞的脂質雙層包膜與多種醣蛋白。最狡猾的是，痊癒後它會潛伏在人體的感覺神經節中，等待免疫力下降時伺機而動。",
    keyFeatures: [
      "外層脂質雙層包膜佈滿 gE, gI, gB 等多種醣蛋白",
      "包膜與衣殼之間富含皮層 (Tegument) 蛋白質",
      "內部為正二十面體衣殼，包裹約 125 kb 線狀雙股 DNA",
      "具備沿著神經纖維逆行潛伏的特性"
    ],
    hotspots: [
      { id: "envelope", name: "脂質雙層包膜 (Envelope)", position: [2.5, 0, 2.5], camPos: [5, 2, 5], desc: "由宿主細胞膜衍生而來，表面佈滿病毒自行製造的醣蛋白 (如 gE)，是病毒附著與進入細胞的關鍵武器。" },
      { id: "tegument", name: "皮層蛋白區 (Tegument)", position: [1.8, 1.8, 0], camPos: [4, 4, 0], desc: "位於包膜與衣殼之間的無定形區域，富含多種病毒蛋白質，在感染初期能立刻釋放以癱瘓宿主的防禦機制。" },
      { id: "capsid", name: "二十面體衣殼 (Capsid)", position: [0, 0, 0], camPos: [0, 0, 5], requiresCutaway: true, desc: "由 162 個殼粒 (Capsomeres) 構成的極堅固正二十面體結構，負責在神經細胞內安全運送脆弱的 DNA。" }
    ],
    clinicalRelevance: "目前已有安全有效的水痘疫苗以及預防皮蛇的帶狀疱疹疫苗。對於重症或高風險族群，可使用 Acyclovir 等抗病毒藥物治療。"
  },
"""

if '"vzv"' not in data:
    parts = data.split('"hsv": {')
    data = parts[0] + vzv_data + '\n  "hsv": {' + parts[1]
    
    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(data)
print("Updated virusData.js")
