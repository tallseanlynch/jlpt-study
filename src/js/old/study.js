// [Japanese vocabulary word, ...], please generate a JS array populated JS objects with this information:
// {
//   j: "Japanese vocabulary word",
//   e: ["English translation in 10 or less words", ...],
//   f: "Furigana of Japanese word",
//   g: "Part of speech",
//   t: "Timestamp",
//   js: ["Japanese synonyms of the Japanese word", ...],
//   ja: ["Japanese antonyms of the Japanese word", ...],
//   es: ["English synonyms of the Japanese word", ...],
//   ea: ["English antonyms of the Japanese word", ...],
//   la: [ index of matching lifeAspectsList, ... ],
//   pl: index of matching politenessLevels,
//   jl: JLPT Level of the Japanese word as a number
// }

// const LifeAspectsCircleArray = ["Health", "Medicine", "Nutrition", "Fitness", "Sports", "Leisure", "Entertainment", "Gaming", "Music", "Art", "Design", "Fashion", "Beauty", "Cooking", "Food", "Travel", "Culture", "History", "Language", "Literature", "Philosophy", "Religion", "Spirituality", "Psychology", "Sociology", "Anthropology", "Political Science", "Law", "Business", "Finance", "Marketing", "Sales", "Entrepreneurship", "Management", "Leadership", "Administration", "Public Relations", "Communication", "Journalism", "Media", "Technology", "Innovation", "Science", "Engineering", "Mathematics", "Data Science", "Analytics", "Artificial Intelligence", "Machine Learning", "Robotics", "Automation", "Logistics", "Supply Chain", "Planning", "Coordination", "Efficiency", "Environmentalism", "Sustainability", "Agriculture", "Architecture", "Construction", "Real Estate", "Transportation", "Urban Planning"]

// const politenessLevels = [
//     "Plain (Casual)",
//     "Polite (Teinei)",
//     "Respectful (Sonkeigo)",
//     "Humble (Kenjougo)",
//     "Extra-polite (Keigo)"
// ];

export const testVocab2 = [
    {
        j: "拘り",
        e: "obsession",
        f: "こだわり",
        g: "noun",
        t: 1679377772433,
        js: ["執着", "こだわる"],
        ja: ["手を抜く"],
        es: ["obsession"],
        ea: ["apathy"],
        la: [10, 11, 31, 34, 36],
        pl: 2,
        jl: 1,
        viewedTimes: [new Date().getTime()],
        correctResponseLengths: [3011, 2000, 1000],
    },
    {
        j: "底力",
        e: "inner strength",
        f: "そこぢから",
        g: "noun",
        t: 1679377772433,
        js: ["精神力", "根性"],
        ja: [],
        es: ["inner strength"],
        ea: ["weakness"],
        la: [1, 3, 31, 34],
        pl: 2,
        jl: 2
    }
]

// debug an item in html string
// `${la.map( item => `<span class="life-aspect">${(() => {console.log(item);return LifeAspectsCircleArray[item]})()}`


const displayVocab = (vocab) => {
    const {j, e, f, g, t, js, ja, es, ea, la, pl, jl } = vocab
    return (
        `
        <div class="vocab-word">
            <div class="">${e}</div>
            <div class="">${f}</div>
            <div class="">${j}</div>
            <div class="">Part of Speech: ${g}</div>
            <div class="">Date Added: ${new Date(1679595361755).getMonth(t) + 1}-${new Date(1679595361755).getDate(t)}-${new Date(1679595361755).getFullYear(t)}</div>
            <div class="">
                <span>Japanese Synonyms:</span>
                ${js.map( item => `<span class="japanese-synonym">${item}</span>`).join(', ')}
            </div>
            <div class="">
                <span>Japanese Antonyms:</span>
                ${ja.map( item => `<span class="japanese-antonym">${item}</span>`).join(', ')}
            </div>
            <div class="">
                <span>English Synonyms:</span>
                ${es.map( item => `<span class="english-synonym">${item}</span>`).join(', ')}
            </div>
            <div class="">
                <span>English Antonyms:</span>
                ${ea.map( item => `<span="english-antonym">${item}</span>`).join(', ')}
            </div>
            <div class="">
                <span>Life Aspects:</span>
                ${la.map( item => `<span class="life-aspect">${LifeAspectsCircleArray[item]}</span>`).join(', ')}
            </div>
            <div class="">
                <span>Politeness Level: ${pl}</span>
                ${politenessLevels[pl]}
            </div>
            <div class="">
                <span>JLPT Level: </span>
                ${jl}
            </div>
        </div>
        `
    )
}

const testVocab3 = [  {    j: "拘り",    e: "obsession; fixation",    f: "こだわり",    g: "noun",    t: Date.now(),    js: ["執着", "こだわり深さ"],
ja: ["解放", "解脱"],
es: ["obsession", "fixation"],
ea: [],
la: [10, 11, 16, 20, 23, 32, 33, 35, 54, 56, 60],
pl: 2,
jl: 1
},
{
j: "底力",
e: "hidden power; reserves",
f: "そこぢから",
g: "noun",
t: Date.now(),
js: ["潜在能力", "余力"],
ja: ["無力", "欠如"],
es: ["hidden power", "reserves"],
ea: [],
la: [3, 4, 8, 16, 20, 32, 33, 34, 46, 50, 53],
pl: 2,
jl: 2
}
]

const testVocab = [
    {
        j: "拘り",
        e: "obsession",
        f: "こだわり",
        g: "noun",
        t: 1679377772433,
        js: ["執着", "固執", "縛り付ける"],
        ja: ["自由", "解放", "流動的"],
        es: ["obsession", "fixation", "attachment"],
        ea: ["nonchalance", "unconcern"],
        la: [10, 16, 22, 25, 31, 34, 54, 56],
        pl: 3,
        jl: 2
    },
    {
        j: "底力",
        e: "reserve power",
        f: "そこぢから",
        g: "noun",
        t: 1679377772433,
        js: ["蓄積力", "スタミナ"],
        ja: [],
        es: ["reserve power", "hidden strength"],
        ea: [],
        la: [5, 16, 22, 28, 31, 43, 54, 59],
        pl: 2,
        jl: 2
    }
]

const LifeAspectsCircleArray = ["Health", "Medicine", "Nutrition", "Fitness", "Sports", "Leisure", "Entertainment", "Gaming", "Music", "Art", "Design", "Fashion", "Beauty", "Cooking", "Food", "Travel", "Culture", "History", "Language", "Literature", "Philosophy", "Religion", "Spirituality", "Psychology", "Sociology", "Anthropology", "Political Science", "Law", "Business", "Finance", "Marketing", "Sales", "Entrepreneurship", "Management", "Leadership", "Administration", "Public Relations", "Communication", "Journalism", "Media", "Technology", "Innovation", "Science", "Engineering", "Mathematics", "Data Science", "Analytics", "Artificial Intelligence", "Machine Learning", "Robotics", "Automation", "Logistics", "Supply Chain", "Planning", "Coordination", "Efficiency", "Environmentalism", "Sustainability", "Agriculture", "Architecture", "Construction", "Real Estate", "Transportation", "Urban Planning"]

const politenessLevels = [
    "Plain (Casual)",
    "Polite (Teinei)",
    "Respectful (Sonkeigo)",
    "Humble (Kenjougo)",
    "Extra-polite (Keigo)"
];

const lifeAspectsList = [
    "Greetings",
    "Family",
    "Housing",
    "Education",
    "Employment",
    "Hobbies",
    "Travel",
    "Shopping",
    "Food",
    "Health",
    "Sports",
    "Arts",
    "Technology",
    "Government",
    "Law",
    "Religion",
    "Weather",
    "Geography",
    "Time",
    "Numbers",
    "Colors",
    "Emotions",
    "Holidays",
    "Clothing",
    "Etiquette",
    "Finance",
    "Emergencies",
    "Language",
    "Science",
    "Nature",
    "Media",
    "History",
    "Business",
    "Finance",
    "Leadership",
    "Marketing",
    "Entrepreneurship",
    "Innovation",
    "Networking",
    "Communication",
    "Interpersonal skills",
    "Collaboration",
    "Problem-solving",
    "Decision-making",
    "Planning",
    "Time management",
    "Negotiation",
    "Public speaking",
    "Writing",
    "Research",
    "Creativity",
    "Critical thinking",
    "Data analysis",
    "Design",
    "Engineering",
    "Architecture",
    "Medicine",
    "Law enforcement",
    "Military",
    "Politics",
    "Diplomacy",
    "Immigration",
    "Diversity",
    "Globalization"
  ];

const desiredForm = {
    "j": "粗悪",
    "e": "inferior",
    "f": "そあく",
    "g": "adjective",
    "t": 1679377772433,
    "js": ['japanese synonyms'],
    "ja": ['japanese antonyms'],
    "es": ['english synonyms'],
    "ea": ['english antonyms'],
    "la": ['lifeAspectsList[Index]'],
    "pl": 'politenessLevels[Index]',
    "jl": 'JLPT Level'
}

const currentForm = {
    "j": "粗悪",
    "e": "inferior",
    "f": "そあく",
    "g": "adjective",
    "t": 1679377772433
}

export const vocabulary = [
    {
        "j": "粗悪",
        "e": "inferior",
        "f": "そあく",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "拘り",
        "e": "particular",
        "f": "こだわり",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "底力",
        "e": "hidden strength",
        "f": "そこぢから",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "節目",
        "e": "turning point",
        "f": "ふしめ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "高まる",
        "e": "rise",
        "f": "たかまる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "抜き",
        "e": "without",
        "f": "ぬき",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "減る",
        "e": "decrease",
        "f": "へる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "粗悪品",
        "e": "inferior goods",
        "f": "そあくひん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "甲虫",
        "e": "beetle",
        "f": "かぶとむし",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "普遍",
        "e": "universal",
        "f": "ふへん",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "粗末",
        "e": "plain",
        "f": "そまつ",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "ぬくもり",
        "e": "warmth",
        "f": "ぬくもり",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "人類",
        "e": "mankind",
        "f": "じんるい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "共用",
        "e": "shared",
        "f": "きょうよう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "定着",
        "e": "establishment",
        "f": "ていちゃく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "低下",
        "e": "decline",
        "f": "ていか",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "長所",
        "e": "strength",
        "f": "ちょうしょ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "役柄",
        "e": "role",
        "f": "やくがら",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "恐怖",
        "e": "fear",
        "f": "きょうふ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "規格",
        "e": "standard",
        "f": "きかく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "暗殺",
        "e": "assassination",
        "f": "あんさつ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "新聞",
        "e": "newspaper",
        "f": "しんぶん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "運び",
        "e": "transport",
        "f": "はこび",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "覧る",
        "e": "to see",
        "f": "みる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "旨",
        "e": "good",
        "f": "うまい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "海底",
        "e": "seabed",
        "f": "かいてい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "補聴器",
        "e": "hearing aid",
        "f": "ほちょうき",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "循環",
        "e": "circulation",
        "f": "じゅんかん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "苦い",
        "e": "bitter",
        "f": "にがい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "演奏",
        "e": "performance",
        "f": "えんそう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "伺う",
        "e": "ask",
        "f": "うかがう",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "確からしい",
        "e": "probable",
        "f": "たしからしい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "出版",
        "e": "publication",
        "f": "しゅっぱん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "招待",
        "e": "invitation",
        "f": "しょうたい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "余程",
        "e": "very",
        "f": "よほど",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "症状",
        "e": "symptom",
        "f": "しょうじょう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "確保",
        "e": "securing",
        "f": "かくほ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "お得意様",
        "e": "valued customer",
        "f": "おとくいさま",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "価格",
        "e": "price",
        "f": "かかく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "つつ",
        "e": "while",
        "f": "つつ",
        "g": "conjunction",
        "t": 1679377772433
    },
    {
        "j": "揃って",
        "e": "all together",
        "f": "そろって",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "倍増",
        "e": "doubling",
        "f": "ばいぞう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "底抜け",
        "e": "bottomless",
        "f": "そこぬけ",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "想像力",
        "e": "imagination",
        "f": "そうぞうりょく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "限度",
        "e": "limit",
        "f": "げんど",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "超える",
        "e": "exceed",
        "f": "こえる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "多少",
        "e": "somewhat",
        "f": "たしょう",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "多少なりとも",
        "e": "to some extent",
        "f": "たしょうなりとも",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "揃う",
        "e": "to be complete",
        "f": "そろう",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "上手い",
        "e": "skillful",
        "f": "うまい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "役",
        "e": "role",
        "f": "やく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "補い",
        "e": "supplement",
        "f": "おぎない",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "不ぞろい",
        "e": "irregular",
        "f": "ふぞろい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "主任",
        "e": "person in charge",
        "f": "しゅにん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "慣用",
        "e": "idiomatic",
        "f": "かんよう",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "作業環境",
        "e": "working environment",
        "f": "さぎょうかんきょう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "姿勢",
        "e": "posture",
        "f": "しせい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "流石",
        "e": "as expected",
        "f": "さすが",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "論理学",
        "e": "logic",
        "f": "ろんりがく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "任",
        "e": "responsibility",
        "f": "にん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "当然のことながら",
        "e": "naturally",
        "f": "とうぜんのことながら",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "中心部",
        "e": "central part",
        "f": "ちゅうしんぶ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "当然ながら",
        "e": "naturally",
        "f": "とうぜんながら",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "消化",
        "e": "digestion",
        "f": "しょうか",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "肥大",
        "e": "enlargement",
        "f": "ひだい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "中心",
        "e": "center",
        "f": "ちゅうしん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "傷",
        "e": "wound",
        "f": "きず",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "成果物",
        "e": "deliverable",
        "f": "せいかぶつ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "共",
        "e": "together",
        "f": "とも",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "求める",
        "e": "to seek",
        "f": "もとめる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "安全性",
        "e": "safety",
        "f": "あんぜんせい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "倍増し",
        "e": "doubling",
        "f": "ばいぞうし",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "情勢",
        "e": "situation",
        "f": "じょうせい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "節々",
        "e": "everywhere",
        "f": "ふしぶし",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "市場",
        "e": "market",
        "f": "しじょう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "凡ゆる",
        "e": "all",
        "f": "およそ",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "温暖化",
        "e": "global warming",
        "f": "おんだんか",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "任せる",
        "e": "to entrust",
        "f": "まかせる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "定価",
        "e": "fixed price",
        "f": "ていか",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "深度",
        "e": "depth",
        "f": "しんど",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "趣味",
        "e": "hobby",
        "f": "しゅみ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "屈める",
        "e": "to bend",
        "f": "くめる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "可能性",
        "e": "possibility",
        "f": "かのうせい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "自営業",
        "e": "self-employed",
        "f": "じえいぎょう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "3世",
        "e": "third generation",
        "f": "さんせい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "汲み取る",
        "e": "to absorb",
        "f": "くみとる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "根源",
        "e": "origin",
        "f": "こんげん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "購入",
        "e": "purchase",
        "f": "こうにゅう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "鳴らす",
        "e": "to ring",
        "f": "ならす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "役に立つ",
        "e": "to be useful",
        "f": "やくにたつ",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "吐き出す",
        "e": "to spit out",
        "f": "はきだす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "畏くも",
        "e": "awfully",
        "f": "おそろくも",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "慣らす",
        "e": "to accustom",
        "f": "ならす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "閉ざす",
        "e": "to close",
        "f": "とざす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "自ら",
        "e": "oneself",
        "f": "みずから",
        "g": "pronoun",
        "t": 1679377772433
    },
    {
        "j": "収まる",
        "e": "to settle",
        "f": "おさまる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "手間取る",
        "e": "to take time",
        "f": "てまどる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "負担",
        "e": "burden",
        "f": "ふたん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "ため息をつく",
        "e": "to sigh",
        "f": "ためいきをつく",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "文系",
        "e": "humanities",
        "f": "ぶんけい",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "比較",
        "e": "comparison",
        "f": "ひかく",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "多め",
        "e": "generous",
        "f": "おおめ",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "従って",
        "e": "accordingly",
        "f": "したがって",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "従姉妹",
        "e": "cousin",
        "f": "いとこ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "用いる",
        "e": "to use",
        "f": "もちいる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "積み出す",
        "e": "to ship out",
        "f": "つみだす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "撃つ",
        "e": "to shoot",
        "f": "うつ",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "偶発",
        "e": "accidental",
        "f": "ぐうはつ",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "流行",
        "e": "trend",
        "f": "りゅうこう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "鉄砲",
        "e": "gun",
        "f": "てっぽう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "元来",
        "e": "originally",
        "f": "がんらい",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "すでに",
        "e": "already",
        "f": "すでに",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "従う",
        "e": "to follow",
        "f": "したがう",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "独特な",
        "e": "unique",
        "f": "どくとくな",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "賢い",
        "e": "smart",
        "f": "かしこい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "偶",
        "e": "accidentally",
        "f": "たまたま",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "抑える",
        "e": "to restrain",
        "f": "おさえる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "偶然",
        "e": "coincidentally",
        "f": "ぐうぜん",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "出し抜け",
        "e": "unexpected",
        "f": "でしぬけ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "未満",
        "e": "less than",
        "f": "みまん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "一通り",
        "e": "generally",
        "f": "ひととおり",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "勤める",
        "e": "to work",
        "f": "つとめる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "ばっちり",
        "e": "perfectly",
        "f": "ばっちり",
        "g": "adverb",
        "t": 1679377772433
    },
    {
        "j": "単なる",
        "e": "mere",
        "f": "たんなる",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "狭い",
        "e": "narrow",
        "f": "せまい",
        "g": "adjective",
        "t": 1679377772433
    },
    {
        "j": "税関",
        "e": "customs",
        "f": "ぜいかん",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "掲示",
        "e": "notice",
        "f": "けいじ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "時間を潰す",
        "e": "to kill time",
        "f": "じかんをつぶす",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "感想",
        "e": "impression",
        "f": "かんそう",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "比べる",
        "e": "to compare",
        "f": "くらべる",
        "g": "verb",
        "t": 1679377772433
    },
    {
        "j": "比",
        "e": "comparison",
        "f": "ひ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "お届け済み",
        "e": "delivered",
        "f": "おとどけずみ",
        "g": "noun",
        "t": 1679377772433
    },
    {
        "j": "損じ",
        "e": "loss",
        "f": "そんじ",
        "g": "noun",
        "t": 1679377772433
    }
]

const firstListTime = 1679377772433


const text=`
粗悪
拘り
底力
節目
高まる
抜き
減る
粗悪品
甲虫
普遍
粗末
ぬくもり
人類
共用
定着
低下
長所
役柄
恐怖
規格
暗殺
新聞
運び
覧る
旨
海底
補聴器
循環
苦い

演奏
伺う
確からしい
出版
招待
余程
症状
確保
お得意様
価格
つつ
揃って
倍増
底抜け
想像力
限度
超える
多少
多少なりとも
揃う
上手い

役
補い
不ぞろい
主任
慣用
作業環境
姿勢
流石
論理学
任
当然のことながら
中心部
当然ながら
消化
肥大
中心
傷
成果物
共
求める
安全性

倍増し
情勢
節々
市場
凡ゆる
温暖化
任せる
定価
深度
趣味
屈める
可能性
自営業
3世
汲み取る
根源
購入
鳴らす
役に立つ
吐き出す
畏くも

慣らす
閉ざす
自ら
収まる
手間取る
負担
ため息をつく
文系
比較
多め
従って
従姉妹
用いる
積み出す
撃つ
偶発
流行
鉄砲
元来
すでに
従う

独特な
賢い
偶
抑える
偶然
出し抜け
未満
一通り
勤める
ばっちり
単なる
狭い
税関
掲示
時間を潰す
感想
比べる
比
お届け済み
損じ
`