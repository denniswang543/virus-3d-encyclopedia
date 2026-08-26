import re

data_path = r'd:\__AI\SLF\virus-3d\js\virusData.js'
with open(data_path, 'r', encoding='utf-8') as f:
    data = f.read()

new_data = """
  "polio": {
    id: "polio",
    name: "Poliovirus",
    chineseName: "小兒麻痺病毒 (Poliovirus)",
    scientificName: "Enterovirus C",
    family: "微小核糖核酸病毒科 (Picornaviridae)",
    category: "單股正鏈 RNA (+ssRNA)",
    sizeNm: 30,
    r0: "5 - 7",
    fatalityRate: "約 2-5% (兒童), 15-30% (成人) [若引發麻痺症狀]",
    transmission: "糞口途徑、飛沫傳染",
    receptor: "CD155 (PVR)",
    incubation: "7 - 14 天",
    symptoms: "多數無症狀，少數會發燒、頭痛、頸部僵硬，極少數（約1%）病毒會侵入中樞神經系統，破壞運動神經元，導致不可逆的肌肉麻痺，甚至因呼吸肌麻痺而死亡。",
    colorTheme: "#0984e3",
    accentColor: "#ff9f43",
    description: "曾是全球聞風喪膽的兒童殺手，引發「脊髓灰質炎（俗稱小兒麻痺症）」。它是一顆極其微小、無包膜的二十面體病毒，由 60 個蛋白質次單元拼湊出堅固的外殼。得益於沙克與沙賓疫苗的發明，目前全球野生型小兒麻痺病毒幾乎已被根除。",
    keyFeatures: [
      "無包膜的裸露正二十面體衣殼",
      "由 VP1, VP2, VP3, VP4 蛋白質構成的峽谷狀表面",
      "極耐胃酸，能在腸道環境中存活與繁殖"
    ],
    hotspots: [
      { id: "capsid", name: "二十面體衣殼 (Icosahedral Capsid)", position: [0, 0, 3], camPos: [0, 0, 6], desc: "由 60 個不對稱的蛋白質次單元緊密咬合而成，形成獨特的深谷結構，用來藏匿受體結合位點以躲避抗體。" },
      { id: "rna", name: "單股正鏈 RNA", position: [0, 0, 0], camPos: [0, 4, 4], requiresCutaway: true, desc: "一進入細胞即可直接作為 mRNA 進行轉譯，展現了極高的感染效率。" }
    ],
    clinicalRelevance: "小兒麻痺疫苗（IPV 或 OPV）是人類疫苗史上的偉大勝利，目前全球僅剩少數國家仍有野生株流行。"
  },
  "hcv": {
    id: "hcv",
    name: "Hepatitis C Virus (HCV)",
    chineseName: "C型肝炎病毒 (HCV)",
    scientificName: "Hepacivirus C",
    family: "黃病毒科 (Flaviviridae)",
    category: "單股正鏈 RNA (+ssRNA)",
    sizeNm: 50,
    r0: "N/A (非呼吸道傳染)",
    fatalityRate: "極低 (急性期), 但慢性化易導致肝硬化/肝癌",
    transmission: "血液傳播、共用針頭、母子垂直感染",
    receptor: "CD81, SR-BI, Claudin-1, Occludin",
    incubation: "2 - 26 週",
    symptoms: "急性期多無症狀。超過70%的感染者會轉為慢性肝炎，數十年後可能惡化為肝硬化或肝細胞癌 (HCC)。",
    colorTheme: "#00d2d3",
    accentColor: "#6c5ce7",
    description: "沉默的肝臟殺手，與 A型、B型肝炎完全不同，它是屬於黃病毒科的 RNA 病毒。它會將自己偽裝在血液中的脂蛋白 (Lipoprotein) 顆粒內，藉此逃避人體免疫系統。這使得開發 HCV 疫苗變得異常困難。",
    keyFeatures: [
      "脂質包膜內嵌有 E1 與 E2 醣蛋白異二聚體",
      "會與宿主的低密度脂蛋白 (VLDL/LDL) 結合形成脂質-病毒複合體 (Lipo-viro-particle)",
      "極高的基因突變率，存在多種基因型"
    ],
    hotspots: [
      { id: "envelope", name: "脂質包膜與刺突 (E1/E2)", position: [2.5, 0, 0], camPos: [5, 2, 0], desc: "E1 與 E2 醣蛋白負責辨識肝細胞表面受體，但經常被宿主的脂質分子遮蔽而難以被抗體中和。" },
      { id: "core", name: "核心蛋白與 RNA", position: [0, 0, 0], camPos: [0, 0, 5], requiresCutaway: true, desc: "內部包含著由核心蛋白包覆的單股 RNA，進入肝細胞後會在內質網上建立龐大的複製工廠。" }
    ],
    clinicalRelevance: "雖然目前沒有疫苗，但拜現代醫學之賜，新型的直接抗病毒藥物 (DAA) 已經可以達到 95% 以上的「完全治癒率」。"
  },
  "rubella": {
    id: "rubella",
    name: "Rubella Virus",
    chineseName: "德國麻疹病毒 (Rubella)",
    scientificName: "Rubivirus rubellae",
    family: "馬通病毒科 (Matonaviridae)",
    category: "單股正鏈 RNA (+ssRNA)",
    sizeNm: 60,
    r0: "3 - 9",
    fatalityRate: "極低",
    transmission: "飛沫傳染、接觸傳染、垂直感染",
    receptor: "Myelin Oligodendrocyte Glycoprotein (MOG)",
    incubation: "12 - 23 天",
    symptoms: "發燒、淋巴結腫大、全身出現淡紅色斑丘疹。對孕婦極度危險，可能導致胎兒嚴重的「先天性德國麻疹症候群 (CRS)」。",
    colorTheme: "#e84393",
    accentColor: "#fd79a8",
    description: "雖然被稱為「德國麻疹」，但它跟一般麻疹病毒沒有血緣關係。它的表面擁有明顯的棒狀刺突。兒童感染通常症狀輕微，但若孕婦在懷孕初期感染，極易導致胎兒耳聾、白內障、心臟病等嚴重先天性缺陷。",
    keyFeatures: [
      "脂質包膜表面佈滿由 E1 與 E2 蛋白組成的顯著刺突",
      "內部具有正二十面體對稱的核衣殼",
      "強烈的致畸胎性 (Teratogenicity)"
    ],
    hotspots: [
      { id: "spikes", name: "包膜刺突 (E1/E2)", position: [2.5, 2.5, 0], camPos: [5, 5, 0], desc: "由 E1 與 E2 醣蛋白組成的複合體，是病毒附著並入侵細胞膜的關鍵結構。" },
      { id: "nucleocapsid", name: "核衣殼 (Nucleocapsid)", position: [0, 0, 0], camPos: [0, 0, 4], requiresCutaway: true, desc: "由衣殼蛋白 (C protein) 與 RNA 纏繞而成，保護著遺傳密碼。" }
    ],
    clinicalRelevance: "廣泛接種 MMR 疫苗（麻疹、腮腺炎、德國麻疹混合疫苗）是預防及根除德國麻疹最有效的方法。"
  }
};
"""

data = data.replace('}\n};\n\n// 匯出全域變數供前端使用', '}\n,' + new_data + '\n\n// 匯出全域變數供前端使用')

with open(data_path, 'w', encoding='utf-8') as f:
    f.write(data)
print("Updated virusData.js")
