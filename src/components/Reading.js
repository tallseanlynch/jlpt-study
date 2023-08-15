import React, { useState, useEffect } from 'react';
import { DisplayVocab } from './DisplayVocab'
import caret from '../images/caret.png'

function parseAndRenderString(sentence, parentSetter, WordComponent, readingVocab) {
    const regex = /{{(\d+):([\u3040-\u30FF\u3005\u4E00-\u9FFF]+)}}/g;
    
    let lastIndex = 0;
    const elements = [];

    let match;
    while ((match = regex.exec(sentence)) !== null) {
        // Add the text leading up to the match
        if (match.index > lastIndex) {
            elements.push(sentence.substring(lastIndex, match.index));
        }

        // Add the React component for the matched word
        const [fullMatch, id, word] = match;
        const currentScore = readingVocab && readingVocab.find(rv => rv.id === id) && readingVocab.length > 0 ? readingVocab.find(rv => rv.id === id).score : 10
        elements.push(<WordComponent key={id} id={id} word={word} parentSetter={parentSetter} score={currentScore}/>);
        // activeReadingVocab.push({id, word, score: 10})

        // Move the pointer
        lastIndex = match.index + fullMatch.length;
    }

    // If there's any text left after the last match, add it to the elements
    if (lastIndex < sentence.length) {
        elements.push(sentence.substr(lastIndex));
    }
    return elements;
  }

  function parseIds(sentence) {
    const regex = /{{(\d+):([\u3040-\u30FF\u4E00-\u9FFF]+)}}/g;
    
    let lastIndex = 0;
    const ids = [];
    let match;
    while ((match = regex.exec(sentence)) !== null) {
        const [fullMatch, id, word] = match;
        ids.push({id, word, score: 10});
        lastIndex = match.index + fullMatch.length;
    }

    return ids;
  }

  const readings = {
    // First: `{{2842928:関}}の橋の上で、{{1220880:機関車}}が通るたびに、私はその動きに{{1589880:係わる}}子供たちを見る。`,
    'A Lengthy Series': {
        japanese: `{{1590560:可成り}}と長い{{1062910:シリーズ}}の中で、私は{{1296400:在る}}書店で{{1595270:辭典}}や{{1260670:本}}を{{1207270:楽しむ}}。{{1464070:日頃}}の生活では、{{1235290:共用}}スペースや{{1239560:局}}での仕事に{{2817380:計}}を立て、{{1343410:所有者}}としての責任を{{1589060:行う}}。{{1343460:暑い}}夏の日には、{{1318480:自動販売器}}で冷たい飲み物を買い、{{1414150:大丈夫}}な場所で休憩する。{{1483150:彼女}}はよく{{1464760:日本じゅう}}を{{1598550:出掛ける}}、{{1443970:兔}}のように活発で、{{2835077:便女}}の仕事でも真面目に取り組む。{{1327120:護る}}ことの大切さを学び、{{1330270:授かる}}祝福を受け入れ、{{1306630:掌る}}技術や{{1365260:親善}}の心で日々を送る。{{2162470:独}}立した考えや{{1593430:篭もる}}性格は時々孤独を感じさせるが、友人や家族との{{1013030:縁}}がそれを癒す。{{1468620:年甲斐もない}}冗談や{{1338120:出し抜け}}のサプライズを楽しむこともあり、毎日が{{1510890:変化}}に富んでいる。`,
        english: `In a rather lengthy series, I enjoy books and dictionaries at a certain bookstore. In daily life, I set plans for shared spaces and tasks at the office, fulfilling my responsibilities as an owner. On hot summer days, I buy a cold drink from a vending machine and take a break in a comfortable place. She often travels all over Japan, as lively as a rabbit, and works diligently, even in a restroom cleaner's job. I've learned the importance of protection, accept the blessings bestowed upon me, and live every day with mastered skills and goodwill. Independent thoughts and introverted nature sometimes make me feel lonely, but bonds with friends and family heal that. I also enjoy age-inappropriate jokes and unexpected surprises, making every day rich in variation.`,
        addedDate: 1679357688000
    },
    'Exploration In City': {
        japanese: `{{2773600:再診}}を受けるために病院に向かいましたが、{{1586500:あて先}}を間違えて{{2834902:市営地下鉄}}の駅に到着しました。そこで{{1710720:訪問者}}のような気分で周りを探索し、美味しそうな{{2817630:鶏唐揚げ}}の店を見つけました。{{1526960:味}}は期待以上で、特に辛みの{{1199060:解折}}が絶妙でした。店の{{1584680:面}}は{{1602220:日焼け}}した若者で、{{1546020:洋服}}のセンスが際立っていました。彼は{{1588140:打ち合わせ}}の合間に店を運営しており、{{1602120:日々}}の経験を{{1440880:添附}}としていると話しました。店を出て、近くの公園で休憩。{{1406140:存じる}}ような{{1212330:感覚}}が心地よく、{{1344410:援ける}}風と共に{{1432710:傷む}}心が{{1292960:再生}}されるようでした。`,
        english: `I headed to the hospital for a follow-up checkup, but mistakenly arrived at a city subway station. Exploring the surroundings as if a visitor, I found a tantalizing fried chicken shop. The taste exceeded my expectations, especially the perfect balance of spiciness. The shopkeeper, a sunburned young man, had a distinct sense of fashion. He mentioned that he runs the shop in between meetings and uses his daily experiences as added value. After leaving the shop, I took a break in a nearby park. The familiar sensation was comforting, and with the supporting breeze, my weary heart felt rejuvenated.`,
        addedDate: 1679357698000
      },
      'Osaka Journey': {
        japanese: `{{2078800:大坂}}に到着した途端、{{1000390:アッという間に}}市の{{1328960:趣き}}が私を捕らえました。日が昇る{{1239280:曉}}に、古い通りで{{1440670:店員}}たちが{{2345340:作業環境}}を整え、新鮮な{{2035010:洗魚}}や様々な{{1538590:油}}を{{1199470:回収}}していました。{{2078800:大坂}}の独特な風景の中、{{1218190:企業}}のビルと古い家が{{1483540:較べる}}ように立ち並び、その{{1586420:暖い}}雰囲気に私は魅了されました。昼になると、深い{{1469890:濃い}}色の珈琲を飲みながら、通りを行き交う人々の{{1599570:何気ない}}会話や笑顔を楽しんだ。その後、{{1416680:たどり着く}}ことのできた美術館では、{{1583460:描く}}歴史や文化、そして{{2078800:大坂}}の未来についての展示が目を引いた。`,
        english: `The moment I arrived in Osaka, the city's charm instantly captivated me. At dawn, shopkeepers were preparing their work environments on old streets, collecting fresh cleaned fish and various oils. Amidst the unique scenery of Osaka, corporate buildings and old houses stood side by side, and I was enchanted by its warm atmosphere. By noon, I enjoyed casual conversations and smiles of passersby while sipping a deep, rich coffee. Later, in an art museum I stumbled upon, exhibitions about the history, culture, and future of Osaka caught my eye.`,
        addedDate: 1679357708000
      },
      'A Day In Life': {
        japanese: `{{1323080:車}}のエンジンが{{1322640:煮立つ}}ような音を立てて、私は{{1221430:帰宅}}した。{{1419860:煖房}}が部屋を暖かくしており、私の{{1002610:御腹}}はすでに夕食を求めていた。しかし、今日は{{2770250:可燃ゴミ}}の日で、{{1504200:分別}}をして{{1157440:畏まる}}気持ちでゴミを出さなければならなかった。私はキッチンでの{{1295710:細部}}に{{1327120:守る}}ことを{{1596560:率先}}して行った。夕食後、{{1356370:情報}}の修正や新しいプロジェクトに関する{{1330330:受授}}が必要だったので、私は{{1470540:脳みそを絞る}}ようにしてそれを完成させた。そして、夜が深まると、私は{{1589840:係}}の仕事や{{1279990:港}}での会議に関するメモを取りながら、リラックスして{{1304680:残念}}なニュースを避けることに決めた。`,
        english: `The car engine made a boiling noise as I returned home. The heater had already warmed up the room, and my stomach was craving dinner. However, today was combustible trash day, and with a respectful mindset, I had to sort and take out the garbage. I prioritized attending to the details in the kitchen. After dinner, I had to make corrections to some information and work on a new project, so I racked my brains to finish it. As the night deepened, while taking notes about my duties and a meeting at the port, I decided to relax and avoid any unfortunate news.`,
        addedDate: 1679357718000
      },
      'Next to the Classroom': {
        japanese: `{{1237150:教室}}の{{1555830:隣}}には{{1509290:壁}}に{{1583460:描く}}絵が{{1406100:揃い}}、{{1345940:傷物}}のように見えるが、それは生徒たちの心の{{1183330:温もり}}を{{1212270:感じ取る}}ことができる。{{1220880:機関車}}の{{1585080:卵型}}の窓から{{1598590:問い合わせ}}を{{1467530:認める}}。{{1256170:健康}}を保つために{{1227560:休む}}ことが大事だが、{{1295530:細かい}}{{1355540:戯談}}や{{1325360:主権}}に関する議論は{{1603930:混る}}。{{1603050:ふる里}}の{{1597480:着々}}とした進展や、{{1169780:飲み干す}}前の{{1568150:魣}}の{{1295480:細々}}とした話は、{{1002420:お報せ}}として{{1449530:報え}}が入った。`,
        english: `Next to the classroom, there are paintings on the wall that look like damaged goods, but one can feel the warmth of the students' hearts from them. The egg-shaped window of the locomotive acknowledges the inquiries. It's essential to rest to maintain health, yet the detailed jokes and discussions about sovereignty get mixed up. News about the gradual progress of our hometown and the tiny tales of the ray before it's entirely consumed came as notifications.`,
        addedDate: 1679357728000
      },
      'Green Tea': {
        japanese: `{{1318090:自然}}の中で{{1644870:緑茶}}を啜りながら、{{1609180:苛め}}を受けている子供を{{1344410:助ける}}ことは{{1351760:詳細}}に{{1360380:審査}}される{{1222970:規格}}以上の行為だ。{{1483150:彼女}}は{{1214270:簡易}}な{{1291880:座席}}で、{{2261510:小母さん}}との{{1212270:感じ取る}}会話を楽しんでいる。{{1594060:倖せ}}は{{1386730:絶え間無く}}流れ、{{1198660:会場}}では{{1596920:蛸焼き}}を{{1592100:啖う}}人々が{{1606000:夜更し}}で{{1337270:宿題}}をしている。{{1414580:大抵}}, {{1426250:晝}}の間に{{1599620:並}}の{{1584690:面}}の{{1223021:規則}}を{{1202450:開ける}}ことは{{2034480:身につく}}習慣となっている。`,
        english: `While sipping green tea in nature, helping a bullied child is an act beyond the detailed standards. She enjoys a conversation with her mother on a simple seat. Happiness flows incessantly, and in the venue, people devouring takoyaki are doing their homework all night. Usually, opening the standard rule during the day has become a habit that sticks.`,
        addedDate: 1679359139000
      },
      "Timeless Impressions": {
        japanese: `{{1538960:ただ今}}, {{1449100:当社}}の{{1297540:作業}}は{{1168390:印象}}{{1155120:以上}}に{{1375600:成立つ}}。{{1379730:盛る}}勢いで{{1375050:勢い込む}}人々が{{1426920:駐車場}}へと向かい、{{1012840:やばい}}速度で{{1429700:飛ぶ}}。{{1386150:浬}}を越えて、{{1313120:歯科医}}は{{1605980:余程}}の{{1364360:真面目}}さで{{2855431:裏事情}}を{{1214200:管理}}する。{{1185640:下線}}された{{1199160:解答}}は{{1279810:構築}}の{{1290160:根源}}を示す。夜の{{2827999:夜}}には、{{1296400:有る}}秘密を{{1605320:洩らす}}ことなく、{{1223010:規制}}の{{1535300:目印}}を追って{{2772350:時間を潰す}}。`,
        english: `Currently, our company's work leaves an impression beyond expectations. With rising enthusiasm, people head to the parking lot, flying at alarming speeds. Beyond miles, the dentist manages the behind-the-scenes with utmost seriousness. The underlined answers indicate the root of construction. In the depth of night, while preserving certain secrets, one follows the signs of regulations to kill time.`,
        addedDate: 1692123651124
      },
      "Harmonious Chronicles": {
        japanese: `{{2710650:阿房の一つ覚え}}は{{1183720:音楽}}と{{1253060:芸術}}に{{1208450:活躍}}していた。{{1317340:自ら}}の{{1205770:確かに}}な{{1316100:時給}}と、{{1251670:経由}}しての{{1446760:島}}での{{1002360:お待ちどう様}}は{{1426000:仲直り}}の{{1392330:選択肢}}。{{1059300:シーズン}}に{{1244310:苦い}}{{1409060:駄賃}}を獲得し、{{2856953:紙オムツ}}の{{1296470:在庫}}が{{1324520:弱い}}。{{2831980:ほぼほぼ}}、{{2611940:歩行}}中の{{1483360:悲恋}}と{{1558760:恋しい}}{{1584330:麻衣}}が{{1330330:受授}}される{{1166680:一本釣り}}の{{1244680:苦労}}。`,
        english: `The obsession with music and art was always at the forefront. The certain hourly wage and gratitude while traversing the island serves as an option for reconciliation. In the season, the bitter extra earnings are acquired, and the inventory of disposable diapers is low. Almost always, the sorrowful love and coveted attire encountered during walks reflects the effort of a catch.`,
        addedDate: 1692123661124
      },
      "Memory of a Warm Summer": {
        japanese: `{{2856624:くそ暑い}}日、{{1550760:里}}での{{1292390:再会}}は{{1002360:お待ち遠さま}}でした。{{1517860:はち蜜}}のような{{1483190:悲しい}}{{1356270:情景}}が心に浮かぶ。{{1266890:己}}の{{1372350:炊事}}を{{2027090:けっこう大変}}に感じながら、{{1367010:人気}}の{{1661970:売れっ子}}としての日々を{{1199720:恢復}}。{{2834942:緑の窓口}}で{{1343080:はつ恋}}を思い出し、{{1005580:数々}}の{{1320650:質}}の高い{{1440880:添付}}を{{1530600:無断}}で確認する{{1236010:境地}}。`,
        english: `On a scorching hot day, the long-awaited reunion in the village was poignant, reminiscent of a sad scene as sweet as honey. While feeling the hardship of one's own cooking, recovering the days as a popular best-seller. Recalling the first love at the green window, checking numerous high-quality attachments without permission.`,
        addedDate: 1692123840956
      },
      "Whispers of the Past": {
        japanese: `{{1316040:時期}}が経つに{{2136050:に連れ}}, {{1150450:愛する}}{{1443720:電波}}が{{1587030:言い訳}}を{{1444140:吐き出す}}。{{1417770:短刀直入}}に, その{{1306440:刺し傷}}は{{1456650:つき刺す}}ような{{2146660:気味悪い}}{{1220810:機械}}の{{1406710:損害}}。{{2174560:若く}}して{{1294630:才能}}を{{1326620:取り寄せる}}, {{2538520:車両基地}}の{{1502690:物置}}で{{1586820:有り難う}}と{{1263110:減らす}}。{{2754880:其}}の{{1593440:木洩れ日}}の中で, {{2261500:伯母さん}}の{{1312420:試合}}の{{1594660:写真器}}を思い出す。`,
        english: `As time goes on, the beloved radio waves spill out excuses. Straight to the point, that puncture wound feels like the damage from a creepy machine. At a young age, talent is summoned, grateful while diminishing in the depot's storeroom. Within the sunbeams filtering through trees, memories of the camera capturing aunt's match come to mind.`,
        addedDate: 1692123973380
      },
      "Harmonious Realities": {
        japanese: `{{1410120:対象}}を{{1259290:覧る}}と、{{2366840:新機能}}の{{1261190:原因}}が{{1297250:造り}}の{{1382980:積り}}で{{1403390:悪い}}。{{1171360:宇宙人}}の{{1426590:注射}}は{{1345605:そろそろ}}{{2100540:絵に描いたよう}}な{{1298970:簡}}さ。{{1470540:脳味噌を絞る}}と、{{1640990:学び}}の{{1658740:実戦}}が{{1352290:挙がる}}。{{2661480:心地良げ}}に{{2838010:お届け済み}}の{{1351430:紹介}}を{{1251670:経由}}して、{{1332760:了える}}{{1598700:砥ぐ}}道を{{1654390:鍛造}}する。`,
        english: `Upon observing the target, the cause of the new function seems ill-conceived. The alien's injection is almost clichéd in its simplicity. Racking one's brain, the practical application of learning emerges. Comfortably delivered, the introduction is channeled, paving the way for forging refined paths.`,
        addedDate: 1692124054212
      },
      "Transient Moments": {
        japanese: `{{1169340:引越す}}の{{1249300:係る}}時、{{1601900:引張る}}感覚を{{1298750:察知}}。{{1182580:沖繩}}の{{1499720:風}}が{{1859090:暇もなく}}{{1489510:表現}}の{{1220810:機械}}を{{1344410:扶ける}}。{{1066710:スーパー}}での{{1305340:仕付け}}が{{1648640:奏功}}し、{{1347200:商売}}が{{1352770:上まわる}}。{{1613340:ひとり暮し}}の{{1589580:降ろす}}{{2770250:可燃ごみ}}の{{2826427:瞬く間}}に、{{1887780:盛大に趣く}}{{1850120:祭り込む}}の{{1217730:顔}}を{{1589060:行なう}}。`,
        english: `When involved in moving, I sensed a pulling emotion. The winds of Okinawa effortlessly shape the expressive machine. Business dealings at the supermarket proved successful, surpassing expectations. In the blink of an eye, amidst the grand festival, the face of a person living alone performs the act of discarding burnable trash.`,
        addedDate: 1692124136369
      }
  }

  // Your main component
  export const Reading = ({
    userData,
    createScore,
    saveUserData,
    setUserData,
    activeVocabulary,
    activeClass,
    inactiveClass,
    userDataEntries,
    setSearchValue,
    resultsViewMode,
    exactKanjiKana,
    searchArray,
    resultsInteractionMode,
    setTagListSearchValue,
    studyVocabAddUserDataEntry
  }) => {
    const [activeReading, setActiveReading] = useState('A Lengthy Series') // where the reading comes from
    const [readingVocab, setReadingVocab] = useState([])

    setTimeout(() => {document.querySelector('#reading-search-tag-input').value = activeReading}, 10)

    useEffect(() => {
      setReadingVocab(parseIds(readings[activeReading].japanese))
    }, [activeReading])

    useEffect(() => {
      console.log(readingVocab)
    }, [readingVocab])

    const testVocabId = (score, id) => {
      let userDataCopy = { ...userData }
      if(userData.words[id].events !== undefined){
        userDataCopy.words[id].events.push(createScore(score))
      } 
      saveUserData(userDataCopy)
      setUserData(userDataCopy)
    }
  
    const getRandomWords = (numberOfWords = 50) => {
      const vocabCSV = userData && activeVocabulary.map(ud => {
        let kanjis = ud.kanji.length > 0 ? ud.kanji.map(kj => kj.text) : [];
        let kanas = ud.kana.length > 0 ? ud.kana.map(kj => kj.text) : [];
  
        return kanjis.length ?
          kanjis.map(m => `${ud.id}:${m}`) :
          kanas.map(m => `${ud.id}:${m}`)
      })
  
      const reducedVocabCSV = vocabCSV.reduce((acc, val) => {
        return acc.concat(val)
      })
  
      let totalList = []
      for(let vocabIndex = 0; vocabIndex < numberOfWords; vocabIndex++){
          totalList.push(reducedVocabCSV[Math.round((reducedVocabCSV.length - 1) * Math.random())])
      }
      navigator.clipboard.writeText(totalList)
      console.log(totalList)
    }
  
    window.getRandomWords = getRandomWords
    window.activeVocabulary = activeVocabulary  
  
    const Word = ({id, word, score = 10, parentSetter }) => {
      const activeClassTextVocabWord = 'hover:bg-zinc-500 bg-zinc-700 cursor-pointer text-white'
      const inactiveClassTextVocabWord = 'hover:border-zinc-500 border-zinc-200 border-2 cursor-pointer text-black'
  
      return (
      <button
        className={`ml-1 ${score === 10 ? inactiveClassTextVocabWord : activeClassTextVocabWord } px-4 py-2 m-2 rounded-lg inline-block`}
        style={{ transition: 'all 300ms' }}
        onClick={
          () => {
            // console.log(readingVocab)
            parentSetter({id})
            console.log(id, word, score)
          }
        }
      >{word}</button>
      )
    }
  
    const ReadingToolbar = ({parentSetter}) => {
        const [listSelectorOpen, setListSelectorOpen] = useState(false);

        const onTagListInputChange = (e) => {
            e.preventDefault()
            e.stopPropagation()
            setTagListSearchValue(String(e.target.value))
        }
        
        return (
        <div
          className="w-full flex justify-start mb-2 pt-4 border-t-2 border-zinc-100"
        >
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('score reading')
                parentSetter()
              }}
            >Confirm Scores</button>
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                getRandomWords()
              }}
            >Copy 50 Random Vocab to Clipboard</button>
            <div className="relative">
                <img
                    alt="Selet Reading"
                    className="absolute"
                    style={{ transition: 'all 200ms', right: '16px', top: '16px', transform: listSelectorOpen ? '' : 'rotate(180deg' }}
                    src={caret}
                    onClick={() => {
                    setListSelectorOpen(!listSelectorOpen)
                    document.querySelector('.reading-selector-option-0').focus()
                    }}
                />
                <div className={`${listSelectorOpen ? '' : 'pointer-events-none opacity-0'} absolute bg-white border-2 rounded-lg w-full p-2`} style={{ transition: 'all 200ms', top: '48px', zIndex: '10' }}>
                    {Object.keys(readings).map((reading, index) => {
                    return (
                        <div className={`p-2 reading-selector-option-${index} hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer rounded-lg text-sm`} key={index} onClick={() => {
                        setListSelectorOpen(!listSelectorOpen)
                        setActiveReading(reading)
                        setTimeout(() => {
                            document.querySelector('#reading-search-tag-input').value = reading
                        }, 1)
                        }}>
                        {reading}
                        </div>
                    )
                    })}
                </div>
                <input
                    id="reading-search-tag-input"
                    style={{width: '250px'}}
                    className="border-2 rounded-lg w-full p-2 pl-4 text-sm"
                    placeholder={'Reading Search'}
                    autoComplete="off"
                    type="text"
                    onChange={onTagListInputChange}
                />
            </div>
        </div>
      )
    }

    const setReadingVocabScoreById = ({id}) => {
      const readingVocabCopy = [ ...readingVocab ]
      const updatedVocab = readingVocabCopy.map(rvc => {
        if(rvc.id === id) {
          return { ...rvc, score: rvc.score * -1}
        } else {
          return rvc
        }
      })
      setReadingVocab(updatedVocab)
    }


    return (<div>
      <ReadingToolbar parentSetter={() => {
        let readingVocabCopy = [ ...readingVocab ]
        setReadingVocab(readingVocabCopy)
        console.log(readingVocab)
      }} />
      <div className="flex py-12 justify-center">
        <span className="text-4xl">「</span>
        <div className="px-8">
          {parseAndRenderString(readings[activeReading].japanese, setReadingVocabScoreById, Word, readingVocab)}
        </div>
        <span className="text-4xl self-end">」</span>
      </div>
      <div className="flex py-12 px-4 justify-center">
        <span className="text-4xl">"</span>
        <div className="px-8 font-weight-100 italic">
            {readings[activeReading].english}
        </div>
        <span className="text-4xl self-end">"</span>
      </div>

      {userDataEntries.length > 0 && readingVocab.map((activeReadingVocabWord) => {
        return DisplayVocab({
          vocab: userDataEntries.find(ude => ude.id === activeReadingVocabWord.id),
          parentSetter: setSearchValue,
          userDataId: userData.words[activeReadingVocabWord.id],
          userData: userData,
          setUserData: setUserData,
          type: resultsViewMode,
          exactKanjiKana: exactKanjiKana,
          searchValue: searchArray,
          resultsInteractionMode: resultsInteractionMode,
          setTagListSearchValue: setTagListSearchValue,
          studyVocabAddUserDataEntry: studyVocabAddUserDataEntry
        })        
      })}
    </div>);
  }
