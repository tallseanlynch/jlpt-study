import React, { useState, useEffect } from 'react';
import { DisplayVocab } from './DisplayVocab'
import caret from '../images/caret.png'

function parseAndRenderString(sentence, parentSetter, WordComponent, readingVocab) {
    const regex = /{{(\d+):([\u3040-\u30FF\u4E00-\u9FFF]+)}}/g;
    
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
    Second: {
        japanese: `{{1590560:可成り}}と長い{{1062910:シリーズ}}の中で、私は{{1296400:在る}}書店で{{1595270:辭典}}や{{1260670:本}}を{{1207270:楽しむ}}。{{1464070:日頃}}の生活では、{{1235290:共用}}スペースや{{1239560:局}}での仕事に{{2817380:計}}を立て、{{1343410:所有者}}としての責任を{{1589060:行う}}。{{1343460:暑い}}夏の日には、{{1318480:自動販売器}}で冷たい飲み物を買い、{{1414150:大丈夫}}な場所で休憩する。{{1483150:彼女}}はよく{{1464760:日本じゅう}}を{{1598550:出掛ける}}、{{1443970:兔}}のように活発で、{{2835077:便女}}の仕事でも真面目に取り組む。{{1327120:護る}}ことの大切さを学び、{{1330270:授かる}}祝福を受け入れ、{{1306630:掌る}}技術や{{1365260:親善}}の心で日々を送る。{{2162470:独}}立した考えや{{1593430:篭もる}}性格は時々孤独を感じさせるが、友人や家族との{{1013030:縁}}がそれを癒す。{{1468620:年甲斐もない}}冗談や{{1338120:出し抜け}}のサプライズを楽しむこともあり、毎日が{{1510890:変化}}に富んでいる。`,
        english: `In a rather lengthy series, I enjoy books and dictionaries at a certain bookstore. In daily life, I set plans for shared spaces and tasks at the office, fulfilling my responsibilities as an owner. On hot summer days, I buy a cold drink from a vending machine and take a break in a comfortable place. She often travels all over Japan, as lively as a rabbit, and works diligently, even in a restroom cleaner's job. I've learned the importance of protection, accept the blessings bestowed upon me, and live every day with mastered skills and goodwill. Independent thoughts and introverted nature sometimes make me feel lonely, but bonds with friends and family heal that. I also enjoy age-inappropriate jokes and unexpected surprises, making every day rich in variation.`
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
    const [activeReading, setActiveReading] = useState('Second') // where the reading comes from
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
                    style={{maxWidth: '300px'}}
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
