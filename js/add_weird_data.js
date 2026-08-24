const fs = require('fs');
const path = require('path');

const dataPath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusData.js');
let code = fs.readFileSync(dataPath, 'utf8');

const newViruses = {
  "mimivirus": {
    id: "mimivirus",
    name: "Mimivirus",
    chineseName: "米米病毒 (巨型多毛病毒)",
    scientificName: "Acanthamoeba polyphaga mimivirus",
    family: "擬菌病毒科 (Mimiviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 750,
    r0: "NA (感染變形蟲)",
    fatalityRate: "對人類無明顯致病性",
    transmission: "環境水體、變形蟲宿主",
    receptor: "Phagocytosis",
    incubation: "NA",
    colorTheme: "#686de0",
    accentColor: "#4834d4",
    description: "史上首批被發現的『巨型病毒 (Giant Virus)』之一，體積大到可用光學顯微鏡觀察，甚至一度被誤認為細菌。外表覆蓋濃密的纖維毛，並具有一個極為特殊的五角星形『星門 (Stargate)』結構用於釋放 DNA。",
    symptoms: "主要感染阿米巴原蟲。偶有研究指出可能與人類肺炎有關，但證據尚未確立。",
    keyFeatures: [
      "超巨大的二十面體衣殼，表面覆蓋厚厚的糖蛋白纖維",
      "其中一個頂點具備『星門 (Stargate)』開口結構",
      "擁有極其龐大且複雜的基因組"
    ],
    hotspots: [
      { id: "mimi_stargate", name: "星門 (Stargate)", position: [0, 4.5, 0], camPos: [0, 6, 6], desc: "感染宿主後，這個五角星狀的裂口會打開，釋放內部的膜質核心與 DNA。" },
      { id: "mimi_fibers", name: "糖蛋白絨毛", position: [3, 0, 0], camPos: [5, 0, 4], desc: "覆蓋在病毒表面的密集纖維，可能用於吸引變形蟲吞噬。" }
    ],
    clinicalRelevance: "開啟了人類對巨型病毒與生命起源界線的新認知。"
  },
  "pithovirus": {
    id: "pithovirus",
    name: "Pithovirus",
    chineseName: "闊口罐病毒",
    scientificName: "Pithovirus sibericum",
    family: "闊口罐病毒科 (Pithoviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 1500,
    r0: "NA (感染變形蟲)",
    fatalityRate: "對人類無害",
    transmission: "永凍土中發現",
    receptor: "Phagocytosis",
    incubation: "NA",
    colorTheme: "#f0932b",
    accentColor: "#ffbe76",
    description: "自西伯利亞 3 萬年前的永凍土中被喚醒的遠古巨型病毒。外觀非常奇特，像是一個巨大的橢圓形酒罐 (Amphora) 或保溫瓶，一端還塞有一個蜂窩狀的『軟木塞』。",
    symptoms: "不感染人類。僅感染特定種類的變形蟲。",
    keyFeatures: [
      "體積最大的病毒之一 (長達 1.5 微米)",
      "一端具有蜂窩狀網格構成的塞子 (Cork) 結構",
      "厚實的條紋狀外殼"
    ],
    hotspots: [
      { id: "pitho_cork", name: "蜂窩狀塞子 (Cork)", position: [0, 3.5, 0], camPos: [0, 5, 5], desc: "由網格結構組成的塞子，感染時會打開讓內部物質進入宿主。" }
    ],
    clinicalRelevance: "提醒人類全球暖化可能釋放被冰封的未知遠古病原體。"
  },
  "tupanvirus": {
    id: "tupanvirus",
    name: "Tupanvirus",
    chineseName: "圖潘病毒",
    scientificName: "Tupanvirus",
    family: "擬菌病毒科 (Mimiviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 1200,
    r0: "NA (感染變形蟲)",
    fatalityRate: "對人類無害",
    transmission: "極端環境與深海",
    receptor: "Phagocytosis",
    incubation: "NA",
    colorTheme: "#eb4d4b",
    accentColor: "#ff7979",
    description: "以南美原住民雷神 Tupan 命名的巨型病毒。它擁有一個類似米米病毒的多毛二十面體頭部，但後面卻拖著一條極度粗長、佈滿肋狀結構的巨大圓柱形尾巴，是已知病毒中最長尾巴的擁有者。",
    symptoms: "無人類感染紀錄。",
    keyFeatures: [
      "二十面體頭部結合超長圓柱形尾部",
      "擁有已知病毒中最完整的轉譯機器 (包含 20 種胺基酸的 tRNA)"
    ],
    hotspots: [
      { id: "tupan_tail", name: "巨型圓柱尾部", position: [0, -2, 0], camPos: [0, -2, 6], desc: "佈滿纖毛的長尾巴，長度可達 1.2 微米。" }
    ],
    clinicalRelevance: "其豐富的基因組進一步模糊了病毒與生命體之間的界線。"
  },
  "atv": {
    id: "atv",
    name: "Acidianus Two-tailed Virus (ATV)",
    chineseName: "雙尾紡錘病毒",
    scientificName: "Acidianus two-tailed virus",
    family: "雙尾病毒科 (Bicaudaviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 140, // excluding tails
    r0: "NA (感染古菌)",
    fatalityRate: "NA",
    transmission: "酸性溫泉 (約 85°C, pH 1.5)",
    receptor: "未知古菌受體",
    incubation: "NA",
    colorTheme: "#f9ca24",
    accentColor: "#f6e58d",
    description: "極端嗜熱古菌的病毒。剛從宿主細胞釋放出來時呈現『檸檬 (紡錘) 形』。奇妙的是，它在細胞外（高溫酸性環境中）會從兩端自行生長出極長的尾巴，這是首度發現能在宿主外『發育』的病毒。",
    symptoms: "只存在於接近沸點的火山溫泉中。",
    keyFeatures: [
      "初始為紡錘/檸檬形，後兩端生長出極長的管狀尾巴",
      "耐極高溫與強酸環境"
    ],
    hotspots: [
      { id: "atv_tails", name: "細胞外發育的雙尾", position: [0, 4, 0], camPos: [0, 5, 6], desc: "離開細胞後才生長出的尾巴，可能幫助它在高溫流體中尋找新宿主。" }
    ],
    clinicalRelevance: "證明病毒在離開宿主細胞後，仍能發生顯著的形態學變化。"
  },
  "geminivirus": {
    id: "geminivirus",
    name: "Geminivirus",
    chineseName: "雙子星病毒",
    scientificName: "Geminiviridae",
    family: "雙子星病毒科 (Geminiviridae)",
    category: "單鏈 DNA (ssDNA)",
    sizeNm: 30, // 18x30 nm
    r0: "NA (植物病毒)",
    fatalityRate: "嚴重損害農作物",
    transmission: "昆蟲媒介 (如粉蝨)",
    receptor: "Plant cell entry",
    incubation: "NA",
    colorTheme: "#6ab04c",
    accentColor: "#badc58",
    description: "農業上極具破壞性的植物病毒。其獨特的形狀就像兩顆二十面體球黏在一起（或像一顆花生/啞鈴），故得名『雙子星』。它們的衣殼是不完整的，由兩個半顆二十面體融合而成。",
    symptoms: "感染植物會導致葉片捲曲、黃化、植株矮小及果實變形。",
    keyFeatures: [
      "獨一無二的『雙聯體 (Twinned)』不完整二十面體結構",
      "基因組非常微小但高度依賴宿主細胞複製"
    ],
    hotspots: [
      { id: "gemini_waist", name: "融合交界處", position: [0, 0, 0], camPos: [0, 1, 3], desc: "兩個衣殼球體融合的赤道地帶，共用部分衣殼蛋白環。" }
    ],
    clinicalRelevance: "對全球番茄、木薯、棉花等經濟作物造成毀滅性損失。"
  },
  "tmv": {
    id: "tmv",
    name: "Tobacco Mosaic Virus (TMV)",
    chineseName: "菸草鑲嵌病毒",
    scientificName: "Tobacco mosaic virus",
    family: "帚狀病毒科 (Virgaviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 300, // 300x18 nm
    r0: "NA",
    fatalityRate: "NA",
    transmission: "機械接觸傳播 (汁液)",
    receptor: "Plant cell wall damage",
    incubation: "NA",
    colorTheme: "#badc58",
    accentColor: "#6ab04c",
    description: "人類歷史上第一個被發現的病毒！外觀呈現一根長而堅硬的空心圓柱管。由數千個相同的蛋白質分子以螺旋狀緊密排列，並將 RNA 安全地包裹在螺旋內部。",
    symptoms: "導致菸草及其他茄科植物葉片出現獨特的馬賽克狀斑駁枯黃。",
    keyFeatures: [
      "極其完美且堅硬的螺旋管狀對稱結構",
      "高度穩定，甚至能在雪茄菸葉中存活數年"
    ],
    hotspots: [
      { id: "tmv_helix", name: "螺旋蛋白質管", position: [0, 2, 0], camPos: [0, 3, 5], requiresCutaway: true, desc: "由 2130 個外殼蛋白分子堆疊成的堅固空心管，內部纏繞著單股 RNA。" }
    ],
    clinicalRelevance: "奠定了病毒學的基礎，也是奈米科技中常用的自組裝生物材料。"
  },
  "m13": {
    id: "m13",
    name: "M13 Phage",
    chineseName: "M13 噬菌體",
    scientificName: "Escherichia virus M13",
    family: "絲狀噬菌體科 (Inoviridae)",
    category: "單鏈 DNA (ssDNA)",
    sizeNm: 900, // 900x6 nm
    r0: "NA",
    fatalityRate: "不殺死宿主 (慢性釋放)",
    transmission: "感染大腸桿菌的性菌毛",
    receptor: "F pilus (大腸桿菌)",
    incubation: "NA",
    colorTheme: "#c7ecee",
    accentColor: "#dff9fb",
    description: "一種感染大腸桿菌的絲狀噬菌體。與一般硬挺的桿狀病毒不同，M13 看起來像是一條極長、極細且柔軟的麵條。更特別的是，它不會使細菌破裂，而是持續像擠牙膏般從細菌表面分泌出來。",
    symptoms: "不致死細菌，但會使細菌生長緩慢，形成混濁斑。",
    keyFeatures: [
      "長度可達 900 nm、直徑僅 6 nm 的極細柔絲結構",
      "末端有負責辨識宿主菌毛的特殊吸附蛋白"
    ],
    hotspots: [
      { id: "m13_tip", name: "吸附末端 (pIII 蛋白)", position: [0, 4.5, 0], camPos: [0, 5.5, 3], desc: "位於長絲末端，是結合大腸桿菌 F 菌毛的關鍵鑰匙。" }
    ],
    clinicalRelevance: "分子生物學上的明星，常被用於噬菌體展示技術 (Phage Display)，2018 年獲諾貝爾化學獎。"
  },
  "acv": {
    id: "acv",
    name: "Aeropyrum Coil-shaped Virus (ACV)",
    chineseName: "彈簧病毒",
    scientificName: "Aeropyrum coil-shaped virus",
    family: "未分類 (Unassigned)",
    category: "單鏈 DNA (ssDNA)",
    sizeNm: 230,
    r0: "NA (古菌病毒)",
    fatalityRate: "NA",
    transmission: "深海熱泉",
    receptor: "未知",
    incubation: "NA",
    colorTheme: "#ffbe76",
    accentColor: "#f0932b",
    description: "在深海熱液噴泉的超嗜熱古菌中發現。是全世界已知唯一呈現『中空圓柱彈簧 (Coil)』形狀的病毒，就像一圈一圈捲起來的電話線或螺旋彈簧。",
    symptoms: "生存在溫度高達 90-100°C 的極端環境中。",
    keyFeatures: [
      "獨特的中空螺旋彈簧外觀",
      "由單一蛋白纖維捲曲而成"
    ],
    hotspots: [
      { id: "acv_coil", name: "彈簧螺旋體", position: [0, 0, 0], camPos: [0, 2, 4], desc: "這種奇特的彈簧構型可能與極端環境下的結構穩定性有關。" }
    ],
    clinicalRelevance: "展示了地球極端環境中生命體不可思議的幾何多樣性。"
  },
  "guttavirus": {
    id: "guttavirus",
    name: "Guttavirus",
    chineseName: "淚滴形病毒",
    scientificName: "Sulfolobus newzealandicus droplet-shaped virus",
    family: "滴狀病毒科 (Guttaviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 110, // 70x110 nm
    r0: "NA (古菌病毒)",
    fatalityRate: "NA",
    transmission: "酸性溫泉",
    receptor: "未知",
    incubation: "NA",
    colorTheme: "#7ed6df",
    accentColor: "#22a6b3",
    description: "另一種古菌病毒，外觀猶如一顆完美的『淚滴 (Droplet)』。在較尖的那一端，還長有許多如同鬍鬚般的細長尾絲，用於附著在宿主古菌的表面。",
    symptoms: "生存於紐西蘭的高溫酸性溫泉中。",
    keyFeatures: [
      "獨一無二的淚滴 (水滴) 形態",
      "尖端帶有密集的附著纖維 (Beard-like tail)"
    ],
    hotspots: [
      { id: "gutta_beard", name: "尖端附著鬚 (Tail Fibers)", position: [0, -1.5, 0], camPos: [0, -2, 4], desc: "位於淚滴尖端，幫助病毒在沸騰的水流中牢牢抓住宿主。" }
    ],
    clinicalRelevance: "研究其外殼如何在高溫酸性下維持不對稱形狀，對材料科學具啟發性。"
  },
  "astrovirus": {
    id: "astrovirus",
    name: "Astrovirus",
    chineseName: "星狀病毒",
    scientificName: "Mamastrovirus",
    family: "星狀病毒科 (Astroviridae)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 35,
    r0: "高",
    fatalityRate: "極低",
    transmission: "糞口傳播",
    receptor: "未知",
    incubation: "1 - 4 天",
    colorTheme: "#e056fd",
    accentColor: "#be2edd",
    description: "兒童腸胃炎的常見原因。之所以命名為『星狀』，是因為在電子顯微鏡下，大約 10% 的病毒顆粒表面會呈現出極為明顯、完美的五角星或六角星圖案。",
    symptoms: "引起嬰幼兒、老年人腹瀉、嘔吐、腹痛與發燒。",
    keyFeatures: [
      "無包膜微小病毒，表面帶有突出的星形幾何脊線",
      "對環境具強大抵抗力"
    ],
    hotspots: [
      { id: "astro_star", name: "星狀脊線 (Star-like Morphology)", position: [0, 1.5, 0], camPos: [0, 2, 4], desc: "衣殼蛋白突出形成的明顯星形圖案，是診斷上的重要特徵。" }
    ],
    clinicalRelevance: "目前無疫苗，主要以補充水分等支持性療法為主。"
  },
  "baculovirus": {
    id: "baculovirus",
    name: "Baculovirus",
    chineseName: "桿狀病毒",
    scientificName: "Baculoviridae",
    family: "桿狀病毒科 (Baculoviridae)",
    category: "環狀雙鏈 DNA (dsDNA)",
    sizeNm: 300,
    r0: "NA (感染昆蟲)",
    fatalityRate: "對特定害蟲具高致死率",
    transmission: "食入受污染的植物",
    receptor: "Midgut cells",
    incubation: "數天",
    colorTheme: "#4834d4",
    accentColor: "#686de0",
    description: "專門感染昆蟲（如毛毛蟲）的病毒。其病毒顆粒為直挺的『桿狀 (Rod)』核衣殼，有時會被包覆在一個較為寬鬆的脂質包膜內，看起來就像是一根包在透明腸衣裡的熱狗。",
    symptoms: "使毛毛蟲爬向植物頂端後液化死亡 (所謂的殭屍病/樹頂病)。",
    keyFeatures: [
      "直挺挺的圓柱形 (桿狀) 核衣殼",
      "自然界中常被包埋在巨大的蛋白質結晶塊 (多角體) 中以抵抗紫外線"
    ],
    hotspots: [
      { id: "baculo_nucleocapsid", name: "桿狀核衣殼", position: [0, 0, 0], camPos: [0, 1.5, 5], requiresCutaway: true, desc: "呈現完美圓柱狀的核心，內部裝載著環狀 DNA。" }
    ],
    clinicalRelevance: "人類常利用它作為強效的生物農藥，或是做為在昆蟲細胞中生產重組蛋白的優良載體。"
  },
  "orf": {
    id: "orf",
    name: "Orf Virus",
    chineseName: "羊痘病毒",
    scientificName: "Orf virus",
    family: "痘病毒科 (Poxviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 260,
    r0: "NA (人畜共通)",
    fatalityRate: "極低 (對人)",
    transmission: "直接接觸受感染的羊隻病灶",
    receptor: "未知",
    incubation: "3 - 7 天",
    colorTheme: "#ff7979",
    accentColor: "#ff4d4d",
    description: "一種感染綿羊與山羊的痘病毒。與天花、猴痘不同，羊痘病毒的外觀呈現『卵圓形』或『膠囊狀』，而且表面覆蓋著由長條蛋白纏繞成的交叉螺旋紋路，看起來就像一團毛線球。",
    symptoms: "在羊隻的嘴唇周圍引起結痂病灶。接觸感染的人類手部會長出痛性結節。",
    keyFeatures: [
      "膠囊/橢圓形外觀，缺乏一般痘病毒的磚塊特徵",
      "表面具有連續不斷的十字交叉螺旋紋理 (毛線球狀)"
    ],
    hotspots: [
      { id: "orf_tubules", name: "螺旋紋理 (Surface Tubules)", position: [0, 1.5, 0], camPos: [0, 3, 5], desc: "由連續的蛋白質管狀物在病毒表面纏繞出的獨特花紋。" }
    ],
    clinicalRelevance: "牧羊人與獸醫的職業病，通常會自行痊癒不留疤痕。"
  },
  "phi29": {
    id: "phi29",
    name: "Phi29 Phage",
    chineseName: "Phi29 噬菌體",
    scientificName: "Bacillus virus phi29",
    family: "短尾噬菌體科 (Podoviridae)",
    category: "雙鏈 DNA (dsDNA)",
    sizeNm: 80, // Head ~40x50, small tail
    r0: "NA",
    fatalityRate: "裂解枯草桿菌",
    transmission: "環境",
    receptor: "Teichoic acid",
    incubation: "NA",
    colorTheme: "#30336b",
    accentColor: "#130f40",
    description: "感染枯草桿菌的小型噬菌體。不同於 T4 的正二十面體頭部，Phi29 的頭部是明顯被『拉長』的扁長形 (Prolate icosahedron)，底下連接著一個粗短的尾部以及像裙子般的頸部附屬物。",
    symptoms: "迅速溶解細菌細胞壁。",
    keyFeatures: [
      "特殊的延長型 (Prolate) 二十面體頭部",
      "擁有一個非常精巧且強大的 DNA 包裝馬達"
    ],
    hotspots: [
      { id: "phi29_motor", name: "DNA 包裝馬達", position: [0, -1, 0], camPos: [0, -1, 3], desc: "位於頭尾交界處的環狀馬達，能將龐大的 DNA 強行加壓塞入微小的頭部。" }
    ],
    clinicalRelevance: "其 DNA 聚合酶具有極強的持續合成能力，是現代全基因組擴增技術 (WGA) 的核心工具。"
  },
  "phix174": {
    id: "phix174",
    name: "Phi X 174",
    chineseName: "刺錘噬菌體",
    scientificName: "Escherichia virus phiX174",
    family: "微小噬菌體科 (Microviridae)",
    category: "環狀單鏈 DNA (ssDNA)",
    sizeNm: 30,
    r0: "NA",
    fatalityRate: "裂解宿主",
    transmission: "腸道環境",
    receptor: "LPS",
    incubation: "NA",
    colorTheme: "#535c68",
    accentColor: "#95afc0",
    description: "極微小且外觀充滿攻擊性的噬菌體。它的二十面體衣殼的 12 個頂點上，各長有一個巨大且突出的『喇叭狀』尖刺複合體，整體看起來就像古代武器中的刺錘 (Mace)。",
    symptoms: "裂解細菌。",
    keyFeatures: [
      "極其突出、幾乎跟本體一樣大的喇叭狀刺突",
      "史上第一個被完成全基因組定序的 DNA 生物 (由桑格 Frederick Sanger 於 1977 年完成)"
    ],
    hotspots: [
      { id: "phiX_spike", name: "喇叭狀尖刺 (Spike complex)", position: [1.5, 1.5, 0], camPos: [3, 3, 3], desc: "負責辨識並穿透宿主細胞膜的巨大結構。" }
    ],
    clinicalRelevance: "DNA 定序史上的偉大里程碑，也是合成生物學第一個從無到有在試管中合成的病毒。"
  },
  "torovirus": {
    id: "torovirus",
    name: "Torovirus",
    chineseName: "環曲病毒",
    scientificName: "Torovirus",
    family: "冠狀病毒科 / 網巢病毒目 (Nidovirales)",
    category: "正鏈單股 RNA (+ssRNA)",
    sizeNm: 140,
    r0: "NA",
    fatalityRate: "NA",
    transmission: "糞口傳染",
    receptor: "未知",
    incubation: "NA",
    colorTheme: "#f6e58d",
    accentColor: "#f9ca24",
    description: "與冠狀病毒是遠親，外表同樣有著棒狀的棘突。但如果在電子顯微鏡下將它切開，會發現其內部的核衣殼不是無定形的，而是呈現完美的『甜甜圈狀 (Torus)』或『腎臟形』，故得名 Torovirus。",
    symptoms: "主要引起牛、馬、豬的腸胃炎，偶爾在人類嬰幼兒引發腹瀉。",
    keyFeatures: [
      "擁有明顯棒狀棘突的脂質包膜",
      "核心含有一個緊密纏繞成甜甜圈/管狀環狀的核衣殼"
    ],
    hotspots: [
      { id: "toro_donut", name: "甜甜圈核衣殼 (Torus Nucleocapsid)", position: [0, 0, 0], camPos: [0, 1.5, 4], requiresCutaway: true, desc: "中空環狀的核衣殼，讓這種病毒在形態學上獨樹一幟。" }
    ],
    clinicalRelevance: "獸醫學上的重要病原，提醒人類病毒核心可以有極為規律的奇何形態。"
  }
};

const closingBraceIndex = code.lastIndexOf('};');
let newVirusesStr = '';
for (const key in newViruses) {
  newVirusesStr += ",\\n\\n  \"" + key + "\": " + JSON.stringify(newViruses[key], null, 4);
}

code = code.substring(0, closingBraceIndex) + newVirusesStr + '\\n' + code.substring(closingBraceIndex);

fs.writeFileSync(dataPath, code, 'utf8');
console.log('Added 15 weird viruses to virusData.js');
