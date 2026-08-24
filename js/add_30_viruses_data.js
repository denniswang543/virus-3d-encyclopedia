const fs = require('fs');
const path = require('path');

const virusDataPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusData.js');
let code = fs.readFileSync(virusDataPath, 'utf8');

const newViruses = {
  "hcv": {
    id: "hcv",
    name: "Hepatitis C Virus (HCV)",
    chineseName: "C型肝炎病毒",
    scientificName: "Hepacivirus C",
    family: "黃病毒科 (Flaviviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 50,
    r0: "NA (血液傳播)",
    fatalityRate: "急性期低，但易轉慢性導致肝硬化/肝癌",
    transmission: "血液、共用針頭、母嬰垂直傳播",
    receptor: "CD81, SR-BI, Claudin-1, Occludin",
    incubation: "14 - 180 天",
    colorTheme: "#ffb142",
    accentColor: "#ffda79",
    description: "引起C型肝炎的病原體。不同於 B 肝，C 肝病毒具有極高的基因變異性，因此難以開發疫苗。其表面由 E1 與 E2 糖蛋白異二聚體組成。",
    symptoms: "多數無症狀；部分出現黃疸、疲倦、食慾不振、噁心。",
    keyFeatures: [
      "帶有脂質包膜的小型球形病毒",
      "外膜嵌有 E1 與 E2 糖蛋白",
      "在血液中常與脂蛋白結合形成『脂質-病毒顆粒 (Lipo-viro-particle)』"
    ],
    hotspots: [
      { id: "hcv_e1e2", name: "E1/E2 糖蛋白複合體", position: [0, 2.5, 0], camPos: [0, 4, 5], desc: "負責辨識肝細胞表面受體並介導進入。" }
    ],
    clinicalRelevance: "目前無疫苗。但直接抗病毒藥物 (DAA) 治癒率已高達 95% 以上。"
  },
  "poliovirus": {
    id: "poliovirus",
    name: "Poliovirus",
    chineseName: "小兒麻痺病毒",
    scientificName: "Enterovirus C",
    family: "微小核糖核酸病毒科 (Picornaviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 30,
    r0: "5.0 - 7.0",
    fatalityRate: "2% - 5% (兒童) / 15% - 30% (成人)，在出現麻痺症狀者中",
    transmission: "糞口傳染、飛沫",
    receptor: "CD155 (PVR)",
    incubation: "3 - 35 天",
    colorTheme: "#34ace0",
    accentColor: "#70a1ff",
    description: "引發脊髓灰質炎 (小兒麻痺症) 的病原體。無包膜，具有非常小且堅固的二十面體衣殼，能在環境與胃酸中長時間存活。",
    symptoms: "發燒、頭痛、肌肉疼痛，少數患者出現不可逆的肢體麻痺（如腿部萎縮）。",
    keyFeatures: [
      "極微小的無包膜病毒 (約 30nm)",
      "衣殼由 VP1-VP4 四種蛋白組成，形成深深的『峽谷 (Canyon)』結構供受體結合"
    ],
    hotspots: [
      { id: "polio_canyon", name: "受體結合峽谷 (Canyon)", position: [0, 1.5, 0], camPos: [0, 2, 4], desc: "衣殼表面的凹槽，能特異性結合人體 CD155 受體。" }
    ],
    clinicalRelevance: "沙賓 (口服活毒) 與沙克 (注射死毒) 疫苗已使該疾病在全球瀕臨根除。"
  },
  "marburg": {
    id: "marburg",
    name: "Marburg Virus",
    chineseName: "馬堡病毒",
    scientificName: "Marburg marburgvirus",
    family: "絲狀病毒科 (Filoviridae)",
    category: "不分節負鏈單股 RNA (-ssRNA)",
    sizeNm: 800,
    r0: "1.5 - 2.0",
    fatalityRate: "24% - 88%",
    transmission: "果蝠接觸、人傳人 (血液、體液直接接觸)",
    receptor: "NPC1",
    incubation: "2 - 21 天",
    colorTheme: "#b33939",
    accentColor: "#ff5252",
    description: "與伊波拉病毒同屬絲狀病毒，外觀亦呈細長絲狀或鉤狀。首次於德國馬堡的實驗室爆發中被發現，引發極為嚴重的出血熱。",
    symptoms: "高燒、劇烈頭痛、肌肉痛，隨後出現嚴重水狀腹瀉、嘔吐與致命性大出血。",
    keyFeatures: [
      "多形性絲狀外觀，常捲曲成 U 型或 6 字型",
      "外膜密佈糖蛋白 (GP)，引發強烈的免疫風暴與血管內皮破壞"
    ],
    hotspots: [
      { id: "marburg_hook", name: "絲狀彎曲末端", position: [0, 3.5, 0], camPos: [0, 4.5, 6], desc: "與伊波拉相似的典型絲狀病毒幾何特徵。" }
    ],
    clinicalRelevance: "目前尚無核准的特效抗病毒藥物或疫苗，以嚴格隔離與支持性療法為主。"
  },
  "rsv": {
    id: "rsv",
    name: "Respiratory Syncytial Virus (RSV)",
    chineseName: "呼吸道融合病毒",
    scientificName: "Human orthopneumovirus",
    family: "肺炎病毒科 (Pneumoviridae)",
    category: "負鏈單股 RNA (-ssRNA)",
    sizeNm: 150,
    r0: "3.0 - 4.5",
    fatalityRate: "極低，但對早產兒與老年人威脅大",
    transmission: "飛沫、接觸呼吸道分泌物",
    receptor: "Nucleolin, CX3CR1",
    incubation: "4 - 6 天",
    colorTheme: "#33d9b2",
    accentColor: "#34ace0",
    description: "全球嬰幼兒細支氣管炎及肺炎的最主要原因。感染細胞後會促使相鄰細胞融合，形成巨大的多核細胞 (Syncytia)。",
    symptoms: "流鼻水、發燒、咳嗽、喘鳴（呼吸發出咻咻聲）、呼吸急促。",
    keyFeatures: [
      "多形性包膜病毒，表面分佈 F (融合) 與 G (附著) 糖蛋白",
      "F 蛋白在病毒進入細胞及細胞間融合中扮演關鍵角色"
    ],
    hotspots: [
      { id: "rsv_f_protein", name: "F 融合蛋白 (F Protein)", position: [0, 2.5, 0], camPos: [0, 3.5, 5], desc: "促使細胞膜融合的關鍵，是近期 RSV 疫苗與單株抗體的主要標靶。" }
    ],
    clinicalRelevance: "近年已有針對長者與孕婦的 RSV 疫苗 (Arexvy, Abrysvo) 以及預防嬰幼兒感染的單株抗體 (Nirsevimab) 獲准上市。"
  },
  "ebv": {
    id: "ebv",
    name: "Epstein-Barr Virus (EBV)",
    chineseName: "EB 病毒",
    scientificName: "Human gammaherpesvirus 4",
    family: "皰疹病毒科 (Herpesviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 150,
    r0: "NA (唾液傳播)",
    fatalityRate: "極低",
    transmission: "唾液 (接吻病)、共用飲食器具",
    receptor: "CD21 (B細胞), Integrins",
    incubation: "4 - 6 週",
    colorTheme: "#706fd3",
    accentColor: "#474787",
    description: "最常見的人類病毒之一，主要感染 B 淋巴細胞。初次感染可能引發傳染性單核白血球增多症 (接吻病)，且與鼻咽癌及伯基特淋巴瘤等多種癌症相關。",
    symptoms: "發燒、極度疲勞、喉嚨痛、頸部淋巴結腫大、脾臟腫大。",
    keyFeatures: [
      "典型皰疹病毒結構 (包膜、皮層、二十面體衣殼)",
      "能在 B 細胞中建立潛伏感染，具有致癌性 (Oncovirus)"
    ],
    hotspots: [
      { id: "ebv_tegument", name: "皮層與衣殼", position: [0, 0, 0], camPos: [0, 1.5, 4], requiresCutaway: true, desc: "厚實的皮層包裹著含有 dsDNA 的二十面體核心。" }
    ],
    clinicalRelevance: "目前無疫苗。大多數人成年時已感染並終身帶原。"
  },
  "vzv": {
    id: "vzv",
    name: "Varicella-Zoster Virus (VZV)",
    chineseName: "水痘-帶狀皰疹病毒",
    scientificName: "Human alphaherpesvirus 3",
    family: "皰疹病毒科 (Herpesviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 180,
    r0: "10 - 12 (水痘極具傳染性)",
    fatalityRate: "極低",
    transmission: "空氣飛沫、直接接觸水泡體液",
    receptor: "IDE, Mannose 6-phosphate receptor",
    incubation: "14 - 16 天",
    colorTheme: "#ff5252",
    accentColor: "#ff793f",
    description: "初次感染引起『水痘』，隨後病毒潛伏於背根神經節。當年老或免疫力下降時，病毒可能重新活化，沿著神經皮節引發劇痛的『帶狀皰疹』(俗稱皮蛇)。",
    symptoms: "水痘：全身發癢的水泡紅疹、發燒。帶狀皰疹：單側帶狀分佈的水泡、劇烈神經痛。",
    keyFeatures: [
      "典型皰疹病毒結構，能在感覺神經節中長期潛伏",
      "水痘階段具高度傳染力，帶狀皰疹則傳染力較低"
    ],
    hotspots: [
      { id: "vzv_envelope", name: "含糖蛋白的外膜", position: [0, 2.5, 0], camPos: [0, 4, 5], desc: "外膜上的糖蛋白 gE、gB 等是免疫系統辨識的關鍵。" }
    ],
    clinicalRelevance: "有水痘疫苗 (預防初次感染) 及帶狀皰疹疫苗 (如 Shingrix，預防復發與神經痛)。"
  },
  "cmv": {
    id: "cmv",
    name: "Cytomegalovirus (CMV)",
    chineseName: "巨細胞病毒",
    scientificName: "Human betaherpesvirus 5",
    family: "皰疹病毒科 (Herpesviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 200,
    r0: "NA",
    fatalityRate: "對健康者無害；對免疫缺陷者及胎兒可致命",
    transmission: "體液 (唾液、尿液、血液、母乳)、母嬰垂直傳染",
    receptor: "EGFR, Integrins",
    incubation: "3 - 12 週",
    colorTheme: "#227093",
    accentColor: "#34ace0",
    description: "感染後會使細胞體積異常增大 (巨細胞化) 的皰疹病毒。對一般人多無症狀，但卻是器官移植患者及愛滋病患者最危險的伺機性感染源，也是先天性感染導致新生兒聽損及智障的主因。",
    symptoms: "多數無症狀；免疫低下者可引發視網膜炎、肺炎；胎兒感染致小頭畸形、聽力喪失。",
    keyFeatures: [
      "所有人類皰疹病毒中基因組最大 (約 230 kb)",
      "感染細胞內可見特徵性的『貓頭鷹眼 (Owl's eye)』核內包涵體"
    ],
    hotspots: [
      { id: "cmv_core", name: "巨大 DNA 核心", position: [0, 0, 0], camPos: [0, 1.5, 4], requiresCutaway: true, desc: "攜帶極龐大遺傳信息的衣殼核心，能編碼多種免疫逃避蛋白。" }
    ],
    clinicalRelevance: "孕婦需特別注意防範。免疫低下患者可使用 Ganciclovir 等抗病毒藥物治療。"
  },
  "yellow-fever": {
    id: "yellow-fever",
    name: "Yellow Fever Virus",
    chineseName: "黃熱病毒",
    scientificName: "Yellow fever virus",
    family: "黃病毒科 (Flaviviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 50,
    r0: "NA (蚊媒傳播)",
    fatalityRate: "20% - 50% (進入重症期者)",
    transmission: "埃及斑蚊等病媒蚊叮咬",
    receptor: "未完全明確 (可能含 TIM/TAM 等)",
    incubation: "3 - 6 天",
    colorTheme: "#fbc531",
    accentColor: "#e1b12c",
    description: "黃病毒科的代表模式病毒，歷史上曾引發多次毀滅性大流行。其名稱源自重症患者常見的嚴重黃疸症狀 (肝功能受損)。外觀與登革熱病毒幾乎相同。",
    symptoms: "突發高燒、冷顫、劇烈頭痛背痛；重症出現黃疸、出血（如吐黑血）、多器官衰竭。",
    keyFeatures: [
      "平滑的二十面體外觀，由 180 個 E 蛋白緊密互鎖",
      "強烈的嗜肝性與嗜血管性"
    ],
    hotspots: [
      { id: "yfv_smooth_shell", name: "平滑 E 蛋白外殼", position: [0, 2.5, 0], camPos: [0, 4, 5], desc: "典型黃病毒外貌，緊密排列以保護內部 RNA。" }
    ],
    clinicalRelevance: "擁有極其安全有效的 17D 減毒活疫苗，接種一劑即可獲得終身免疫。"
  },
  "west-nile": {
    id: "west-nile",
    name: "West Nile Virus",
    chineseName: "西尼羅病毒",
    scientificName: "West Nile virus",
    family: "黃病毒科 (Flaviviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 50,
    r0: "NA (蚊媒，以鳥類為自然宿主)",
    fatalityRate: "10% (於引發神經系統感染者中)",
    transmission: "蚊子叮咬 (主要為家蚊 Culex)",
    receptor: "DC-SIGN, Integrin αvβ3",
    incubation: "2 - 14 天",
    colorTheme: "#40739e",
    accentColor: "#487eb0",
    description: "以鳥類為主要宿主，經由蚊子叮咬傳染給人類與馬匹。多數感染者無症狀，但少數會發展為致命的西尼羅腦神經炎 (腦炎或腦膜炎)。",
    symptoms: "多數無症狀；部分有發燒、頭痛、皮疹；嚴重者出現頸部僵硬、昏迷、腦炎。",
    keyFeatures: [
      "與登革、茲卡同屬黃病毒，外觀相似",
      "具嗜神經性，能穿過血腦屏障 (BBB) 感染中樞神經"
    ],
    hotspots: [
      { id: "wnv_capsid", name: "內部核衣殼", position: [0, 0, 0], camPos: [0, 1.5, 4], requiresCutaway: true, desc: "包裹著正鏈 RNA 的球形核衣殼。" }
    ],
    clinicalRelevance: "目前無人類疫苗，以防蚊措施與支持性療法為主。"
  },
  "chikungunya": {
    id: "chikungunya",
    name: "Chikungunya Virus",
    chineseName: "屈公病毒",
    scientificName: "Chikungunya virus",
    family: "披膜病毒科 (Togaviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 70,
    r0: "1.5 - 3.0",
    fatalityRate: "極低 (千分之一)",
    transmission: "斑蚊叮咬 (埃及斑蚊、白線斑蚊)",
    receptor: "Mxra8",
    incubation: "3 - 7 天",
    colorTheme: "#9c88ff",
    accentColor: "#8c7ae6",
    description: "病毒名稱源自非洲馬孔德語，意為『彎曲身體』，形容患者因劇烈關節痛而彎腰駝背的模樣。具有雙層的 T=4 二十面體對稱結構 (外層糖蛋白與內層衣殼)。",
    symptoms: "突發高燒、極度劇烈且可能持續數月的關節痛、皮疹。",
    keyFeatures: [
      "外膜上有 80 個三聚體糖蛋白 (E1/E2) 刺突",
      "外膜刺突與內部衣殼完美對齊，形成高度規則的幾何對稱"
    ],
    hotspots: [
      { id: "chikv_spikes", name: "E1/E2 糖蛋白網格", position: [0, 3, 0], camPos: [0, 4.5, 5.5], desc: "在包膜上排列成 T=4 晶格，介導細胞進入。" }
    ],
    clinicalRelevance: "FDA 近期剛核准全球首款屈公病疫苗 (Ixchiq)。"
  },
  "mers-cov": {
    id: "mers-cov",
    name: "MERS-CoV",
    chineseName: "中東呼吸症候群冠狀病毒",
    scientificName: "Middle East respiratory syndrome-related coronavirus",
    family: "冠狀病毒科 (Coronaviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 120,
    r0: "0.3 - 0.8 (不易人傳人，多為院內感染)",
    fatalityRate: "高達 34% - 37%",
    transmission: "單峰駱駝接觸、有限的有限人傳人 (飛沫/接觸)",
    receptor: "DPP4 (CD26)",
    incubation: "2 - 14 天 (平均 5 天)",
    colorTheme: "#c23616",
    accentColor: "#e84118",
    description: "高致死率的冠狀病毒，以單峰駱駝為中間宿主。其棘突蛋白 (Spike) 結合人體呼吸道及腎臟細胞表面的 DPP4 受體，常導致嚴重的肺炎並伴隨急性腎衰竭。",
    symptoms: "發燒、咳嗽、呼吸急促，重症常迅速惡化為急性呼吸窘迫（ARDS）及腎衰竭。",
    keyFeatures: [
      "典型日冕狀外觀，與 SARS-CoV-2 類似但受體不同",
      "對下呼吸道與腎臟細胞有強烈嗜性"
    ],
    hotspots: [
      { id: "mers_spike", name: "DPP4 結合棘突", position: [0, 4.5, 0], camPos: [0, 6, 7], desc: "專注於結合 DPP4 受體，這使得它深入人體下呼吸道。" }
    ],
    clinicalRelevance: "無特定疫苗或特效藥，依賴嚴格院內感染控制與支持性療法。"
  },
  "adenovirus": {
    id: "adenovirus",
    name: "Adenovirus",
    chineseName: "腺病毒",
    scientificName: "Human mastadenovirus",
    family: "腺病毒科 (Adenoviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 90,
    r0: "NA (極易在群體中爆發)",
    fatalityRate: "極低",
    transmission: "飛沫、接觸分泌物、糞口",
    receptor: "CAR (Coxsackievirus and adenovirus receptor)",
    incubation: "2 - 14 天",
    colorTheme: "#0097e6",
    accentColor: "#00a8ff",
    description: "著名的無包膜病毒，外觀宛如一顆帶有天線的通訊衛星。其二十面體衣殼的 12 個頂點上，各伸出一根細長的『纖維 (Fiber)』蛋白，末端帶有球結，用於探測並結合宿主細胞。",
    symptoms: "發燒（甚至連續高燒數日）、咽喉炎、紅眼症、咳嗽、腸胃不適。",
    keyFeatures: [
      "無包膜、大型規則二十面體衣殼 (252個殼粒)",
      "每個頂點伸出長度突出的 Fiber 蛋白",
      "常被基因改造用作疫苗載體 (如 AZ, J&J 新冠疫苗)"
    ],
    hotspots: [
      { id: "ad_fiber", name: "頂點纖維與球結 (Fiber & Knob)", position: [3.5, 3.5, 0], camPos: [5, 5, 5], desc: "如同天線般的突起，頂端球結負責與 CAR 受體結合。" }
    ],
    clinicalRelevance: "主要引發兒童呼吸道感染與結膜炎 (紅眼症)。無特效藥，多數可自然痊癒。"
  },
  "rhinovirus": {
    id: "rhinovirus",
    name: "Rhinovirus",
    chineseName: "鼻病毒",
    scientificName: "Rhinovirus (Enterovirus)",
    family: "微小核糖核酸病毒科 (Picornaviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 30,
    r0: "2 - 3",
    fatalityRate: "極低 (幾乎不會致命)",
    transmission: "飛沫、氣溶膠、接觸受污染表面 (極易經手傳播)",
    receptor: "ICAM-1, LDL receptor",
    incubation: "1 - 3 天",
    colorTheme: "#4cd137",
    accentColor: "#44bd32",
    description: "普通感冒 (Common Cold) 的最主要罪魁禍首。存在超過 100 種血清型，這也是人類一輩子會不斷感冒的原因。最適生長溫度為 33-35°C，因此偏好感染較涼爽的鼻腔。",
    symptoms: "流鼻水、鼻塞、打噴嚏、喉嚨痛、輕微咳嗽（通常不發高燒）。",
    keyFeatures: [
      "極微小無包膜病毒，與小兒麻痺病毒結構極似",
      "對酸敏感 (不同於腸病毒能通過胃酸)，所以只能侷限於呼吸道"
    ],
    hotspots: [
      { id: "rhino_capsid", name: "微小二十面體衣殼", position: [0, 1.5, 0], camPos: [0, 2, 4], desc: "抗原變異極大，表面峽谷負責結合 ICAM-1。" }
    ],
    clinicalRelevance: "無疫苗。症狀治療為主，洗手是預防的最佳方式。"
  },
  "lassa": {
    id: "lassa",
    name: "Lassa Virus",
    chineseName: "拉薩病毒",
    scientificName: "Lassa mammarenavirus",
    family: "沙狀病毒科 (Arenaviridae)",
    category: "雙分節負鏈/雙向 RNA (Ambisense RNA)",
    sizeNm: 100, // 80 - 130 nm, pleomorphic
    r0: "1.0 - 1.5",
    fatalityRate: "整體約 1%，住院重症者可達 15% - 50%",
    transmission: "多乳鼠 (Mastomys rat) 排泄物接觸、人傳人體液接觸",
    receptor: "Alpha-dystroglycan (α-DG)",
    incubation: "2 - 21 天",
    colorTheme: "#e056fd",
    accentColor: "#be2edd",
    description: "引發拉薩熱 (一種病毒性出血熱) 的病原體。其所屬的『沙狀病毒科』因在電子顯微鏡下，病毒顆粒內含有自宿主細胞劫持的核糖體，看起來像撒了沙子般而得名。",
    symptoms: "發燒、全身無力、咽炎、胸痛；重症出現臉部腫脹、出血、耳聾（常見後遺症）。",
    keyFeatures: [
      "包膜內含有宿主核糖體 (Ribosomes)，呈顆粒沙狀",
      "雙分節 RNA 具有罕見的雙向轉錄特性 (Ambisense)"
    ],
    hotspots: [
      { id: "lassa_ribosomes", name: "劫持的核糖體 (Sandy Appearance)", position: [0, 0, 0], camPos: [0, 1.5, 4], requiresCutaway: true, desc: "被包裹進病毒顆粒內的宿主核糖體，功能尚未完全明瞭，但賦予了獨特的形態。" }
    ],
    clinicalRelevance: "主要流行於西非。早期使用抗病毒藥物 Ribavirin 可顯著降低死亡率。"
  },
  "nipah": {
    id: "nipah",
    name: "Nipah Virus",
    chineseName: "立百病毒",
    scientificName: "Nipah henipavirus",
    family: "副黏液病毒科 (Paramyxoviridae)",
    category: "負鏈單股 RNA (-ssRNA)",
    sizeNm: 200, // Pleomorphic, 40-600 nm, average ~200
    r0: "0.5 (人傳人效率有限，但偶有爆發)",
    fatalityRate: "40% - 75% (WHO 重大威脅病原體)",
    transmission: "果蝠排泄物污染食物(如椰棗汁)、病豬接觸、人傳人",
    receptor: "Ephrin-B2, Ephrin-B3",
    incubation: "4 - 14 天 (最長可達 45 天)",
    colorTheme: "#5f27cd",
    accentColor: "#341f97",
    description: "由果蝠傳播的高致命性人畜共通病原體，曾於馬來西亞豬農間爆發。能引起嚴重的急性呼吸道感染及致命性腦炎，是全球關注具潛在大流行風險的病毒之一。",
    symptoms: "發燒、頭痛、肌肉痛、嘔吐；迅速惡化為非典型肺炎、腦炎、昏迷。",
    keyFeatures: [
      "多形性包膜，表面含有 G (附著) 與 F (融合) 蛋白",
      "極端嗜神經性，病毒能直接入侵中樞神經系統"
    ],
    hotspots: [
      { id: "nipah_spikes", name: "G 與 F 刺突複合體", position: [0, 3.5, 0], camPos: [0, 4.5, 6], desc: "G 蛋白結合高度保守的 Ephrin 受體，F 蛋白介導極具破壞性的細胞融合。" }
    ],
    clinicalRelevance: "無任何核准疫苗或特效藥。致死率極高，僅能依靠重症支持性療法。"
  }
};

const closingBraceIndex = code.lastIndexOf('};');
let newVirusesStr = '';
for (const key in newViruses) {
  newVirusesStr += ",\\n\\n  \"" + key + "\": " + JSON.stringify(newViruses[key], null, 4);
}

code = code.substring(0, closingBraceIndex) + newVirusesStr + '\\n' + code.substring(closingBraceIndex);

fs.writeFileSync(virusDataPath, code, 'utf8');
console.log('Added 15 new viruses to virusData.js');
