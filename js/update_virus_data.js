const fs = require('fs');
const path = require('path');

const virusDataPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusData.js');
let code = fs.readFileSync(virusDataPath, 'utf8');

// Symptoms to add to existing
const existingSymptoms = {
  "sars-cov-2": "發燒、乾咳、疲勞、失去味覺/嗅覺、呼吸困難。",
  "mpox": "發燒、劇烈頭痛、淋巴結腫大、背痛、肌肉酸痛、特異性水泡膿疱皮疹。",
  "influenza-a": "突發高燒、咳嗽、喉嚨痛、肌肉酸痛、疲勞、流鼻水。",
  "bacteriophage-t4": "無人體臨床症狀（專注感染大腸桿菌）。",
  "ebola": "突發高燒、極度疲勞、肌肉痛、頭痛、咽痛，隨後出現嘔吐、腹瀉、皮疹及內外出血。",
  "dengue": "突發高燒、劇烈頭痛、眼後痛、肌肉與關節痛（斷骨熱）、噁心、嘔吐、皮疹。",
  "rabies": "初期發燒、傷口刺痛；晚期出現恐水症、狂躁、恐風、吞嚥困難、癱瘓、昏迷。",
  "hiv-1": "急性期似流感症狀（發燒、喉嚨痛、淋巴腫）；晚期（AIDS）引發各種伺機性感染（肺囊蟲肺炎、卡波西氏肉瘤等）。"
};

const newViruses = {
  "hbv": {
    id: "hbv",
    name: "Hepatitis B Virus (HBV)",
    chineseName: "B型肝炎病毒",
    scientificName: "Hepatitis B virus",
    family: "嗜肝DNA病毒科 (Hepadnaviridae)",
    category: "部分雙股環狀DNA (rcDNA)",
    sizeNm: 42,
    r0: "NA (主要經血液及體液傳播)",
    fatalityRate: "急性期<1%，慢性肝硬化/肝癌風險高",
    transmission: "母嬰垂直傳染、血液、體液、性接觸",
    receptor: "NTCP (牛磺膽酸鈉共轉運多肽)",
    incubation: "60 - 150 天",
    colorTheme: "#f1c40f",
    accentColor: "#f39c12",
    description: "引起全球慢性肝炎與肝癌的主要元兇。完整的病毒顆粒稱為戴恩顆粒 (Dane particle)，表面富含 HBsAg 表面抗原，內部衣殼包覆著特殊的部分雙鏈環狀DNA與自帶的聚合酶。",
    symptoms: "黃疸（皮膚及眼白發黃）、極度疲勞、噁心、嘔吐、腹痛、茶色尿。",
    keyFeatures: [
      "Dane particle (42nm) 為具感染力的完整病毒體",
      "外膜含有大量 HBsAg (表面抗原)，也會產生大量無核酸的亞病毒顆粒",
      "特殊的 rcDNA (部分雙鏈環狀DNA)，在細胞核內轉為 cccDNA",
      "具有逆轉錄過程，為嗜肝DNA病毒的特徵"
    ],
    hotspots: [
      {
        id: "hbsag",
        name: "HBsAg 表面抗原 (Surface Antigen)",
        position: [0, 2.5, 0],
        camPos: [0, 4, 5],
        desc: "存在於病毒包膜表面的主要蛋白，是 B 肝疫苗的成分與臨床檢測的關鍵指標。"
      },
      {
        id: "core_antigen",
        name: "HBcAg 核心衣殼 (Capsid)",
        position: [0, 0, 0],
        camPos: [0, 1.5, 4],
        requiresCutaway: true,
        desc: "二十面體衣殼，內部包裹著不完整的 rcDNA 與病毒聚合酶。"
      }
    ],
    clinicalRelevance: "有效預防依賴 B 肝疫苗。慢性感染可使用干擾素或口服抗病毒藥物 (如 Entecavir, Tenofovir) 控制。"
  },
  "zika": {
    id: "zika",
    name: "Zika Virus",
    chineseName: "茲卡病毒",
    scientificName: "Zika virus",
    family: "黃病毒科 (Flaviviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 50,
    r0: "1.4 - 6.6 (蚊蟲叮咬)",
    fatalityRate: "極低 (主要威脅為孕婦感染致胎兒小頭畸形)",
    transmission: "斑蚊叮咬、性接觸、母嬰垂直傳染、輸血",
    receptor: "AXL, TIM-1 等受體",
    incubation: "3 - 14 天",
    colorTheme: "#e84393",
    accentColor: "#fd79a8",
    description: "與登革熱病毒結構高度相似，表面光滑呈二十面體。雖然多數成人感染症狀輕微，但若孕婦感染，病毒可穿過胎盤引發嚴重的胎兒神經發育異常（小頭畸形）。",
    symptoms: "輕微發燒、皮疹、結膜炎（紅眼）、肌肉和關節痛、全身倦怠。",
    keyFeatures: [
      "成熟顆粒表面由 180 個 E 糖蛋白平滑排列成人字形",
      "能在神經祖細胞中高效複製，導致神經發育受損",
      "可透過精液長期存留並經由性行為傳播"
    ],
    hotspots: [
      {
        id: "zika_e_protein",
        name: "茲卡 E 蛋白 (E Protein)",
        position: [0, 2.6, 0],
        camPos: [0, 4, 5],
        desc: "平滑覆蓋病毒表面的糖蛋白，負責受體結合與膜融合。"
      }
    ],
    clinicalRelevance: "目前尚無特效藥與核准疫苗。孕婦應避免前往疫區，並作好防蚊措施。"
  },
  "rotavirus": {
    id: "rotavirus",
    name: "Rotavirus",
    chineseName: "輪狀病毒",
    scientificName: "Rotavirus",
    family: "呼腸孤病毒科 (Reoviridae)",
    category: "雙股分節 RNA (dsRNA, 11 segments)",
    sizeNm: 75,
    r0: "高達 15 - 18",
    fatalityRate: "在開發中國家嬰幼兒中致死率較高 (脫水導致)",
    transmission: "糞口傳染、接觸受污染表面",
    receptor: "唾液酸, 組織血型抗原 (HBGA)",
    incubation: "2 天",
    colorTheme: "#0984e3",
    accentColor: "#74b9ff",
    description: "全球嬰幼兒嚴重腹瀉最常見的原因。外觀酷似車輪 (Rota)，具有獨特的三層同心蛋白質衣殼，保護內部 11 段雙鏈 RNA 免受胃酸及腸道酵素破壞。",
    symptoms: "嚴重水瀉、嘔吐、發燒、腹痛，易導致嬰幼兒嚴重脫水。",
    keyFeatures: [
      "無脂質包膜，具有堅固的三層衣殼 (TLP, Triple-Layered Particle)",
      "外層含有 VP7 (G蛋白) 與突出的 VP4 (P蛋白) 刺突",
      "基因組為 11 條雙股 RNA (dsRNA)"
    ],
    hotspots: [
      {
        id: "vp4_spike",
        name: "VP4 刺突 (VP4 Spikes)",
        position: [3, 2, 0],
        camPos: [4, 3, 5],
        desc: "突出的刺狀蛋白，經過腸道胰蛋白酶切割後增強感染力，負責細胞吸附。"
      },
      {
        id: "triple_capsid",
        name: "三層衣殼 (Triple-Layered Capsid)",
        position: [0, 0, 0],
        camPos: [0, 2, 4],
        requiresCutaway: true,
        desc: "外層 VP7、中層 VP6、內層 VP2，提供極強的環境耐受力。"
      }
    ],
    clinicalRelevance: "口服輪狀病毒疫苗 (如 Rotarix, RotaTeq) 能有效預防重症。治療主要為口服補液鹽 (ORS) 補充水分與電解質。"
  },
  "hsv": {
    id: "hsv",
    name: "Herpes Simplex Virus (HSV)",
    chineseName: "單純皰疹病毒",
    scientificName: "Human alphaherpesvirus 1/2",
    family: "皰疹病毒科 (Herpesviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 200,
    r0: "NA (終身潛伏，復發時具傳染性)",
    fatalityRate: "極低 (少數引發皰疹性腦炎則高風險)",
    transmission: "直接接觸感染者的皮膚病灶、唾液、生殖器分泌物",
    receptor: "硫酸乙醯肝素, Nectin-1, HVEM",
    incubation: "2 - 12 天",
    colorTheme: "#d63031",
    accentColor: "#ff7675",
    description: "HSV-1 主要引起唇皰疹，HSV-2 主要引起生殖器皰疹。病毒顆粒龐大複雜，具有脂質包膜、厚實的『皮層』(Tegument) 與二十面體衣殼。感染後會終身潛伏於神經節中。",
    symptoms: "群聚性水泡或潰瘍、疼痛、發燒、淋巴結腫大（復發時多為局部水泡）。",
    keyFeatures: [
      "複雜的四層結構：包膜、皮層 (Tegument)、衣殼、DNA 核心",
      "皮層包含多種蛋白質，在感染初期即時抑制宿主免疫並啟動轉錄",
      "能建立潛伏感染 (Latency)，在免疫力低下時重新活化"
    ],
    hotspots: [
      {
        id: "tegument",
        name: "皮層 (Tegument)",
        position: [0, 1.5, 0],
        camPos: [0, 2, 4],
        requiresCutaway: true,
        desc: "位於包膜與衣殼之間的無定形蛋白層，含有豐富的病毒蛋白 (如 VP16) 供感染早期使用。"
      },
      {
        id: "hsv_capsid",
        name: "二十面體衣殼 (Icosahedral Capsid)",
        position: [0, 0, 0],
        camPos: [0, 0, 3],
        requiresCutaway: true,
        desc: "堅固的 162 個殼粒組成的衣殼，包裹著超過 150 kb 的線狀雙鏈 DNA。"
      }
    ],
    clinicalRelevance: "抗病毒藥物如 Acyclovir 及其衍生物可抑制 DNA 聚合酶，減輕症狀並縮短病程，但無法根治潛伏感染。"
  },
  "norovirus": {
    id: "norovirus",
    name: "Norovirus",
    chineseName: "諾羅病毒",
    scientificName: "Norwalk virus",
    family: "杯狀病毒科 (Caliciviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 38,
    r0: "2.0 - 7.0",
    fatalityRate: "極低 (主要風險為脫水)",
    transmission: "糞口傳染、受污染之水/食物 (如生蠔)、氣溶膠",
    receptor: "組織血型抗原 (HBGA)",
    incubation: "12 - 48 小時",
    colorTheme: "#6c5ce7",
    accentColor: "#a29bfe",
    description: "被稱為『冬季嘔吐症』的病原體，具極高傳染力，只需不到 100 個病毒顆粒即可致病。無包膜，二十面體衣殼表面佈滿獨特的『杯狀』(Calix) 凹陷結構，對酒精消毒有高度抵抗力。",
    symptoms: "突發性猛烈嘔吐、水樣腹瀉、噁心、腹痛、微熱。",
    keyFeatures: [
      "無包膜微小病毒，表面由 VP1 主要衣殼蛋白組成",
      "表面呈現多個明顯的杯狀凹陷，為杯狀病毒科特徵",
      "極耐環境壓力，一般酒精乾洗手無法有效消滅"
    ],
    hotspots: [
      {
        id: "cup_depressions",
        name: "杯狀凹陷 (Cup-like Depressions)",
        position: [0, 1.8, 0],
        camPos: [0, 2.5, 3.5],
        desc: "衣殼表面特有的凹陷結構，這也是其所屬『杯狀病毒科』命名的由來。"
      }
    ],
    clinicalRelevance: "無特效藥與疫苗。預防需依賴徹底的『肥皂洗手』與漂白水環境消毒，酒精消毒效果極差。"
  },
  "hpv": {
    id: "hpv",
    name: "Human Papillomavirus (HPV)",
    chineseName: "人類乳突病毒",
    scientificName: "Human papillomavirus",
    family: "乳突病毒科 (Papillomaviridae)",
    category: "雙鏈環狀 DNA (dsDNA)",
    sizeNm: 55,
    r0: "NA (親密接觸與性接觸為主)",
    fatalityRate: "病毒本身不致死，但高危險型 (16, 18) 會引發子宮頸癌等多種癌症",
    transmission: "皮膚與黏膜的直接接觸 (主要為性行為)",
    receptor: "硫酸乙醯肝素、Integrins",
    incubation: "數週至數月，甚至潛伏數年",
    colorTheme: "#00b894",
    accentColor: "#55efc4",
    description: "最常見的性傳染病原體之一。無包膜，外觀像一個佈滿星星狀突起的球體，由 72 個星形五聚體 (L1 蛋白) 組成。高危險型 HPV 的 E6 與 E7 蛋白會破壞人體抑癌基因，導致細胞癌化。",
    symptoms: "多數無症狀；部分引起生殖器疣（菜花）或一般皮膚疣；高危險型感染長期可能發展為癌症。",
    keyFeatures: [
      "72 個五聚體 (Capsomeres) 構成星狀排列的二十面體衣殼",
      "環狀雙鏈 DNA 約 8 kb，編碼 E (早期) 與 L (晚期) 蛋白",
      "E6 蛋白降解 p53，E7 蛋白結合 pRb，為誘發癌症的關鍵機制"
    ],
    hotspots: [
      {
        id: "l1_pentamer",
        name: "L1 五聚體 (L1 Pentamers)",
        position: [2, 1.5, 0],
        camPos: [3, 2, 4],
        desc: "構成星形外觀的主要衣殼蛋白，也是目前 HPV 預防性疫苗 (如 Gardasil) 使用的抗原 VLP。"
      }
    ],
    clinicalRelevance: "HPV 疫苗 (九價等) 可極有效預防高危險型感染及子宮頸癌。常規子宮頸抹片檢查可早期發現病變。"
  },
  "measles": {
    id: "measles",
    name: "Measles Virus",
    chineseName: "麻疹病毒",
    scientificName: "Measles morbillivirus",
    family: "副黏液病毒科 (Paramyxoviridae)",
    category: "不分節負鏈單股 RNA (-ssRNA)",
    sizeNm: 150,
    r0: "12 - 18 (極具傳染性)",
    fatalityRate: "0.1% - 0.2% (營養不良兒童或免疫低下者可達 10%)",
    transmission: "空氣傳播 (氣溶膠)、飛沫、直接接觸分泌物",
    receptor: "CD150 (SLAM), Nectin-4",
    incubation: "10 - 14 天",
    colorTheme: "#e15f41",
    accentColor: "#f3a683",
    description: "已知傳染力最強的人類病毒之一，也是引發麻疹的元兇。呈球形或多形性，包膜表面佈滿血凝素 (H) 與融合蛋白 (F) 刺突。感染會導致『免疫失憶』，清除人體過去建立的抗體庫。",
    symptoms: "高燒、咳嗽、流鼻水、結膜炎，口腔出現柯氏斑（Koplik spots），隨後全身出現紅疹。",
    keyFeatures: [
      "表面具有 H 蛋白 (負責受體結合) 與 F 蛋白 (負責膜融合與形成多核巨細胞)",
      "內部為連續螺旋狀的核糖核蛋白體 (RNP)",
      "能感染並破壞記憶 B 細胞與 T 細胞，導致長達數月的免疫失憶效應"
    ],
    hotspots: [
      {
        id: "h_f_spikes",
        name: "H & F 糖蛋白刺突 (H & F Spikes)",
        position: [0, 3.5, 0],
        camPos: [0, 4.5, 5],
        desc: "H 蛋白負責結合受體，F 蛋白則像彈簧刀般觸發細胞融合，使得受感染細胞融合成巨大的多核巨細胞 (Syncytia)。"
      },
      {
        id: "helical_rnps",
        name: "螺旋狀 RNA 核衣殼 (Helical RNP)",
        position: [0, 0, 0],
        camPos: [0, 2, 4],
        requiresCutaway: true,
        desc: "不分段的單股負鏈 RNA，與 N 蛋白緊密結合，形狀如同柔軟盤繞的彈簧。"
      }
    ],
    clinicalRelevance: "MMR (麻疹、腮腺炎、德國麻疹) 混合疫苗極其有效，提供長效終身免疫。無特定抗病毒藥物，以支持性療法為主。"
  }
};

// Insert symptoms into existing viruses
for (const key in existingSymptoms) {
  const regex = new RegExp("(\"" + key + "\":\\s*\\{[\\s\\S]*?incubation:\\s*\".*?\",)");
  code = code.replace(regex, "$1\n    symptoms: \"" + existingSymptoms[key] + "\",");
}

// Append new viruses to VIRUS_DATABASE
const closingBraceIndex = code.lastIndexOf('};');
let newVirusesStr = '';
for (const key in newViruses) {
  newVirusesStr += ",\n\n  \"" + key + "\": " + JSON.stringify(newViruses[key], null, 4);
}

// Fix object stringification to match JS code formatting for functions/arrays (it's pure JSON here so JSON.stringify is fine, just remove quotes around keys if desired, but quotes are valid JS).
code = code.substring(0, closingBraceIndex) + newVirusesStr + '\n' + code.substring(closingBraceIndex);

fs.writeFileSync(virusDataPath, code, 'utf8');
console.log('virusData.js updated successfully.');
