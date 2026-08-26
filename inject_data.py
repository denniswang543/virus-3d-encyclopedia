import os

data_path = r'd:\__AI\SLF\virus-3d\js\virusData.js'
with open(data_path, 'r', encoding='utf-8') as f:
    data = f.read()

new_data = """
  "adenovirus": {
    id: "adenovirus",
    name: "Adenovirus",
    chineseName: "腺病毒",
    scientificName: "Human mastadenovirus (Adenoviridae)",
    family: "腺病毒科",
    category: "雙股 DNA 病毒 (dsDNA)",
    sizeNm: 90,
    r0: "5.0 - 7.0",
    fatalityRate: "極低 (一般群體) / 高 (免疫缺乏者)",
    transmission: "飛沫、糞口途徑、接觸傳染 (如結膜炎)",
    receptor: "CAR (柯薩奇-腺病毒受體) / 整合素",
    incubation: "2 - 14 天",
    symptoms: "高燒不退、咽喉炎、結膜炎 (紅眼症)、腸胃炎、扁桃腺化膿。",
    colorTheme: "#00d2d3",
    accentColor: "#48dbfb",
    description: "台灣兒童界常見的『燒久姬』，容易引起反覆高燒。外觀為完美的二十面體，最大特徵是從 12 個頂點伸出的『五鄰體纖毛』(Penton fibers)，像衛星天線一樣用來附著宿主細胞。它是無包膜病毒，因此對環境抵抗力強，酒精難以完全殺死，建議用肥皂洗手或漂白水消毒。",
    keyFeatures: [
      "無脂質包膜的二十面體對稱幾何結構",
      "頂點延伸出帶有球狀末端的纖毛 (Fibers)，用於結合細胞",
      "內部含有約 36 kb 的線狀雙股 DNA 基因組"
    ],
    hotspots: [
      { id: "fiber", name: "五鄰體纖毛 (Penton Fiber)", position: [0, 4.2, 0], camPos: [0, 6, 7], desc: "突出於二十面體頂點的纖毛結構，末端有球狀突起 (Knob)，是病毒辨識與結合宿主細胞受體的關鍵。" },
      { id: "capsid", name: "六鄰體衣殼 (Hexon Capsid)", position: [1.5, 0, 3], camPos: [0, 0, 6], desc: "由 240 個六鄰體 (Hexon) 與 12 個五鄰體 (Penton) 組成的堅固蛋白質外殼，能抵抗酸性與膽汁環境。" },
      { id: "dna", name: "雙股 DNA 核心", position: [0, 0, 0], camPos: [0, 2, 4], requiresCutaway: true, desc: "線狀雙股 DNA，兩端結合有末端蛋白 (TP)，並與類組織蛋白緊密纏繞在核心內。" }
    ],
    clinicalRelevance: "目前無特效抗病毒藥物，以症狀治療為主。腺病毒也常被科學家用作基因治療或疫苗的載體 (例如 AZ 新冠疫苗就是使用黑猩猩腺病毒載體)。"
  },
  "enterovirus": {
    id: "enterovirus",
    name: "Enterovirus (EV71 / EV-D68)",
    chineseName: "腸病毒 (Enterovirus)",
    scientificName: "Enterovirus A-D (Picornaviridae)",
    family: "小RNA病毒科 (微小病毒科)",
    category: "正股單股 RNA (+ssRNA)",
    sizeNm: 30,
    r0: "5.0 - 6.0",
    fatalityRate: "極低 (一般型) / EV71重症約 1-3%",
    transmission: "糞口途徑、飛沫、接觸病灶分泌物",
    receptor: "SCARB2 / PSGL-1 (EV71)",
    incubation: "3 - 5 天",
    symptoms: "手足口病、疱疹性咽峽炎、發燒、肌躍型抽搐 (重症前兆)。",
    colorTheme: "#ff9f43",
    accentColor: "#feca57",
    description: "台灣夏季常見的幼兒殺手，包含多種型別 (如克沙奇病毒、伊可病毒與 EV71)。體積極小，直徑僅約 30 奈米。沒有脂質包膜，不怕胃酸與酒精。表面呈現二十面體對稱，並帶有星形的深溝 (Canyon)，用來隱藏受體結合位點躲避抗體。",
    keyFeatures: [
      "極微小的無包膜二十面體，直徑僅 30 奈米",
      "由 VP1~VP4 四種結構蛋白組成",
      "表面具有峽谷狀深溝 (Canyons)"
    ],
    hotspots: [
      { id: "canyon", name: "峽谷結構 (Canyon)", position: [1, 1, 1.2], camPos: [2, 2, 3], desc: "位於表面蛋白質之間的深溝，病毒將受體結合位點藏於此處，使體積較大的抗體難以進入中和。" },
      { id: "vp1", name: "VP1 結構蛋白", position: [0, 1.5, 0], camPos: [0, 3, 3], desc: "構成衣殼的主要蛋白之一，也是腸病毒血清型分類與疫苗開發的主要抗原標靶。" },
      { id: "rna", name: "單股 RNA 基因組", position: [0, 0, 0], camPos: [0, 1, 2], requiresCutaway: true, desc: "約 7.4 kb 的正股 RNA，進入細胞後可直接作為 mRNA 轉譯出多聚蛋白並切割成功能單元。" }
    ],
    clinicalRelevance: "對酒精與一般清潔劑有抗性，需使用稀釋漂白水消毒。台灣已有自主研發的 EV71 疫苗上市，可有效預防最易引發重症的型別。"
  },
  "rhinovirus": {
    id: "rhinovirus",
    name: "Rhinovirus (HRV)",
    chineseName: "鼻病毒",
    scientificName: "Human rhinovirus",
    family: "小RNA病毒科 (微小病毒科)",
    category: "正股單股 RNA (+ssRNA)",
    sizeNm: 30,
    r0: "2.0 - 6.0",
    fatalityRate: "極低",
    transmission: "飛沫傳播、直接或間接接觸傳染",
    receptor: "ICAM-1 / LDLR",
    incubation: "1 - 3 天",
    symptoms: "流鼻水、打噴嚏、鼻塞、喉嚨痛 (一般感冒最常見病原)。",
    colorTheme: "#1dd1a1",
    accentColor: "#10ac84",
    description: "人類一般感冒 (Common Cold) 最常見的罪魁禍首，已知有超過 160 種血清型。結構上與腸病毒非常相似，同屬小 RNA 病毒科。它喜歡在 33°C 左右的環境複製，這正好是人類鼻腔的溫度，因此得名鼻病毒。",
    keyFeatures: [
      "微小、無包膜的二十面體蛋白質外殼",
      "表面佈滿抗原變異極大的突起與峽谷",
      "適應 33°C 低溫繁殖 (鼻腔溫度)"
    ],
    hotspots: [
      { id: "capsid", name: "微小衣殼 (Small Capsid)", position: [1.2, 0, 0], camPos: [3, 0, 0], desc: "由 60 個原體組成的堅固二十面體，每個原體包含 VP1, VP2, VP3, VP4。變異極快，難以開發通用疫苗。" },
      { id: "rna", name: "感染性 RNA", position: [0, 0, 0], camPos: [0, 1.5, 2], requiresCutaway: true, desc: "小巧的 7.2 kb 正股單股 RNA，進入鼻腔上皮細胞後能迅速劫持核糖體製造更多病毒。" }
    ],
    clinicalRelevance: "因為血清型過多且變異快，至今無有效疫苗。感染後只會產生短暫且具特異性的免疫力，這也是為什麼人一生中會不斷得感冒的原因。"
  },
  "influenza-b": {
    id: "influenza-b",
    name: "Influenza B",
    chineseName: "B型流感病毒",
    scientificName: "Betainfluenzavirus",
    family: "正黏液病毒科",
    category: "負股分節 RNA (-ssRNA, 8 segments)",
    sizeNm: 100,
    r0: "1.0 - 1.5",
    fatalityRate: "約 0.01% - 0.1%",
    transmission: "飛沫、接觸傳染",
    receptor: "唾液酸 (Sialic acid)",
    incubation: "1 - 4 天",
    symptoms: "突發高燒、全身肌肉痠痛、極度疲倦、咳嗽，偶伴隨小腿肚痠痛 (兒童常見)。",
    colorTheme: "#54a0ff",
    accentColor: "#2e86de",
    description: "與 A 流不同，B型流感主要只在人類之間傳播，雖然不會引發全球大流行，但在地區性季節流感中經常佔有一席之地。它的變異速度比 A 流慢，目前主要分為維多利亞 (Victoria) 與山形 (Yamagata) 兩大譜系。外觀同樣佈滿血球凝集素(HA)與神經胺酸酶(NA)。",
    keyFeatures: [
      "脂質包膜外層佈滿 HA 與 NA 糖蛋白刺突",
      "獨有的 BM2 離子通道蛋白 (A流為M2)",
      "內部為 8 條分節的負股 RNA 基因組"
    ],
    hotspots: [
      { id: "ha", name: "血球凝集素 (HA)", position: [3, 0, 0], camPos: [6, 0, 2], desc: "B流的 HA 蛋白同樣負責結合細胞表面的唾液酸受體，但其受體結合特性與抗原結構與 A 流有所不同。" },
      { id: "na", name: "神經胺酸酶 (NA)", position: [0, 3, 0], camPos: [0, 6, 2], desc: "負責切割受體讓新生的病毒脫離宿主細胞，克流感 (Tamiflu) 等藥物就是抑制這個酵素的作用。" },
      { id: "rnps", name: "8 段核糖核蛋白 (vRNP)", position: [0, 0, 0], camPos: [0, 3, 5], requiresCutaway: true, desc: "包含 8 條負股 RNA 片段，雖然 B 流較少發生基因重排 (Reassortment)，但仍會透過抗原漂移 (Drift) 產生新流行株。" }
    ],
    clinicalRelevance: "目前的四價流感疫苗包含兩種 A 型與兩種 B 型 (Victoria 與 Yamagata) 病毒株，提供全面防護。抗病毒藥物如克流感對 B 流同樣有效。"
  },
"""

if '"adenovirus"' not in data:
    parts = data.split('"sars-cov-2": {')
    data = parts[0] + new_data + '\n  "sars-cov-2": {' + parts[1]
    
    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(data)

print("Updated virusData.js")
