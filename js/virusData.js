// 3D 病毒醫學與科學資料庫 (Virus Science Database)
const VIRUS_DATABASE = {
  "sars-cov-2": {
    id: "sars-cov-2",
    name: "SARS-CoV-2",
    chineseName: "新型冠狀病毒",
    scientificName: "Severe acute respiratory syndrome coronavirus 2",
    family: "冠狀病毒科 (Coronaviridae)",
    category: "正股單股 RNA 病毒 (+ssRNA)",
    sizeNm: 100, // 直徑 ~100 nm (60-140 nm)
    r0: "2.5 - 5.0 (早期株) / 10 - 18 (Omicron)",
    fatalityRate: "0.1% - 3.4% (隨變異株與免疫力變化)",
    transmission: "飛沫傳播、氣膠 (氣霧)、密閉空間近距離接觸",
    receptor: "ACE2 (血管緊張素轉化酶 2)",
    incubation: "2 - 14 天 (平均約 3 - 5 天)",
    symptoms: "發燒、乾咳、疲勞、失去味覺/嗅覺、呼吸困難。",
    colorTheme: "#ff3d71",
    accentColor: "#ff708d",
    description: "2019年底引發全球 COVID-19 大流行之病原體。其最顯著特徵為外膜上放射狀分佈的『S 棘蛋白』(Spike Protein)，外觀如日冕而得名。S蛋白能精準結合人體呼吸道及各器官細胞表面的 ACE2 受體並介導膜融合。",
    keyFeatures: [
      "表面具有三聚體 S (Spike) 棘蛋白，介導宿主受體 ACE2 結合",
      "脂質雙層包膜嵌有 M (Membrane) 膜蛋白與 E (Envelope) 包膜蛋白",
      "內部為長約 30,000 核苷酸之正股單股 RNA，與 N (Nucleocapsid) 核蛋白纏繞成螺旋",
      "具備冠狀病毒特有的外切核糖核酸酶 (ExoN) 具校對功能，相較其他 RNA 病毒基因較穩定"
    ],
    hotspots: [
      {
        id: "spike",
        name: "S 棘蛋白 (Spike Trimer)",
        position: [0, 4.3, 0],
        camPos: [0, 6, 7],
        desc: "三聚體醣蛋白，由 S1 (負責辨識人體 ACE2 受體) 與 S2 (負責膜融合) 次單位構成，是 mRNA 疫苗與中和抗體的主要標靶。"
      },
      {
        id: "envelope",
        name: "脂質雙層包膜 (Lipid Bilayer)",
        position: [0, 0, 3.1],
        camPos: [0, 0, 7],
        desc: "源自宿主細胞膜結構，嵌有 M (維持形狀) 與 E (病毒組裝與釋放) 結構蛋白。易被酒精與肥皂等脂溶劑破壞。"
      },
      {
        id: "rna_core",
        name: "RNA 螺旋與 N 核蛋白 (Core RNA)",
        position: [0, 0, 0],
        camPos: [0, 3, 5],
        requiresCutaway: true,
        desc: "病毒的遺傳藍圖，全長約 29.9 kb，與核蛋白 (N蛋白) 結合形成螺旋狀核糖核蛋白複合物 (RNP)，掌控病毒複製。"
      }
    ],
    clinicalRelevance: "疫苗主要針對 S 蛋白開發 (如 mRNA-1273、BNT162b2)。抗病毒藥物包括 Paxlovid (3CL蛋白酶抑制劑) 與 Remdesivir (RdRp抑制劑)。"
  },

  "mpox": {
    id: "mpox",
    name: "Mpox Virus",
    chineseName: "猴痘病毒 / M痘",
    scientificName: "Monkeypox virus (Orthopoxvirus)",
    family: "痘病毒科 (Poxviridae)",
    category: "雙股 DNA 病毒 (dsDNA)",
    sizeNm: 250, // 200 x 250 x 300 nm
    r0: "1.2 - 2.0 (不同傳播分支有所差異)",
    fatalityRate: "1% - 10% (Clade I 較高，Clade II 較低約 <0.2%)",
    transmission: "人畜共患、親密接觸 (皮疹/體液)、共用衣物寢具、呼吸道飛沫",
    receptor: "硫酸乙醯肝素 (Heparan Sulfate)、GAGs 多醣受體",
    incubation: "5 - 21 天 (平均 6 - 13 天)",
    symptoms: "發燒、劇烈頭痛、淋巴結腫大、背痛、肌肉酸痛、特異性水泡膿疱皮疹。",
    colorTheme: "#ffaa00",
    accentColor: "#ffd166",
    description: "由痘病毒科正痘病毒屬引起的傳染病，近幾年在全球多國引發關注與公衛緊急警報。形態呈特殊的『磚狀』或卵圓形複合結構，擁有龐大且複雜的雙股 DNA 基因組，是目前已知感染人類體積最大的病毒之一。",
    keyFeatures: [
      "外觀呈獨特的圓角磚狀 (Brick-shaped)，具有多層包膜與外被微管蛋白",
      "內部包含經典的『雙凹啞鈴狀核心』(Dumbbell Core) 與兩側側體 (Lateral Bodies)",
      "基因組為約 197 kb 的大型雙股 DNA，編碼超過 180 種蛋白質",
      "完全在宿主細胞質 (Cytoplasm) 中複製，自帶轉錄系統與聚合酶"
    ],
    hotspots: [
      {
        id: "outer_membrane",
        name: "外層多重包膜 (Surface Tubules)",
        position: [0, 3.4, 0],
        camPos: [0, 6, 7],
        desc: "由外膜、微管樣表面小體交織而成，具有高度耐受環境的能力，可在乾燥皮屑與織物表面存活數天至數週。"
      },
      {
        id: "lateral_body",
        name: "側體 (Lateral Body)",
        position: [2.0, 0.5, 0],
        camPos: [4, 1, 5],
        requiresCutaway: true,
        desc: "位於啞鈴核心凹陷兩側的富蛋白結構，儲存病毒早期轉錄因子與免疫抑制蛋白，在侵入細胞初期釋放以逃避宿主防禦。"
      },
      {
        id: "dumbbell_core",
        name: "啞鈴形 DNA 核心 (Dumbbell Core)",
        position: [0, 0, 0],
        camPos: [0, 2, 5],
        requiresCutaway: true,
        desc: "厚層核心壁包裹著密集的大型雙股 DNA 與轉錄酶系統，外型呈凹陷的啞鈴狀，是正痘病毒科的顯著特徵。"
      }
    ],
    clinicalRelevance: "主要症狀為發燒、淋巴結腫大及特異性水泡膿疱皮疹。天花疫苗 (如 JYNNEOS / MVA-BN) 能提供約 85% 的交叉保護力。"
  },

  "influenza-a": {
    id: "influenza-a",
    name: "Influenza A / H5N1",
    chineseName: "A型流感病毒",
    scientificName: "Influenza A virus",
    family: "正黏液病毒科 (Orthomyxoviridae)",
    category: "負股分節 RNA 病毒 (-ssRNA, 8 segments)",
    sizeNm: 100, // 80-120 nm
    r0: "1.3 - 1.8 (季節性) / 潛在禽傳人重症威脅",
    fatalityRate: "季節性 <0.1% / 高致病性 H5N1 禽傳人歷史致死率達 ~50%",
    transmission: "飛沫、氣膠、直接或間接接觸禽鳥排泄物/呼吸道分泌物",
    receptor: "唾液酸受體 (α2,6-Gal 人類受體 / α2,3-Gal 禽類受體)",
    incubation: "1 - 4 天 (禽流感可長達 7 天)",
    symptoms: "突發高燒、咳嗽、喉嚨痛、肌肉酸痛、疲勞、流鼻水。",
    colorTheme: "#00d2d3",
    accentColor: "#48dbfb",
    description: "正黏液病毒科最具變異性的一員，表面分佈兩種關鍵突起：紅色的血凝素 (HA) 與藍色的神經胺酸酶 (NA)。因基因組由 8 條獨立 RNA 片段組成，容易在不同宿主體內發生『抗原重配』(Antigenic Shift) 而產生全球大流行新亞型。",
    keyFeatures: [
      "血凝素 (HA, 棒狀三聚體)：負責辨識宿主細胞表面唾液酸並介導內吞",
      "神經胺酸酶 (NA, 蘑菇狀四聚體)：負責水解唾液酸，幫助新生病毒顆粒脫離宿主細胞",
      "M2 離子通道蛋白：調節病毒體內 pH 值促進脫殼，為金剛烷胺類藥物標靶",
      "核心由 8 條不同長度的負股 RNA 片段 (vRNP) 組成，具高度重組突變特性"
    ],
    hotspots: [
      {
        id: "ha_spike",
        name: "血凝素 (HA, Hemagglutinin)",
        position: [2.4, 2.4, 0],
        camPos: [4, 4, 6],
        desc: "呈棒狀三聚體，決定病毒感染的物種特異性。禽流感偏好結合鳥類腸道的 α2,3 受體，若突變為適應人呼吸道 α2,6 受體將具大流行風險。"
      },
      {
        id: "na_spike",
        name: "神經胺酸酶 (NA, Neuraminidase)",
        position: [-2.4, 2.4, 0],
        camPos: [-4, 4, 6],
        desc: "呈蘑菇狀四聚體酵素，切斷細胞表面唾液酸讓子代病毒釋放。抗病毒藥物克流感 (Oseltamivir / Tamiflu) 即為 NA 抑制劑。"
      },
      {
        id: "segmented_rna",
        name: "8 條分節 RNA (8 vRNP Segments)",
        position: [0, 0, 0],
        camPos: [0, 2, 5],
        requiresCutaway: true,
        desc: "8 條獨立包裹著核蛋白與聚合酶複合體 (PB1, PB2, PA) 的螺旋 RNA 片段，如同一套可重新洗牌的卡牌。"
      }
    ],
    clinicalRelevance: "每年因抗原漂移 (Antigenic Drift) 需定期更新季節性流感疫苗。新型抗病毒藥物包括巴洛沙韋 (Baloxavir, CAP依賴性內切酶抑制劑)。"
  },

  "bacteriophage-t4": {
    id: "bacteriophage-t4",
    name: "Bacteriophage T4",
    chineseName: "T4 噬菌體",
    scientificName: "Escherichia virus T4 (Caudoviricetes)",
    family: "肌尾噬菌體科 (Myoviridae)",
    category: "雙股 DNA 病毒 (dsDNA)",
    sizeNm: 200, // 長約 200 nm, 頭部寬 85 nm
    r0: "暴發量 (Burst Size) 約 100-300 個/每細菌宿主",
    fatalityRate: "對人體無害 (專性殺傷大腸桿菌等目標細菌)",
    transmission: "水體、腸道微生態環境傳播，精準吸附靶向細菌",
    receptor: "脂多醣 (LPS) 及外膜蛋白 OmpC",
    incubation: "裂解週期 (Lytic Cycle) 約 25 - 30 分鐘",
    symptoms: "無人體臨床症狀（專注感染大腸桿菌）。",
    colorTheme: "#a55eea",
    accentColor: "#d6a2e8",
    description: "生物界著名的『微型奈米注射器』，具有精密如登月艙的機械化幾何結構。能精準辨識並降落在目標大腸桿菌表面，收縮尾鞘並將緊密壓縮在二十面體頭部的 DNA 像注射針一樣直接注入細菌內部。",
    keyFeatures: [
      "長二十面體頭部 (Capsid Head)：高壓壓縮封裝長達 169 kb 的雙股 DNA",
      "收縮尾鞘 (Contractile Tail Sheath)：內部包圍堅硬中空尾管，能在吸附後收縮刺穿細菌壁",
      "六角形基板 (Baseplate)：配有中心尾針與 6 條可折疊關節尾絲 (Tail Fibers)",
      "現代噬菌體療法 (Phage Therapy) 與抗生素抗藥性 (AMR) 解決方案的代表性研究模型"
    ],
    hotspots: [
      {
        id: "phage_head",
        name: "二十面體晶格頭部 (Icosahedral Head)",
        position: [0, 3.2, 0],
        camPos: [0, 4.5, 6],
        desc: "由 gp23* 等多種結構蛋白精密裝配而成的二十面體幾何結晶外殼，內部在超過 50 氣壓的高壓下封裝 DNA。"
      },
      {
        id: "tail_sheath",
        name: "收縮尾鞘與中空尾管 (Tail Sheath)",
        position: [0, 0.4, 0],
        camPos: [0, 1, 5],
        desc: "如同機械活塞彈簧，吸附後尾鞘構型劇變收縮，推動內部剛性尾管刺破宿主細菌外膜與肽聚糖層。"
      },
      {
        id: "tail_fibers",
        name: "6 條關節尾絲 (Tail Fibers & Pins)",
        position: [1.8, -2.5, 0],
        camPos: [2.5, -2, 4],
        desc: "如同起落架與探測觸手，能特異性識別大腸桿菌表面的脂多醣 (LPS)，觸發基板構型轉變啟動注射程序。"
      }
    ],
    clinicalRelevance: "不感染人體細胞，在後抗生素時代被廣泛研究應用於治療超級細菌 (Superbugs) 感染、食品保鮮與奈米藥物載體合成。"
  },

  "ebola": {
    id: "ebola",
    name: "Ebola Virus",
    chineseName: "伊波拉病毒",
    scientificName: "Zaire ebolavirus",
    family: "絲狀病毒科 (Filoviridae)",
    category: "不分節負股單股 RNA 病毒 (-ssRNA)",
    sizeNm: 970, // 長度 800 - 1000 nm, 寬度約 80 nm
    r0: "1.5 - 2.5",
    fatalityRate: "25% - 90% (平均約 50%)",
    transmission: "直接接觸感染者的血液、分泌物、器官或受污染表面",
    receptor: "NPC1 (Niemann-Pick C1 膽固醇轉運蛋白 - 內體受體)",
    incubation: "2 - 21 天 (平均 8 - 10 天)",
    symptoms: "突發高燒、極度疲勞、肌肉痛、頭痛、咽痛，隨後出現嘔吐、腹瀉、皮疹及內外出血。",
    colorTheme: "#eb4d4b",
    accentColor: "#ff7979",
    description: "引發致命性伊波拉出血熱的絲狀病原體。外觀極具辨識度，呈長條牧羊杖狀 (Shepherd's crook)、U型或波浪絲狀結構，長度可達近 1 微米 (1000 nm)，是外型最為奇特且最致命的烈性病毒之一。",
    keyFeatures: [
      "長絲狀 (Filamentous) 形態，常彎曲成『6』字型、牧羊杖或 U 字形態",
      "外膜密布三聚體糖蛋白 (GP)，負責細胞吸附與巨胞飲作用介導侵入",
      "內部為長條螺旋狀核衣殼 (Nucleocapsid)，直徑約 50 nm，包含約 19 kb 負股 RNA",
      "感染後破壞血管內皮細胞完整性與凝血系統，引發全身性出血與多器官衰竭"
    ],
    hotspots: [
      {
        id: "filament_hook",
        name: "牧羊杖彎曲末端 (Hook Structure)",
        position: [0, 4.0, 0],
        camPos: [0, 5, 6],
        desc: "絲狀病毒特有的末端環狀或鉤狀結構，由脂質雙層包裹著內部連續的螺旋狀核糖核蛋白管。"
      },
      {
        id: "gp_envelope",
        name: "外膜糖蛋白棘突 (GP Glycoprotein)",
        position: [1.2, 0.5, 0],
        camPos: [3, 1, 5],
        desc: "突出於包膜表面的 GP 刺突，能誘導細胞產生巨胞飲作用，進入溶酶體後被組織蛋白酶剪切並結合 NPC1 受體。"
      },
      {
        id: "helical_core",
        name: "長條螺旋核衣殼 (Inner Helical Core)",
        position: [0, -1.0, 0],
        camPos: [0, -1, 5],
        requiresCutaway: true,
        desc: "由 NP 核蛋白、VP35、VP30 與 L 聚合酶組裝成的長度接近 1 微米的緻密螺旋管。"
      }
    ],
    clinicalRelevance: "目前已有 rVSV-ZEBOV (Ervebo) 基因重組減毒疫苗獲批，單株抗體藥物 (如 Inmazeb, Ebanga) 明顯提升了重症生存率。"
  },

  "dengue": {
    id: "dengue",
    name: "Dengue Virus",
    chineseName: "登革病毒",
    scientificName: "Dengue virus (Flavivirus)",
    family: "黃病毒科 (Flaviviridae)",
    category: "正股單股 RNA 病毒 (+ssRNA)",
    sizeNm: 50, // 直徑約 50 nm
    r0: "1.5 - 3.0 (隨病媒蚊密度顯著變動)",
    fatalityRate: "常規 <1% / 登革出血熱 (DHF) 未及時治療可達 >20%",
    transmission: "埃及斑蚊 (Aedes aegypti) 與白線斑蚊 (Aedes albopictus) 叮咬",
    receptor: "DC-SIGN, CLEC5A, 硫酸乙醯肝素",
    incubation: "4 - 10 天",
    symptoms: "突發高燒、劇烈頭痛、眼後痛、肌肉與關節痛（斷骨熱）、噁心、嘔吐、皮疹。",
    colorTheme: "#2bcbba",
    accentColor: "#20bf6b",
    description: "由蚊媒傳播的熱帶與亞熱帶常見急性傳染病病毒，分為 4 種血清型 (DENV-1 至 DENV-4)。成熟病毒顆粒呈現極為緊密、規則平滑的二十面體外觀，由 90 個包膜蛋白 (E) 二聚體以精巧的人字形 (Herringbone) 互鎖排列。",
    keyFeatures: [
      "人字形 (Herringbone) 緊密互鎖的 90 個 E 蛋白二聚體，表面平滑無顯著外凸刺突",
      "未成熟病毒表面呈尖銳三聚體刺突，經宿主高爾基體 Furin 蛋白酶剪切後轉變為平滑成熟形態",
      "抗體依賴性增強作用 (ADE, Antibody-Dependent Enhancement)：二次感染不同血清型時易引發重症",
      "內部包含單股正股 RNA 基因組 (~11 kb)，編碼 3 種結構蛋白與 7 種非結構蛋白 (NS1-NS5)"
    ],
    hotspots: [
      {
        id: "herringbone_shell",
        name: "人字形 E 蛋白晶格 (E Glycoprotein Lattice)",
        position: [0, 2.6, 0],
        camPos: [0, 4, 5],
        desc: "90 個 E 蛋白二聚體平行平鋪於脂質包膜外，宛如精密編織的球形鎧甲，具備酸敏感性可於內體中觸發構型翻轉融合。"
      },
      {
        id: "ns1_complex",
        name: "NS1 非結構蛋白釋放 (NS1 Secretion)",
        position: [1.8, 1.8, 0],
        camPos: [3, 3, 5],
        desc: "感染細胞會分泌大量 NS1 六聚體進入血液，直接破壞血管內皮糖萼層引發血漿滲漏，是臨床快篩的重要指標抗原。"
      },
      {
        id: "spherical_capsid",
        name: "衣殼與 (+)RNA (Capsid & RNA Genome)",
        position: [0, 0, 0],
        camPos: [0, 1.5, 4],
        requiresCutaway: true,
        desc: "由多拷貝 C 蛋白無定形包裹單股正股 RNA，侵入細胞質後可直接作為 mRNA 轉譯出完整多聚蛋白。"
      }
    ],
    clinicalRelevance: "臨床症狀俗稱『斷骨熱』(劇烈骨關節痛、高燒、眼窩痛與皮疹)。目前有 Dengvaxia 與 Qdenga (TAK-003) 疫苗核准使用。"
  },

  "rabies": {
    id: "rabies",
    name: "Rabies Virus",
    chineseName: "狂犬病病毒",
    scientificName: "Rabies lyssavirus",
    family: "彈狀病毒科 (Rhabdoviridae)",
    category: "不分節負股單股 RNA 病毒 (-ssRNA)",
    sizeNm: 180, // 75 x 180 nm 子彈形
    r0: "1.0 - 2.0 (哺乳動物間咬傷)",
    fatalityRate: ">99.9% (一旦發病致死率近乎100%，最致命神經毒性病毒)",
    transmission: "感染動物 (狗、蝙蝠、浣熊等) 抓咬傷口或黏膜接觸唾液",
    receptor: "乙醯膽鹼受體 (nAChR)、神經細胞黏附分子 (NCAM)、p75NTR",
    incubation: "1 - 3 個月 (短至數天，長可逾1年，視傷口距中樞神經遠近)",
    symptoms: "初期發燒、傷口刺痛；晚期出現恐水症、狂躁、恐風、吞嚥困難、癱瘓、昏迷。",
    colorTheme: "#ff6b6b",
    accentColor: "#ffa8a8",
    description: "彈狀病毒科最具代表性的神經嗜性病原體。外觀呈現獨特的『子彈型』(Bullet-shaped)，一端平坦凹陷，另一端呈半球狀圓頂。病毒能沿著周邊神經軸突逆行進入中樞神經系統與大腦，引發致命性腦炎與恐水症。",
    keyFeatures: [
      "經典子彈形 (Bullet-shaped) 外觀：平底圓頭的圓柱結構",
      "外膜密布三聚體 G 糖蛋白刺突，專性結合神經肌肉接頭的乙醯膽鹼受體",
      "膜內部為 M (基質) 蛋白骨架，維持子彈狀剛性並調節轉錄/出芽",
      "內部為緊密規則盤繞的核糖核蛋白 (RNP) 螺旋管，如彈簧般貫穿子彈核心"
    ],
    hotspots: [
      {
        id: "bullet_dome",
        name: "子彈半球形頂端 (Hemispherical Dome)",
        position: [0, 3.2, 0],
        camPos: [0, 5, 5],
        desc: "子彈型頂部圓頂，均勻分佈 G 糖蛋白，負責引導病毒專性結合神經末梢受體 (如 nAChR)。"
      },
      {
        id: "invaginated_base",
        name: "凹陷平底基座 (Invaginated Base)",
        position: [0, -3.0, 0],
        camPos: [0, -4.5, 5],
        desc: "子彈型底部呈平坦或軸向內凹結構，是病毒自宿主細胞膜出芽組裝的起始幾何端點。"
      },
      {
        id: "tight_rnp_coil",
        name: "盤繞 RNP 彈簧螺旋 (Coiled RNP Core)",
        position: [0, 0, 0],
        camPos: [0, 1, 4.5],
        requiresCutaway: true,
        desc: "由 N 核蛋白緊密包覆 12 kb 負股 RNA，以每圈約 30 個 N 次單位的精確節奏盤繞成緊密圓柱彈簧核心。"
      }
    ],
    clinicalRelevance: "一旦出現恐水、痙攣等臨床神經症狀幾乎百分之百致命。暴露後預防 (PEP) 是唯一救命手段：徹底沖洗傷口、及時接種人用狂犬病疫苗與抗狂犬病免疫球蛋白 (RIG)。"
  },

  "hiv-1": {
    id: "hiv-1",
    name: "HIV-1",
    chineseName: "人類免疫缺乏病毒 / 愛滋病毒",
    scientificName: "Human immunodeficiency virus 1",
    family: "反轉錄病毒科 (Retroviridae)",
    category: "正股 RNA 雙拷貝反轉錄病毒 (ssRNA-RT)",
    sizeNm: 120, // 直徑約 100 - 120 nm
    r0: "2.0 - 5.0 (無防護性行為/血液途徑)",
    fatalityRate: "未治療下 >90% (進展為 AIDS) / 規範抗病毒治療 (ART) 預期壽命接近常人",
    transmission: "性接觸、血液及血液製品、母嬰垂直傳播",
    receptor: "CD4 受體 + 輔助受體 CCR5 / CXCR4",
    incubation: "急性期 2 - 4 週 / 臨床潛伏期平均 8 - 10 年",
    symptoms: "急性期似流感症狀（發燒、喉嚨痛、淋巴腫）；晚期（AIDS）引發各種伺機性感染（肺囊蟲肺炎、卡波西氏肉瘤等）。",
    colorTheme: "#10ac84",
    accentColor: "#1dd1a1",
    description: "反轉錄病毒科慢病毒屬病原體，攻擊人體免疫系統核心 CD4+ T 淋巴細胞。其內部最具代表性的是一個『截角錐形』(Fullerene Conical Core) 衣殼，包裹著兩條正股 RNA、反轉錄酶與整合酶。",
    keyFeatures: [
      "外膜分佈稀疏但關鍵的 gp120 (球狀頭部) 與 gp41 (跨膜柄部) 刺突複合體 (約 7-14 個)",
      "膜下襯有 p17 基質蛋白 (Matrix Shell)，維持球形穩定",
      "標誌性富勒烯錐形衣殼 (Conical p24 Capsid)：由約 250 個六聚體與 12 個五聚體組成的圓錐體",
      "核心攜帶兩條相同的 (+)ssRNA 與反轉錄酶 (RT)、整合酶 (IN)、蛋白酶 (PR)"
    ],
    hotspots: [
      {
        id: "gp120_spike",
        name: "gp120 / gp41 刺突複合物 (Env Trimer)",
        position: [0, 3.2, 0],
        camPos: [0, 4.5, 6],
        desc: "gp120 辨識 CD4 受體引發構型改變，隨後結合 CCR5 輔助受體，觸發 gp41 刺入細胞膜介導融合。外表覆蓋厚重聚醣盾 (Glycan Shield) 以逃避抗體。"
      },
      {
        id: "conical_capsid",
        name: "富勒烯錐形衣殼核心 (Conical p24 Core)",
        position: [0, 0.2, 0],
        camPos: [0, 1, 5],
        requiresCutaway: true,
        desc: "由 p24 蛋白組裝而成的截角不對稱圓錐體，直徑寬端約 45 nm、窄端約 20 nm，保護遺傳物質進入細胞核孔。"
      },
      {
        id: "rt_enzyme",
        name: "雙拷貝 RNA 與反轉錄酶 (RNA & RT)",
        position: [0, -0.4, 0],
        camPos: [0, 0, 4],
        requiresCutaway: true,
        desc: "兩條相同的單股 RNA 搭配反轉錄酶 (RT)，能將 RNA 反轉錄為前病毒 DNA 並經整合酶嵌入宿主染色體形成病毒庫。"
      }
    ],
    clinicalRelevance: "雞尾酒療法 (高效抗反轉錄病毒治療 HAART/ART) 能將病毒量壓制至檢測不到 (U=U: 測不到即不傳染)。PrEP (暴露前預防用藥) 可降低 >99% 經性行為感染風險。"
  }
,

  "hbv": {
    "id": "hbv",
    "name": "Hepatitis B Virus (HBV)",
    "chineseName": "B型肝炎病毒",
    "scientificName": "Hepatitis B virus",
    "family": "嗜肝DNA病毒科 (Hepadnaviridae)",
    "category": "部分雙股環狀DNA (rcDNA)",
    "sizeNm": 42,
    "r0": "NA (主要經血液及體液傳播)",
    "fatalityRate": "急性期<1%，慢性肝硬化/肝癌風險高",
    "transmission": "母嬰垂直傳染、血液、體液、性接觸",
    "receptor": "NTCP (牛磺膽酸鈉共轉運多肽)",
    "incubation": "60 - 150 天",
    "colorTheme": "#f1c40f",
    "accentColor": "#f39c12",
    "description": "引起全球慢性肝炎與肝癌的主要元兇。完整的病毒顆粒稱為戴恩顆粒 (Dane particle)，表面富含 HBsAg 表面抗原，內部衣殼包覆著特殊的部分雙股環狀DNA與自帶的聚合酶。",
    "symptoms": "黃疸（皮膚及眼白發黃）、極度疲勞、噁心、嘔吐、腹痛、茶色尿。",
    "keyFeatures": [
        "Dane particle (42nm) 為具感染力的完整病毒體",
        "外膜含有大量 HBsAg (表面抗原)，也會產生大量無核酸的亞病毒顆粒",
        "特殊的 rcDNA (部分雙股環狀DNA)，在細胞核內轉為 cccDNA",
        "具有反轉錄過程，為嗜肝DNA病毒的特徵"
    ],
    "hotspots": [
        {
            "id": "hbsag",
            "name": "HBsAg 表面抗原 (Surface Antigen)",
            "position": [
                0,
                2.5,
                0
            ],
            "camPos": [
                0,
                4,
                5
            ],
            "desc": "存在於病毒包膜表面的主要蛋白，是 B 肝疫苗的成分與臨床檢測的關鍵指標。"
        },
        {
            "id": "core_antigen",
            "name": "HBcAg 核心衣殼 (Capsid)",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                1.5,
                4
            ],
            "requiresCutaway": true,
            "desc": "二十面體衣殼，內部包裹著不完整的 rcDNA 與病毒聚合酶。"
        }
    ],
    "clinicalRelevance": "有效預防依賴 B 肝疫苗。慢性感染可使用干擾素或口服抗病毒藥物 (如 Entecavir, Tenofovir) 控制。"
},

  "zika": {
    "id": "zika",
    "name": "Zika Virus",
    "chineseName": "茲卡病毒",
    "scientificName": "Zika virus",
    "family": "黃病毒科 (Flaviviridae)",
    "category": "正股單股 RNA (+ssRNA)",
    "sizeNm": 50,
    "r0": "1.4 - 6.6 (蚊蟲叮咬)",
    "fatalityRate": "極低 (主要威脅為孕婦感染致胎兒小頭畸形)",
    "transmission": "斑蚊叮咬、性接觸、母嬰垂直傳染、輸血",
    "receptor": "AXL, TIM-1 等受體",
    "incubation": "3 - 14 天",
    "colorTheme": "#e84393",
    "accentColor": "#fd79a8",
    "description": "與登革病毒結構高度相似，表面光滑呈二十面體。雖然多數成人感染症狀輕微，但若孕婦感染，病毒可穿過胎盤引發嚴重的胎兒神經發育異常（小頭畸形）。",
    "symptoms": "輕微發燒、皮疹、結膜炎（紅眼）、肌肉和關節痛、全身倦怠。",
    "keyFeatures": [
        "成熟顆粒表面由 180 個 E 糖蛋白平滑排列成人字形",
        "能在神經祖細胞中高效複製，導致神經發育受損",
        "可透過精液長期存留並經由性行為傳播"
    ],
    "hotspots": [
        {
            "id": "zika_e_protein",
            "name": "茲卡 E 蛋白 (E Protein)",
            "position": [
                0,
                2.6,
                0
            ],
            "camPos": [
                0,
                4,
                5
            ],
            "desc": "平滑覆蓋病毒表面的糖蛋白，負責受體結合與膜融合。"
        }
    ],
    "clinicalRelevance": "目前尚無特效藥與核准疫苗。孕婦應避免前往疫區，並作好防蚊措施。"
},

  "rotavirus": {
    "id": "rotavirus",
    "name": "Rotavirus",
    "chineseName": "輪狀病毒",
    "scientificName": "Rotavirus",
    "family": "呼腸孤病毒科 (Reoviridae)",
    "category": "雙股分節 RNA (dsRNA, 11 segments)",
    "sizeNm": 75,
    "r0": "高達 15 - 18",
    "fatalityRate": "在開發中國家嬰幼兒中致死率較高 (脫水導致)",
    "transmission": "糞口傳染、接觸受污染表面",
    "receptor": "唾液酸, 組織血型抗原 (HBGA)",
    "incubation": "2 天",
    "colorTheme": "#0984e3",
    "accentColor": "#74b9ff",
    "description": "全球嬰幼兒嚴重腹瀉最常見的原因。外觀酷似車輪 (Rota)，具有獨特的三層同心蛋白質衣殼，保護內部 11 段雙股 RNA 免受胃酸及腸道酵素破壞。",
    "symptoms": "嚴重水瀉、嘔吐、發燒、腹痛，易導致嬰幼兒嚴重脫水。",
    "keyFeatures": [
        "無脂質包膜，具有堅固的三層衣殼 (TLP, Triple-Layered Particle)",
        "外層含有 VP7 (G蛋白) 與突出的 VP4 (P蛋白) 刺突",
        "基因組為 11 條雙股 RNA (dsRNA)"
    ],
    "hotspots": [
        {
            "id": "vp4_spike",
            "name": "VP4 刺突 (VP4 Spikes)",
            "position": [
                3,
                2,
                0
            ],
            "camPos": [
                4,
                3,
                5
            ],
            "desc": "突出的刺狀蛋白，經過腸道胰蛋白酶切割後增強感染力，負責細胞吸附。"
        },
        {
            "id": "triple_capsid",
            "name": "三層衣殼 (Triple-Layered Capsid)",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                2,
                4
            ],
            "requiresCutaway": true,
            "desc": "外層 VP7、中層 VP6、內層 VP2，提供極強的環境耐受力。"
        }
    ],
    "clinicalRelevance": "口服輪狀病毒疫苗 (如 Rotarix, RotaTeq) 能有效預防重症。治療主要為口服補液鹽 (ORS) 補充水分與電解質。"
},

  "hsv": {
    "id": "hsv",
    "name": "Herpes Simplex Virus (HSV)",
    "chineseName": "單純皰疹病毒",
    "scientificName": "Human alphaherpesvirus 1/2",
    "family": "皰疹病毒科 (Herpesviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 200,
    "r0": "NA (終身潛伏，復發時具傳染性)",
    "fatalityRate": "極低 (少數引發皰疹性腦炎則高風險)",
    "transmission": "直接接觸感染者的皮膚病灶、唾液、生殖器分泌物",
    "receptor": "硫酸乙醯肝素, Nectin-1, HVEM",
    "incubation": "2 - 12 天",
    "colorTheme": "#d63031",
    "accentColor": "#ff7675",
    "description": "HSV-1 主要引起唇皰疹，HSV-2 主要引起生殖器皰疹。病毒顆粒龐大複雜，具有脂質包膜、厚實的『皮層』(Tegument) 與二十面體衣殼。感染後會終身潛伏於神經節中。",
    "symptoms": "群聚性水泡或潰瘍、疼痛、發燒、淋巴結腫大（復發時多為局部水泡）。",
    "keyFeatures": [
        "複雜的四層結構：包膜、皮層 (Tegument)、衣殼、DNA 核心",
        "皮層包含多種蛋白質，在感染初期即時抑制宿主免疫並啟動轉錄",
        "能建立潛伏感染 (Latency)，在免疫力低下時重新活化"
    ],
    "hotspots": [
        {
            "id": "tegument",
            "name": "皮層 (Tegument)",
            "position": [
                0,
                1.5,
                0
            ],
            "camPos": [
                0,
                2,
                4
            ],
            "requiresCutaway": true,
            "desc": "位於包膜與衣殼之間的無定形蛋白層，含有豐富的病毒蛋白 (如 VP16) 供感染早期使用。"
        },
        {
            "id": "hsv_capsid",
            "name": "二十面體衣殼 (Icosahedral Capsid)",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                0,
                3
            ],
            "requiresCutaway": true,
            "desc": "堅固的 162 個殼粒組成的衣殼，包裹著超過 150 kb 的線狀雙股 DNA。"
        }
    ],
    "clinicalRelevance": "抗病毒藥物如 Acyclovir 及其衍生物可抑制 DNA 聚合酶，減輕症狀並縮短病程，但無法根治潛伏感染。"
},

  "norovirus": {
    "id": "norovirus",
    "name": "Norovirus",
    "chineseName": "諾羅病毒",
    "scientificName": "Norwalk virus",
    "family": "杯狀病毒科 (Caliciviridae)",
    "category": "正股單股 RNA (+ssRNA)",
    "sizeNm": 38,
    "r0": "2.0 - 7.0",
    "fatalityRate": "極低 (主要風險為脫水)",
    "transmission": "糞口傳染、受污染之水/食物 (如生蠔)、氣膠",
    "receptor": "組織血型抗原 (HBGA)",
    "incubation": "12 - 48 小時",
    "colorTheme": "#6c5ce7",
    "accentColor": "#a29bfe",
    "description": "被稱為『冬季嘔吐症』的病原體，具極高傳染力，只需不到 100 個病毒顆粒即可致病。無包膜，二十面體衣殼表面佈滿獨特的『杯狀』(Calix) 凹陷結構，對酒精消毒有高度抵抗力。",
    "symptoms": "突發性猛烈嘔吐、水樣腹瀉、噁心、腹痛、微熱。",
    "keyFeatures": [
        "無包膜微小病毒，表面由 VP1 主要衣殼蛋白組成",
        "表面呈現多個明顯的杯狀凹陷，為杯狀病毒科特徵",
        "極耐環境壓力，一般酒精乾洗手無法有效消滅"
    ],
    "hotspots": [
        {
            "id": "cup_depressions",
            "name": "杯狀凹陷 (Cup-like Depressions)",
            "position": [
                0,
                1.8,
                0
            ],
            "camPos": [
                0,
                2.5,
                3.5
            ],
            "desc": "衣殼表面特有的凹陷結構，這也是其所屬『杯狀病毒科』命名的由來。"
        }
    ],
    "clinicalRelevance": "無特效藥與疫苗。預防需依賴徹底的『肥皂洗手』與漂白水環境消毒，酒精消毒效果極差。"
},

  "hpv": {
    "id": "hpv",
    "name": "Human Papillomavirus (HPV)",
    "chineseName": "人類乳突病毒",
    "scientificName": "Human papillomavirus",
    "family": "乳突病毒科 (Papillomaviridae)",
    "category": "雙股環狀 DNA (dsDNA)",
    "sizeNm": 55,
    "r0": "NA (親密接觸與性接觸為主)",
    "fatalityRate": "病毒本身不致死，但高危險型 (16, 18) 會引發子宮頸癌等多種癌症",
    "transmission": "皮膚與黏膜的直接接觸 (主要為性行為)",
    "receptor": "硫酸乙醯肝素、Integrins",
    "incubation": "數週至數月，甚至潛伏數年",
    "colorTheme": "#00b894",
    "accentColor": "#55efc4",
    "description": "最常見的性傳染病原體之一。無包膜，外觀像一個佈滿星星狀突起的球體，由 72 個星形五聚體 (L1 蛋白) 組成。高危險型 HPV 的 E6 與 E7 蛋白會破壞人體抑癌基因，導致細胞癌化。",
    "symptoms": "多數無症狀；部分引起生殖器疣（菜花）或一般皮膚疣；高危險型感染長期可能發展為癌症。",
    "keyFeatures": [
        "72 個五聚體 (Capsomeres) 構成星狀排列的二十面體衣殼",
        "環狀雙股 DNA 約 8 kb，編碼 E (早期) 與 L (晚期) 蛋白",
        "E6 蛋白降解 p53，E7 蛋白結合 pRb，為誘發癌症的關鍵機制"
    ],
    "hotspots": [
        {
            "id": "l1_pentamer",
            "name": "L1 五聚體 (L1 Pentamers)",
            "position": [
                2,
                1.5,
                0
            ],
            "camPos": [
                3,
                2,
                4
            ],
            "desc": "構成星形外觀的主要衣殼蛋白，也是目前 HPV 預防性疫苗 (如 Gardasil) 使用的抗原 VLP。"
        }
    ],
    "clinicalRelevance": "HPV 疫苗 (九價等) 可極有效預防高危險型感染及子宮頸癌。常規子宮頸抹片檢查可早期發現病變。"
},

  "measles": {
    "id": "measles",
    "name": "Measles Virus",
    "chineseName": "麻疹病毒",
    "scientificName": "Measles morbillivirus",
    "family": "副黏液病毒科 (Paramyxoviridae)",
    "category": "不分節負股單股 RNA (-ssRNA)",
    "sizeNm": 150,
    "r0": "12 - 18 (極具傳染性)",
    "fatalityRate": "0.1% - 0.2% (營養不良兒童或免疫低下者可達 10%)",
    "transmission": "空氣傳播 (氣膠)、飛沫、直接接觸分泌物",
    "receptor": "CD150 (SLAM), Nectin-4",
    "incubation": "10 - 14 天",
    "colorTheme": "#e15f41",
    "accentColor": "#f3a683",
    "description": "已知傳染力最強的人類病毒之一，也是引發麻疹的元兇。呈球形或多形性，包膜表面佈滿血凝素 (H) 與融合蛋白 (F) 刺突。感染會導致『免疫失憶』，清除人體過去建立的抗體庫。",
    "symptoms": "高燒、咳嗽、流鼻水、結膜炎，口腔出現柯氏斑（Koplik spots），隨後全身出現紅疹。",
    "keyFeatures": [
        "表面具有 H 蛋白 (負責受體結合) 與 F 蛋白 (負責膜融合與形成多核巨細胞)",
        "內部為連續螺旋狀的核糖核蛋白體 (RNP)",
        "能感染並破壞記憶 B 細胞與 T 細胞，導致長達數月的免疫失憶效應"
    ],
    "hotspots": [
        {
            "id": "h_f_spikes",
            "name": "H & F 糖蛋白刺突 (H & F Spikes)",
            "position": [
                0,
                3.5,
                0
            ],
            "camPos": [
                0,
                4.5,
                5
            ],
            "desc": "H 蛋白負責結合受體，F 蛋白則像彈簧刀般觸發細胞融合，使得受感染細胞融合成巨大的多核巨細胞 (Syncytia)。"
        },
        {
            "id": "helical_rnps",
            "name": "螺旋狀 RNA 核衣殼 (Helical RNP)",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                2,
                4
            ],
            "requiresCutaway": true,
            "desc": "不分段的單股負股 RNA，與 N 蛋白緊密結合，形狀如同柔軟盤繞的彈簧。"
        }
    ],
    "clinicalRelevance": "MMR (麻疹、腮腺炎、德國麻疹) 混合疫苗極其有效，提供長效終身免疫。無特定抗病毒藥物，以支持性療法為主。"
}

,

  "mimivirus": {
    "id": "mimivirus",
    "name": "Mimivirus",
    "chineseName": "米米病毒 (巨型多毛病毒)",
    "scientificName": "Acanthamoeba polyphaga mimivirus",
    "family": "擬菌病毒科 (Mimiviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 750,
    "r0": "NA (感染變形蟲)",
    "fatalityRate": "對人類無明顯致病性",
    "transmission": "環境水體、變形蟲宿主",
    "receptor": "Phagocytosis",
    "incubation": "NA",
    "colorTheme": "#686de0",
    "accentColor": "#4834d4",
    "description": "史上首批被發現的『巨型病毒 (Giant Virus)』之一，體積大到可用光學顯微鏡觀察，甚至一度被誤認為細菌。外表覆蓋濃密的纖維毛，並具有一個極為特殊的五角星形『星門 (Stargate)』結構用於釋放 DNA。",
    "symptoms": "主要感染阿米巴原蟲。偶有研究指出可能與人類肺炎有關，但證據尚未確立。",
    "keyFeatures": [
        "超巨大的二十面體衣殼，表面覆蓋厚厚的糖蛋白纖維",
        "其中一個頂點具備『星門 (Stargate)』開口結構",
        "擁有極其龐大且複雜的基因組"
    ],
    "hotspots": [
        {
            "id": "mimi_stargate",
            "name": "星門 (Stargate)",
            "position": [
                0,
                4.5,
                0
            ],
            "camPos": [
                0,
                6,
                6
            ],
            "desc": "感染宿主後，這個五角星狀的裂口會打開，釋放內部的膜質核心與 DNA。"
        },
        {
            "id": "mimi_fibers",
            "name": "糖蛋白絨毛",
            "position": [
                3,
                0,
                0
            ],
            "camPos": [
                5,
                0,
                4
            ],
            "desc": "覆蓋在病毒表面的密集纖維，可能用於吸引變形蟲吞噬。"
        }
    ],
    "clinicalRelevance": "開啟了人類對巨型病毒與生命起源界線的新認知。"
},

  "pithovirus": {
    "id": "pithovirus",
    "name": "Pithovirus",
    "chineseName": "闊口罐病毒",
    "scientificName": "Pithovirus sibericum",
    "family": "闊口罐病毒科 (Pithoviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 1500,
    "r0": "NA (感染變形蟲)",
    "fatalityRate": "對人類無害",
    "transmission": "永凍土中發現",
    "receptor": "Phagocytosis",
    "incubation": "NA",
    "colorTheme": "#f0932b",
    "accentColor": "#ffbe76",
    "description": "自西伯利亞 3 萬年前的永凍土中被喚醒的遠古巨型病毒。外觀非常奇特，像是一個巨大的橢圓形酒罐 (Amphora) 或保溫瓶，一端還塞有一個蜂窩狀的『軟木塞』。",
    "symptoms": "不感染人類。僅感染特定種類的變形蟲。",
    "keyFeatures": [
        "體積最大的病毒之一 (長達 1.5 微米)",
        "一端具有蜂窩狀網格構成的塞子 (Cork) 結構",
        "厚實的條紋狀外殼"
    ],
    "hotspots": [
        {
            "id": "pitho_cork",
            "name": "蜂窩狀塞子 (Cork)",
            "position": [
                0,
                3.5,
                0
            ],
            "camPos": [
                0,
                5,
                5
            ],
            "desc": "由網格結構組成的塞子，感染時會打開讓內部物質進入宿主。"
        }
    ],
    "clinicalRelevance": "提醒人類全球暖化可能釋放被冰封的未知遠古病原體。"
},

  "tupanvirus": {
    "id": "tupanvirus",
    "name": "Tupanvirus",
    "chineseName": "圖潘病毒",
    "scientificName": "Tupanvirus",
    "family": "擬菌病毒科 (Mimiviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 1200,
    "r0": "NA (感染變形蟲)",
    "fatalityRate": "對人類無害",
    "transmission": "極端環境與深海",
    "receptor": "Phagocytosis",
    "incubation": "NA",
    "colorTheme": "#eb4d4b",
    "accentColor": "#ff7979",
    "description": "以南美原住民雷神 Tupan 命名的巨型病毒。它擁有一個類似米米病毒的多毛二十面體頭部，但後面卻拖著一條極度粗長、佈滿肋狀結構的巨大圓柱形尾巴，是已知病毒中最長尾巴的擁有者。",
    "symptoms": "無人類感染紀錄。",
    "keyFeatures": [
        "二十面體頭部結合超長圓柱形尾部",
        "擁有已知病毒中最完整的轉譯機器 (包含 20 種胺基酸的 tRNA)"
    ],
    "hotspots": [
        {
            "id": "tupan_tail",
            "name": "巨型圓柱尾部",
            "position": [
                0,
                -2,
                0
            ],
            "camPos": [
                0,
                -2,
                6
            ],
            "desc": "佈滿纖毛的長尾巴，長度可達 1.2 微米。"
        }
    ],
    "clinicalRelevance": "其豐富的基因組進一步模糊了病毒與生命體之間的界線。"
},

  "atv": {
    "id": "atv",
    "name": "Acidianus Two-tailed Virus (ATV)",
    "chineseName": "雙尾紡錘病毒",
    "scientificName": "Acidianus two-tailed virus",
    "family": "雙尾病毒科 (Bicaudaviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 140,
    "r0": "NA (感染古菌)",
    "fatalityRate": "NA",
    "transmission": "酸性溫泉 (約 85°C, pH 1.5)",
    "receptor": "未知古菌受體",
    "incubation": "NA",
    "colorTheme": "#f9ca24",
    "accentColor": "#f6e58d",
    "description": "極端嗜熱古菌的病毒。剛從宿主細胞釋放出來時呈現『檸檬 (紡錘) 形』。奇妙的是，它在細胞外（高溫酸性環境中）會從兩端自行生長出極長的尾巴，這是首度發現能在宿主外『發育』的病毒。",
    "symptoms": "只存在於接近沸點的火山溫泉中。",
    "keyFeatures": [
        "初始為紡錘/檸檬形，後兩端生長出極長的管狀尾巴",
        "耐極高溫與強酸環境"
    ],
    "hotspots": [
        {
            "id": "atv_tails",
            "name": "細胞外發育的雙尾",
            "position": [
                0,
                4,
                0
            ],
            "camPos": [
                0,
                5,
                6
            ],
            "desc": "離開細胞後才生長出的尾巴，可能幫助它在高溫流體中尋找新宿主。"
        }
    ],
    "clinicalRelevance": "證明病毒在離開宿主細胞後，仍能發生顯著的形態學變化。"
},

  "geminivirus": {
    "id": "geminivirus",
    "name": "Geminivirus",
    "chineseName": "雙子星病毒",
    "scientificName": "Geminiviridae",
    "family": "雙子星病毒科 (Geminiviridae)",
    "category": "單股 DNA (ssDNA)",
    "sizeNm": 30,
    "r0": "NA (植物病毒)",
    "fatalityRate": "嚴重損害農作物",
    "transmission": "昆蟲媒介 (如粉蝨)",
    "receptor": "Plant cell entry",
    "incubation": "NA",
    "colorTheme": "#6ab04c",
    "accentColor": "#badc58",
    "description": "農業上極具破壞性的植物病毒。其獨特的形狀就像兩顆二十面體球黏在一起（或像一顆花生/啞鈴），故得名『雙子星』。它們的衣殼是不完整的，由兩個半顆二十面體融合而成。",
    "symptoms": "感染植物會導致葉片捲曲、黃化、植株矮小及果實變形。",
    "keyFeatures": [
        "獨一無二的『雙聯體 (Twinned)』不完整二十面體結構",
        "基因組非常微小但高度依賴宿主細胞複製"
    ],
    "hotspots": [
        {
            "id": "gemini_waist",
            "name": "融合交界處",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                1,
                3
            ],
            "desc": "兩個衣殼球體融合的赤道地帶，共用部分衣殼蛋白環。"
        }
    ],
    "clinicalRelevance": "對全球番茄、木薯、棉花等經濟作物造成毀滅性損失。"
},

  "tmv": {
    "id": "tmv",
    "name": "Tobacco Mosaic Virus (TMV)",
    "chineseName": "菸草鑲嵌病毒",
    "scientificName": "Tobacco mosaic virus",
    "family": "帚狀病毒科 (Virgaviridae)",
    "category": "正股單股 RNA (+ssRNA)",
    "sizeNm": 300,
    "r0": "NA",
    "fatalityRate": "NA",
    "transmission": "機械接觸傳播 (汁液)",
    "receptor": "Plant cell wall damage",
    "incubation": "NA",
    "colorTheme": "#badc58",
    "accentColor": "#6ab04c",
    "description": "人類歷史上第一個被發現的病毒！外觀呈現一根長而堅硬的空心圓柱管。由數千個相同的蛋白質分子以螺旋狀緊密排列，並將 RNA 安全地包裹在螺旋內部。",
    "symptoms": "導致菸草及其他茄科植物葉片出現獨特的馬賽克狀斑駁枯黃。",
    "keyFeatures": [
        "極其完美且堅硬的螺旋管狀對稱結構",
        "高度穩定，甚至能在雪茄菸葉中存活數年"
    ],
    "hotspots": [
        {
            "id": "tmv_helix",
            "name": "螺旋蛋白質管",
            "position": [
                0,
                2,
                0
            ],
            "camPos": [
                0,
                3,
                5
            ],
            "requiresCutaway": true,
            "desc": "由 2130 個外殼蛋白分子堆疊成的堅固空心管，內部纏繞著單股 RNA。"
        }
    ],
    "clinicalRelevance": "奠定了病毒學的基礎，也是奈米科技中常用的自組裝生物材料。"
},

  "m13": {
    "id": "m13",
    "name": "M13 Phage",
    "chineseName": "M13 噬菌體",
    "scientificName": "Escherichia virus M13",
    "family": "絲狀噬菌體科 (Inoviridae)",
    "category": "單股 DNA (ssDNA)",
    "sizeNm": 900,
    "r0": "NA",
    "fatalityRate": "不殺死宿主 (慢性釋放)",
    "transmission": "感染大腸桿菌的性菌毛",
    "receptor": "F pilus (大腸桿菌)",
    "incubation": "NA",
    "colorTheme": "#c7ecee",
    "accentColor": "#dff9fb",
    "description": "一種感染大腸桿菌的絲狀噬菌體。與一般硬挺的桿狀病毒不同，M13 看起來像是一條極長、極細且柔軟的麵條。更特別的是，它不會使細菌破裂，而是持續像擠牙膏般從細菌表面分泌出來。",
    "symptoms": "不致死細菌，但會使細菌生長緩慢，形成混濁斑。",
    "keyFeatures": [
        "長度可達 900 nm、直徑僅 6 nm 的極細柔絲結構",
        "末端有負責辨識宿主菌毛的特殊吸附蛋白"
    ],
    "hotspots": [
        {
            "id": "m13_tip",
            "name": "吸附末端 (pIII 蛋白)",
            "position": [
                0,
                4.5,
                0
            ],
            "camPos": [
                0,
                5.5,
                3
            ],
            "desc": "位於長絲末端，是結合大腸桿菌 F 菌毛的關鍵鑰匙。"
        }
    ],
    "clinicalRelevance": "分子生物學上的明星，常被用於噬菌體展示技術 (Phage Display)，2018 年獲諾貝爾化學獎。"
},

  "acv": {
    "id": "acv",
    "name": "Aeropyrum Coil-shaped Virus (ACV)",
    "chineseName": "彈簧病毒",
    "scientificName": "Aeropyrum coil-shaped virus",
    "family": "未分類 (Unassigned)",
    "category": "單股 DNA (ssDNA)",
    "sizeNm": 230,
    "r0": "NA (古菌病毒)",
    "fatalityRate": "NA",
    "transmission": "深海熱泉",
    "receptor": "未知",
    "incubation": "NA",
    "colorTheme": "#ffbe76",
    "accentColor": "#f0932b",
    "description": "在深海熱液噴泉的超嗜熱古菌中發現。是全世界已知唯一呈現『中空圓柱彈簧 (Coil)』形狀的病毒，就像一圈一圈捲起來的電話線或螺旋彈簧。",
    "symptoms": "生存在溫度高達 90-100°C 的極端環境中。",
    "keyFeatures": [
        "獨特的中空螺旋彈簧外觀",
        "由單一蛋白纖維捲曲而成"
    ],
    "hotspots": [
        {
            "id": "acv_coil",
            "name": "彈簧螺旋體",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                2,
                4
            ],
            "desc": "這種奇特的彈簧構型可能與極端環境下的結構穩定性有關。"
        }
    ],
    "clinicalRelevance": "展示了地球極端環境中生命體不可思議的幾何多樣性。"
},

  "guttavirus": {
    "id": "guttavirus",
    "name": "Guttavirus",
    "chineseName": "淚滴形病毒",
    "scientificName": "Sulfolobus newzealandicus droplet-shaped virus",
    "family": "滴狀病毒科 (Guttaviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 110,
    "r0": "NA (古菌病毒)",
    "fatalityRate": "NA",
    "transmission": "酸性溫泉",
    "receptor": "未知",
    "incubation": "NA",
    "colorTheme": "#7ed6df",
    "accentColor": "#22a6b3",
    "description": "另一種古菌病毒，外觀猶如一顆完美的『淚滴 (Droplet)』。在較尖的那一端，還長有許多如同鬍鬚般的細長尾絲，用於附著在宿主古菌的表面。",
    "symptoms": "生存於紐西蘭的高溫酸性溫泉中。",
    "keyFeatures": [
        "獨一無二的淚滴 (水滴) 形態",
        "尖端帶有密集的附著纖維 (Beard-like tail)"
    ],
    "hotspots": [
        {
            "id": "gutta_beard",
            "name": "尖端附著鬚 (Tail Fibers)",
            "position": [
                0,
                -1.5,
                0
            ],
            "camPos": [
                0,
                -2,
                4
            ],
            "desc": "位於淚滴尖端，幫助病毒在沸騰的水流中牢牢抓住宿主。"
        }
    ],
    "clinicalRelevance": "研究其外殼如何在高溫酸性下維持不對稱形狀，對材料科學具啟發性。"
},

  "astrovirus": {
    "id": "astrovirus",
    "name": "Astrovirus",
    "chineseName": "星狀病毒",
    "scientificName": "Mamastrovirus",
    "family": "星狀病毒科 (Astroviridae)",
    "category": "正股單股 RNA (+ssRNA)",
    "sizeNm": 35,
    "r0": "高",
    "fatalityRate": "極低",
    "transmission": "糞口傳播",
    "receptor": "未知",
    "incubation": "1 - 4 天",
    "colorTheme": "#e056fd",
    "accentColor": "#be2edd",
    "description": "兒童腸胃炎的常見原因。之所以命名為『星狀』，是因為在電子顯微鏡下，大約 10% 的病毒顆粒表面會呈現出極為明顯、完美的五角星或六角星圖案。",
    "symptoms": "引起嬰幼兒、老年人腹瀉、嘔吐、腹痛與發燒。",
    "keyFeatures": [
        "無包膜微小病毒，表面帶有突出的星形幾何脊線",
        "對環境具強大抵抗力"
    ],
    "hotspots": [
        {
            "id": "astro_star",
            "name": "星狀脊線 (Star-like Morphology)",
            "position": [
                0,
                1.5,
                0
            ],
            "camPos": [
                0,
                2,
                4
            ],
            "desc": "衣殼蛋白突出形成的明顯星形圖案，是診斷上的重要特徵。"
        }
    ],
    "clinicalRelevance": "目前無疫苗，主要以補充水分等支持性療法為主。"
},

  "baculovirus": {
    "id": "baculovirus",
    "name": "Baculovirus",
    "chineseName": "桿狀病毒",
    "scientificName": "Baculoviridae",
    "family": "桿狀病毒科 (Baculoviridae)",
    "category": "環狀雙股 DNA (dsDNA)",
    "sizeNm": 300,
    "r0": "NA (感染昆蟲)",
    "fatalityRate": "對特定害蟲具高致死率",
    "transmission": "食入受污染的植物",
    "receptor": "Midgut cells",
    "incubation": "數天",
    "colorTheme": "#4834d4",
    "accentColor": "#686de0",
    "description": "專門感染昆蟲（如毛毛蟲）的病毒。其病毒顆粒為直挺的『桿狀 (Rod)』核衣殼，有時會被包覆在一個較為寬鬆的脂質包膜內，看起來就像是一根包在透明腸衣裡的熱狗。",
    "symptoms": "使毛毛蟲爬向植物頂端後液化死亡 (所謂的殭屍病/樹頂病)。",
    "keyFeatures": [
        "直挺挺的圓柱形 (桿狀) 核衣殼",
        "自然界中常被包埋在巨大的蛋白質結晶塊 (多角體) 中以抵抗紫外線"
    ],
    "hotspots": [
        {
            "id": "baculo_nucleocapsid",
            "name": "桿狀核衣殼",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                1.5,
                5
            ],
            "requiresCutaway": true,
            "desc": "呈現完美圓柱狀的核心，內部裝載著環狀 DNA。"
        }
    ],
    "clinicalRelevance": "人類常利用它作為強效的生物農藥，或是做為在昆蟲細胞中生產重組蛋白的優良載體。"
},

  "orf": {
    "id": "orf",
    "name": "Orf Virus",
    "chineseName": "羊痘病毒",
    "scientificName": "Orf virus",
    "family": "痘病毒科 (Poxviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 260,
    "r0": "NA (人畜共通)",
    "fatalityRate": "極低 (對人)",
    "transmission": "直接接觸受感染的羊隻病灶",
    "receptor": "未知",
    "incubation": "3 - 7 天",
    "colorTheme": "#ff7979",
    "accentColor": "#ff4d4d",
    "description": "一種感染綿羊與山羊的痘病毒。與天花、猴痘不同，羊痘病毒的外觀呈現『卵圓形』或『膠囊狀』，而且表面覆蓋著由長條蛋白纏繞成的交叉螺旋紋路，看起來就像一團毛線球。",
    "symptoms": "在羊隻的嘴唇周圍引起結痂病灶。接觸感染的人類手部會長出痛性結節。",
    "keyFeatures": [
        "膠囊/橢圓形外觀，缺乏一般痘病毒的磚塊特徵",
        "表面具有連續不斷的十字交叉螺旋紋理 (毛線球狀)"
    ],
    "hotspots": [
        {
            "id": "orf_tubules",
            "name": "螺旋紋理 (Surface Tubules)",
            "position": [
                0,
                1.5,
                0
            ],
            "camPos": [
                0,
                3,
                5
            ],
            "desc": "由連續的蛋白質管狀物在病毒表面纏繞出的獨特花紋。"
        }
    ],
    "clinicalRelevance": "牧羊人與獸醫的職業病，通常會自行痊癒不留疤痕。"
},

  "phi29": {
    "id": "phi29",
    "name": "Phi29 Phage",
    "chineseName": "Phi29 噬菌體",
    "scientificName": "Bacillus virus phi29",
    "family": "短尾噬菌體科 (Podoviridae)",
    "category": "雙股 DNA (dsDNA)",
    "sizeNm": 80,
    "r0": "NA",
    "fatalityRate": "裂解枯草桿菌",
    "transmission": "環境",
    "receptor": "Teichoic acid",
    "incubation": "NA",
    "colorTheme": "#30336b",
    "accentColor": "#130f40",
    "description": "感染枯草桿菌的小型噬菌體。不同於 T4 的正二十面體頭部，Phi29 的頭部是明顯被『拉長』的扁長形 (Prolate icosahedron)，底下連接著一個粗短的尾部以及像裙子般的頸部附屬物。",
    "symptoms": "迅速溶解細菌細胞壁。",
    "keyFeatures": [
        "特殊的延長型 (Prolate) 二十面體頭部",
        "擁有一個非常精巧且強大的 DNA 包裝馬達"
    ],
    "hotspots": [
        {
            "id": "phi29_motor",
            "name": "DNA 包裝馬達",
            "position": [
                0,
                -1,
                0
            ],
            "camPos": [
                0,
                -1,
                3
            ],
            "desc": "位於頭尾交界處的環狀馬達，能將龐大的 DNA 強行加壓塞入微小的頭部。"
        }
    ],
    "clinicalRelevance": "其 DNA 聚合酶具有極強的持續合成能力，是現代全基因組擴增技術 (WGA) 的核心工具。"
},

  "phix174": {
    "id": "phix174",
    "name": "Phi X 174",
    "chineseName": "刺錘噬菌體",
    "scientificName": "Escherichia virus phiX174",
    "family": "微小噬菌體科 (Microviridae)",
    "category": "環狀單股 DNA (ssDNA)",
    "sizeNm": 30,
    "r0": "NA",
    "fatalityRate": "裂解宿主",
    "transmission": "腸道環境",
    "receptor": "LPS",
    "incubation": "NA",
    "colorTheme": "#535c68",
    "accentColor": "#95afc0",
    "description": "極微小且外觀充滿攻擊性的噬菌體。它的二十面體衣殼的 12 個頂點上，各長有一個巨大且突出的『喇叭狀』尖刺複合體，整體看起來就像古代武器中的刺錘 (Mace)。",
    "symptoms": "裂解細菌。",
    "keyFeatures": [
        "極其突出、幾乎跟本體一樣大的喇叭狀刺突",
        "史上第一個被完成全基因組定序的 DNA 生物 (由桑格 Frederick Sanger 於 1977 年完成)"
    ],
    "hotspots": [
        {
            "id": "phiX_spike",
            "name": "喇叭狀尖刺 (Spike complex)",
            "position": [
                1.5,
                1.5,
                0
            ],
            "camPos": [
                3,
                3,
                3
            ],
            "desc": "負責辨識並穿透宿主細胞膜的巨大結構。"
        }
    ],
    "clinicalRelevance": "DNA 定序史上的偉大里程碑，也是合成生物學第一個從無到有在試管中合成的病毒。"
},

  "torovirus": {
    "id": "torovirus",
    "name": "Torovirus",
    "chineseName": "環曲病毒",
    "scientificName": "Torovirus",
    "family": "冠狀病毒科 / 網巢病毒目 (Nidovirales)",
    "category": "正股單股 RNA (+ssRNA)",
    "sizeNm": 140,
    "r0": "NA",
    "fatalityRate": "NA",
    "transmission": "糞口傳染",
    "receptor": "未知",
    "incubation": "NA",
    "colorTheme": "#f6e58d",
    "accentColor": "#f9ca24",
    "description": "與冠狀病毒是遠親，外表同樣有著棒狀的棘突。但如果在電子顯微鏡下將它切開，會發現其內部的核衣殼不是無定形的，而是呈現完美的『甜甜圈狀 (Torus)』或『腎臟形』，故得名 Torovirus。",
    "symptoms": "主要引起牛、馬、豬的腸胃炎，偶爾在人類嬰幼兒引發腹瀉。",
    "keyFeatures": [
        "擁有明顯棒狀棘突的脂質包膜",
        "核心含有一個緊密纏繞成甜甜圈/管狀環狀的核衣殼"
    ],
    "hotspots": [
        {
            "id": "toro_donut",
            "name": "甜甜圈核衣殼 (Torus Nucleocapsid)",
            "position": [
                0,
                0,
                0
            ],
            "camPos": [
                0,
                1.5,
                4
            ],
            "requiresCutaway": true,
            "desc": "中空環狀的核衣殼，讓這種病毒在形態學上獨樹一幟。"
        }
    ],
    "clinicalRelevance": "獸醫學上的重要病原，提醒人類病毒核心可以有極為規律的奇何形態。"
}
};

// 匯出全域變數供前端使用
if (typeof window !== "undefined") {
  window.VIRUS_DATABASE = VIRUS_DATABASE;
}
