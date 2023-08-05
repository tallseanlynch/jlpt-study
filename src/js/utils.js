export function removeCharacters(inputVal, characterArray) {
  for (let i = 0; i < characterArray.length; i++) {
    const regex = new RegExp(characterArray[i], "g");
    inputVal = inputVal.replace(regex, "");
  }
  return inputVal;
}

export function removeDuplicateChars(str) {
  let uniqueChars = '';

  for (let i = 0; i < str.length; i++) {
    if (uniqueChars.indexOf(str[i]) === -1) {
      uniqueChars += str[i];
    }
  }

  return uniqueChars;
}

export const createEvent = (createdEventData = {}) => {
  return {
    t: new Date().getTime(),
    ... createdEventData
  }
}

export const createScore = (s) => {
  return createEvent({s: s, type: 'score'})
}

export const createAddedDate = () => {
  return createEvent({type: 'addedDate'})
}

export const openWindowWithString = (str) => {
  const newWindow = window.open('', '_blank');
  const fontSizeInInches = .5;
  const fontSizeInPixels = fontSizeInInches * 96; // 1 inch = 96 pixels

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>String in New Window</title>
        <style>
          body {
            font-size: ${fontSizeInPixels}px;
            font-family: Arial, sans-serif;
            color: gray;
          }
        </style>
      </head>
      <body>
        ${str}
      </body>
      </html>
    `);
    newWindow.document.close();
  } else {
    alert('Unable to open a new window. Please check your browser settings.');
  }
}

export const commaSeparateList = (inputList) => {
  const lines = inputList.split('\n');
  const separatedList = lines.join(', ');
  return separatedList;
}

export const generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
export const saveToLocalStorage = (data) => {
    window.localStorage.setItem('appState', JSON.stringify(data))
}

export const loadFromLocalStorage = () => {
    return JSON.parse(window.localStorage.getItem('appState'))
}

export const searchArray = (arrayToSearch, searchVal, filterKey) => {
    return arrayToSearch.filter(kanji => String(kanji[filterKey]).toLowerCase().indexOf(String(searchVal).toLowerCase()) > -1)
}

export const transformKana = (inputString) => {
  // Check if input string is in Hiragana or Katakana
  let isHiragana = /^[\u3040-\u309F]+$/.test(inputString);
  let isKatakana = /^[\u30A0-\u30FF]+$/.test(inputString);

  // If input string is not in Hiragana or Katakana, return input string as is
  if (!isHiragana && !isKatakana) {
    return inputString;
  }

  // Convert Hiragana to Katakana or Katakana to Hiragana
  let outputString = "";
  for (let i = 0; i < inputString.length; i++) {
    let charCode = inputString.charCodeAt(i);
    if (isHiragana) {
      outputString += String.fromCharCode(charCode + 96);
    } else {
      outputString += String.fromCharCode(charCode - 96);
    }
  }
  return outputString;
}

// Katakana
export const katakana = [
    "ア", "イ", "ウ", "エ", "オ",
    "カ", "キ", "ク", "ケ", "コ",
    "サ", "シ", "ス", "セ", "ソ",
    "タ", "チ", "ツ", "テ", "ト",
    "ナ", "ニ", "ヌ", "ネ", "ノ",
    "ハ", "ヒ", "フ", "ヘ", "ホ",
    "マ", "ミ", "ム", "メ", "モ",
    "ヤ", "ユ", "ヨ",
    "ラ", "リ", "ル", "レ", "ロ",
    "ワ", "ヲ", "ン",
    "ガ", "ギ", "グ", "ゲ", "ゴ",
    "ザ", "ジ", "ズ", "ゼ", "ゾ",
    "ダ", "ヂ", "ヅ", "デ", "ド",
    "バ", "ビ", "ブ", "ベ", "ボ",
    "パ", "ピ", "プ", "ペ", "ポ",
    "ヴ"
  ];
  
  // Hiragana
  export const hiragana = [
    "あ", "い", "う", "え", "お",
    "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ",
    "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の",
    "は", "ひ", "ふ", "へ", "ほ",
    "ま", "み", "む", "め", "も",
    "や", "ゆ", "よ",
    "ら", "り", "る", "れ", "ろ",
    "わ", "を", "ん",
    "が", "ぎ", "ぐ", "げ", "ご",
    "ざ", "じ", "ず", "ぜ", "ぞ",
    "だ", "ぢ", "づ", "で", "ど",
    "ば", "び", "ぶ", "べ", "ぼ",
    "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
    "ゔ",
    "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
    "っ", "ゃ", "ゅ", "ょ",
    "ー", "、", "。", "・", "？", "！", "「", "」", "『", "』", "（", "）"
  ];
  
  // Non-Kanji
  export const nonKanji = [
    "を"
  ]

  const englishChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.split('')

  export const allNonKanji = [
    ...katakana,
    ...hiragana,
    ...nonKanji,
    ...englishChars
  ]

  export const getJSON = async (url, setter) => {    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      if(setter){setter(data)}
      return data;
      // handle data
    } catch (error) {
      console.error('Error:', error);
      return undefined;
    }

  }

  export function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
  
    return `${month}-${day}-${year}`;
  }

  export const saveUserData = (dataToSave) => {
    fetch('http://localhost:9999/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Failed to save JSON data.');
      }
    })
    .then((data) => {
      // console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  export const handleJSON = (url, method, data) => {
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      console.error(error)
    })
  }

  export const updateJSONFile = async (id, newData, url) => {
    const response = await fetch(url);
    const data = await response.json();
  
    // Find the object with the matching ID
    const objIndex = data.findIndex(obj => obj.id === id);
  
    // Update the object with the new data
    const updatedObj = { ...data[objIndex], ...newData };
    const updatedData = [
      ...data.slice(0, objIndex),
      updatedObj,
      ...data.slice(objIndex + 1)
    ];
  
    // Write the updated data back to the file
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

export const politenessLevels = [
    "Plain (Casual)",
    "Polite (Teinei)",
    "Respectful (Sonkeigo)",
    "Humble (Kenjougo)",
    "Extra-polite (Keigo)"
];

export const windowCountDown = (numberOfItems) => {
  const maxValue = window.playerInterval * numberOfItems
  window.setListPlayerIndex(0)
  window.timerValue = maxValue
  window.timerInterval = setInterval(() => {
    // console.log(window.timerValue)
    if(window.timerValue !== 0) {
      document.querySelector('#play-controller-input').focus()
      if(window.timerValue % window.playerInterval === 0 && window.timerValue < maxValue - 1) {
        window.setListPlayerIndex(window.getListPlayerIndex() + 1)
      }
      window.timerValue = window.timerValue - 1
    } else {
      window.setIsPlaying(false)
      clearInterval(window.timerInterval)
    }
  }, 1000)
  // }
}


  export const tags = {
    "v5uru": "Godan verb - Uru old class verb (old form of Eru)",
    "v2g-s": "Nidan verb (lower class) with 'gu' ending (archaic)",
    "dei": "deity",
    "ship": "ship name",
    "leg": "legend",
    "bra": "Brazilian",
    "music": "music",
    "quote": "quotation",
    "pref": "prefix",
    "ktb": "Kantou-ben",
    "rK": "rarely-used kanji form",
    "derog": "derogatory",
    "abbr": "abbreviation",
    "exp": "expressions (phrases, clauses, etc.)",
    "astron": "astronomy",
    "v2g-k": "Nidan verb (upper class) with 'gu' ending (archaic)",
    "aux-v": "auxiliary verb",
    "ctr": "counter",
    "baseb": "baseball",
    "serv": "service",
    "genet": "genetics",
    "geogr": "geography",
    "dent": "dentistry",
    "v5k-s": "Godan verb - Iku/Yuku special class",
    "horse": "horse racing",
    "ornith": "ornithology",
    "v2w-s": "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)",
    "sK": "search-only kanji form",
    "hob": "Hokkaido-ben",
    "male": "male term or language",
    "vidg": "video games",
    "n-pref": "noun, used as a prefix",
    "n-suf": "noun, used as a suffix",
    "suf": "suffix",
    "hon": "honorific or respectful (sonkeigo) language",
    "biol": "biology",
    "pol": "polite (teineigo) language",
    "vulg": "vulgar expression or word",
    "v2n-s": "Nidan verb (lower class) with 'nu' ending (archaic)",
    "mil": "military",
    "golf": "golf",
    "X": "rude or X-rated term (not displayed in educational software)",
    "sk": "search-only kana form",
    "sl": "slang",
    "fict": "fiction",
    "art": "art, aesthetics",
    "stat": "statistics",
    "cryst": "crystallography",
    "pathol": "pathology",
    "photo": "photography",
    "food": "food, cooking",
    "n": "noun (common) (futsuumeishi)",
    "thb": "Touhoku-ben",
    "fish": "fishing",
    "v5r-i": "Godan verb with 'ru' ending (irregular verb)",
    "arch": "archaic",
    "v1": "Ichidan verb",
    "bus": "business",
    "tv": "television",
    "euph": "euphemistic",
    "embryo": "embryology",
    "v2y-k": "Nidan verb (upper class) with 'yu' ending (archaic)",
    "uk": "word usually written using kana alone",
    "rare": "rare term",
    "v2a-s": "Nidan verb with 'u' ending (archaic)",
    "hanaf": "hanafuda",
    "agric": "agriculture",
    "given": "given name or forename, gender not specified",
    "physiol": "physiology",
    "v5u-s": "Godan verb with 'u' ending (special class)",
    "chn": "children's language",
    "ev": "event",
    "adv": "adverb (fukushi)",
    "prt": "particle",
    "vi": "intransitive verb",
    "v2y-s": "Nidan verb (lower class) with 'yu' ending (archaic)",
    "kyb": "Kyoto-ben",
    "vk": "Kuru verb - special class",
    "grmyth": "Greek mythology",
    "vn": "irregular nu verb",
    "electr": "electronics",
    "gardn": "gardening, horticulture",
    "adj-kari": "'kari' adjective (archaic)",
    "vr": "irregular ru verb, plain form ends with -ri",
    "vs": "noun or participle which takes the aux. verb suru",
    "vt": "transitive verb",
    "cards": "card games",
    "stockm": "stock market",
    "vz": "Ichidan verb - zuru verb (alternative form of -jiru verbs)",
    "aux": "auxiliary",
    "v2h-s": "Nidan verb (lower class) with 'hu/fu' ending (archaic)",
    "kyu": "Kyuushuu-ben",
    "noh": "noh",
    "econ": "economics",
    "rommyth": "Roman mythology",
    "ecol": "ecology",
    "n-t": "noun (temporal) (jisoumeishi)",
    "psy": "psychiatry",
    "proverb": "proverb",
    "company": "company name",
    "poet": "poetical term",
    "ateji": "ateji (phonetic) reading",
    "paleo": "paleontology",
    "v2h-k": "Nidan verb (upper class) with 'hu/fu' ending (archaic)",
    "go": "go (game)",
    "adv-to": "adverb taking the 'to' particle",
    "ent": "entomology",
    "unc": "unclassified",
    "unclass": "unclassified name",
    "on-mim": "onomatopoeic or mimetic word",
    "yoji": "yojijukugo",
    "n-adv": "adverbial noun (fukushitekimeishi)",
    "print": "printing",
    "form": "formal or literary term",
    "obj": "object",
    "osb": "Osaka-ben",
    "adj-shiku": "'shiku' adjective (archaic)",
    "Christn": "Christianity",
    "hum": "humble (kenjougo) language",
    "obs": "obsolete term",
    "relig": "religion",
    "iK": "word containing irregular kanji usage",
    "v2k-s": "Nidan verb (lower class) with 'ku' ending (archaic)",
    "conj": "conjunction",
    "v2s-s": "Nidan verb (lower class) with 'su' ending (archaic)",
    "geol": "geology",
    "geom": "geometry",
    "anat": "anatomy",
    "nab": "Nagano-ben",
    "ski": "skiing",
    "hist": "historical term",
    "fam": "familiar language",
    "myth": "mythology",
    "gramm": "grammar",
    "v2k-k": "Nidan verb (upper class) with 'ku' ending (archaic)",
    "id": "idiomatic expression",
    "v5aru": "Godan verb - -aru special class",
    "psyanal": "psychoanalysis",
    "comp": "computing",
    "creat": "creature",
    "ik": "word containing irregular kana usage",
    "oth": "other",
    "v-unspec": "verb unspecified",
    "io": "irregular okurigana usage",
    "work": "work of art, literature, music, etc. name",
    "adj-ix": "adjective (keiyoushi) - yoi/ii class",
    "phil": "philosophy",
    "doc": "document",
    "math": "mathematics",
    "pharm": "pharmacology",
    "adj-nari": "archaic/formal form of na-adjective",
    "v2r-k": "Nidan verb (upper class) with 'ru' ending (archaic)",
    "adj-f": "noun or verb acting prenominally",
    "adj-i": "adjective (keiyoushi)",
    "audvid": "audiovisual",
    "rkb": "Ryuukyuu-ben",
    "adj-t": "'taru' adjective",
    "v2r-s": "Nidan verb (lower class) with 'ru' ending (archaic)",
    "Buddh": "Buddhism",
    "biochem": "biochemistry",
    "v2b-k": "Nidan verb (upper class) with 'bu' ending (archaic)",
    "vs-s": "suru verb - special class",
    "surname": "family or surname",
    "physics": "physics",
    "place": "place name",
    "v2b-s": "Nidan verb (lower class) with 'bu' ending (archaic)",
    "kabuki": "kabuki",
    "product": "product name",
    "vs-c": "su verb - precursor to the modern suru",
    "tsug": "Tsugaru-ben",
    "adj-ku": "'ku' adjective (archaic)",
    "telec": "telecommunications",
    "vs-i": "suru verb - included",
    "v2z-s": "Nidan verb (lower class) with 'zu' ending (archaic)",
    "organization": "organization name",
    "char": "character",
    "engr": "engineering",
    "logic": "logic",
    "v2m-s": "Nidan verb (lower class) with 'mu' ending (archaic)",
    "col": "colloquial",
    "archeol": "archeology",
    "cop": "copula",
    "num": "numeric",
    "aviat": "aviation",
    "aux-adj": "auxiliary adjective",
    "m-sl": "manga slang",
    "fem": "female term or language",
    "MA": "martial arts",
    "finc": "finance",
    "v1-s": "Ichidan verb - kureru special class",
    "v2m-k": "Nidan verb (upper class) with 'mu' ending (archaic)",
    "manga": "manga",
    "shogi": "shogi",
    "group": "group",
    "adj-no": "nouns which may take the genitive case particle 'no'",
    "adj-na": "adjectival nouns or quasi-adjectives (keiyodoshi)",
    "sens": "sensitive",
    "law": "law",
    "mahj": "mahjong",
    "v4b": "Yodan verb with 'bu' ending (archaic)",
    "rail": "railway",
    "v4g": "Yodan verb with 'gu' ending (archaic)",
    "elec": "electricity, elec. eng.",
    "film": "film",
    "mining": "mining",
    "v4h": "Yodan verb with 'hu/fu' ending (archaic)",
    "v4k": "Yodan verb with 'ku' ending (archaic)",
    "v4m": "Yodan verb with 'mu' ending (archaic)",
    "v4n": "Yodan verb with 'nu' ending (archaic)",
    "sumo": "sumo",
    "v4s": "Yodan verb with 'su' ending (archaic)",
    "v4r": "Yodan verb with 'ru' ending (archaic)",
    "person": "full name of a particular person",
    "v4t": "Yodan verb with 'tsu' ending (archaic)",
    "oK": "word containing out-dated kanji or kanji usage",
    "cloth": "clothing",
    "joc": "jocular, humorous term",
    "politics": "politics",
    "v2t-k": "Nidan verb (upper class) with 'tsu' ending (archaic)",
    "tsb": "Tosa-ben",
    "v5b": "Godan verb with 'bu' ending",
    "ling": "linguistics",
    "bot": "botany",
    "v2t-s": "Nidan verb (lower class) with 'tsu' ending (archaic)",
    "v5g": "Godan verb with 'gu' ending",
    "med": "medicine",
    "v5k": "Godan verb with 'ku' ending",
    "mech": "mechanical engineering",
    "v5n": "Godan verb with 'nu' ending",
    "v5m": "Godan verb with 'mu' ending",
    "v2d-k": "Nidan verb (upper class) with 'dzu' ending (archaic)",
    "v5r": "Godan verb with 'ru' ending",
    "v5t": "Godan verb with 'tsu' ending",
    "v5s": "Godan verb with 'su' ending",
    "v5u": "Godan verb with 'u' ending",
    "Shinto": "Shinto",
    "station": "railway station",
    "dated": "dated term",
    "v2d-s": "Nidan verb (lower class) with 'dzu' ending (archaic)",
    "psych": "psychology",
    "adj-pn": "pre-noun adjectival (rentaishi)",
    "ok": "out-dated or obsolete kana usage",
    "met": "meteorology",
    "chem": "chemistry",
    "sports": "sports",
    "zool": "zoology",
    "int": "interjection (kandoushi)",
    "tradem": "trademark",
    "net-sl": "Internet slang",
    "n-pr": "proper noun",
    "archit": "architecture",
    "ksb": "Kansai-ben",
    "pn": "pronoun",
    "gikun": "gikun (meaning as reading) or jukujikun (special kanji reading)"
  }