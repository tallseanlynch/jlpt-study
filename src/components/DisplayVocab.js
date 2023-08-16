import { DisplayKanji } from './DisplayKanji'
import { 
  tags, 
  allNonKanji, 
  generateUUID, 
  saveUserData, 
  removeCharacters,
  removeDuplicateChars,
  createAddedDate,
} from '../js/utils'
import { jlptVocab } from '../js/jlptVocab'

const KanjiSection = ({resultsInteractionMode='', recentScore, kanji, searchSetter, vocab}) => {
  return (
    <div className={`mx-2 w-full ${resultsInteractionMode === 'flashcard' && recentScore === false ? 'fade-in-5-10' : ''}`}>
      {removeDuplicateChars(removeCharacters(kanji.map(k => {return k.text}).join(''), allNonKanji)).split('').map(k => {
        return (DisplayKanji({kanji: k, parentSetter: searchSetter, vocabId: vocab.id}))
      })}
    </div> 
  )
}

const Definitions = ({resultsInteractionMode='', recentScore, sense, vocab}) => {
  return (<div>
    {sense.map((s, si) => {return (
      <div className={`pb-4 ${resultsInteractionMode === 'flashcard' && recentScore === false ? 'fade-in-5-10' : ''}`} key={`${vocab.id}-sense-${si}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} >
        <div className=""><span className="italic text-zinc-400">{si + 1}.</span> {s.gloss.map((sg, sgi) => (<span className="inline-block" key={`${vocab.id}-sense-gloss-${sgi}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} >{sg.text}{sgi === s.gloss.length - 1 ? ';' : (<span className="pr-2 inline-block">,</span>)}</span>))}</div>
        {
          Array.isArray(s.partOfSpeech) ? s.partOfSpeech.map((pos, posi) => {
            return (
              <div key={`${vocab.id}-sense-pos-${posi}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} className="text-sm text-zinc-400">{tags[pos]}</div>
            )
          }) : (
            <div key={`${vocab.id}-sense-pos-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} className="text-sm text-zinc-400">{tags[s.partOfSpeechArray]}</div>
          )
        }
        <div className="text-sm italic text-zinc-800">{s.info.map(si => (si))}</div>
      </div>
    )})}
  </div>)
}

const KanjiKana = ({exactWord = [], resultsInteractionMode='', kanji, vocab, kanjiClass, searchSetter, kana, furiganaClass, recentScore, type, kanjiKanaMap, noKanji }) => {
  return (
    <div>
      {kanji.map((k, ki) => {
        if(exactWord.length === 0 || exactWord.indexOf(k.text) > -1) {
          return (
            <div                   
              key={`${vocab.id}-kanjiKana-${ki}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`}
              className="pb-4"
            >
              <div className={`${kanjiClass} pb-2`} onClick={() => searchSetter(k.text)}>
                <span  className="cursor-pointer border-b border-white hover:border-zinc-500">
                  {k.text}
                </span>
              </div>            
              <div>
                {
                  kana.filter((kf) => {
                    return kf.appliesToKanji.indexOf('*') > -1  || kf.appliesToKanji.indexOf(k.text) > -1})
                    .map((ka, ki) => {
                      return (
                        <div
                          key={`${vocab.id}-kana-${ki}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`}
                          className={`${furiganaClass} cursor-pointer`}
                          onClick={() => {searchSetter(ka.text.replace(/[-.]/g, ''))}}
                        >
                          <span
                            className={`${resultsInteractionMode === 'flashcard' && recentScore === false ? 'fade-in-0-5' : ''} cursor-pointer border-b border-white hover:border-zinc-500`}
                          >
                            {ka.text}
                          </span>
                        </div>
                      )
                    }
                  )
                }
                {type !== 'notecard' && k.common === true && (<div className="bg-zinc-400 text-white py-2 px-3 mb-2 mt-2 rounded-lg inline-block text-sm mr-2">Common</div>)}
                {type !== 'notecard' && kanjiKanaMap[k.text] && (<div className="bg-zinc-200 text-black py-2 px-3 mb-2 mt-4 rounded-lg inline-block text-sm mr-2">JLPT {kanjiKanaMap[k.text]}</div>)}
              </div>
          </div>)            
        } else {
          return ''
        }
      })}
      {noKanji && kana.map((ka, ki) => {return (<div key={`${vocab.id}-kana-${ki}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} className={`${kanjiClass} cursor-pointer border-b border-white hover:border-zinc-500`}  onClick={() => {searchSetter(ka.text)}}>{ka.text}</div>)})}
    </div>
  )
}

const ActivitySection  = ({ setTagListSearchValue, userIsActive, studyVocab, userDataId, vocab }) => {
  return (
    <div className="pt-2 pr-3">
      <div
        className={`rounded-full hover:bg-zinc-400 cursor-pointer ${userIsActive ? 'bg-zinc-300 border-4 border-white' : 'border-4 border-white'}`}
        style={{width: '24px', height: '24px', outline: '1px solid rgb(161 161 170)', transition: 'all 300ms'}}
        onClick={studyVocab}
      ></div>
      <div className="flex flex-col mt-2">
        {
          userDataId && userDataId.events && userDataId.events.filter(f => f.type === 'addedDate').map(t => {
            const tagDate = `${new Date(t.t).getMonth() + 1}/${new Date(t.t).getDate()}`
            return (
              <span
                key={`${vocab.id}-tagDate-${t.t}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`}
                className="text-sm bg-zinc-200 text-black rounded-lg px-2 py-1 mr-2 cursor-pointer"
                onClick={ () => {
                  setTagListSearchValue(tagDate)
                  document.querySelector('#list-search-tag-input').value = tagDate
                }
                }
              >
                {tagDate}
              </span>
            )
          })
        }
        {
          userDataId && userDataId.events && userDataId.events.filter(f => f.type === 'score').map(t => {
            return (
              <div
                key={`${vocab.id}-tagScore-${t.s}--${generateUUID()}-${vocab.tokenPosition ? vocab.tokenPosition : ''}`}
                className={`${t.s > 0 ? 'bg-lime-300' : 'bg-rose-300'} ${t.s === 0 ? 'bg-zinc-300' : ''} ${t.s === 'complete' ? 'bg-blue-500' : ''} text-sm rounded px-2 py-1 mr-2 mt-1 border-black`}
                style={{opacity: (t.s === 0 || t.s === 'complete') ? 1 : Math.abs(t.s/10), height: '5px'}}
              >
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export const DisplayVocab = ({
  vocab,
  parentSetter,
  userDataId,
  userData,
  setUserData, 
  type = 'notecard',
  exactKanjiKana,
  searchValue,
  resultsInteractionMode='',
  setTagListSearchValue,
  studyVocabAddUserDataEntry
}) => {
    const {kanji = [], kana = [], sense = []} = vocab;
    const searchSetter = (v) => {
      document.querySelector('#search-input').value = v
      parentSetter(v)
    }

  const noKanji = kanji.length === 0
  const kanjiClass = "text-4xl"
  const furiganaClass = "text-zinc-400"

  const allKanjiAndKanaArray = [ ...kanji.map(k => k.text), ...kana.map(ka => ka.text)]
  const kanjiKanaMap = {}

  allKanjiAndKanaArray.forEach((kk) => {
    let searchResults = jlptVocab.filter((jv) => { return jv.j === kk && jv.l !== undefined})
    if(searchResults.length > 0){
      kanjiKanaMap[kk] = searchResults[0].l
    }
  })

  const userIsActive = userDataId && (userData.words[vocab.id].active === true || userData.words[vocab.id].active === undefined)

  const studyVocab = () => {
    let userDataCopy = { ...userData }
    if(userDataId){
      if(userDataCopy.words[vocab.id].active === undefined) {
        userDataCopy.words[vocab.id].active = false;
      } else {
        userDataCopy.words[vocab.id].active = !userDataCopy.words[vocab.id].active;
      }
    } else {
      userDataCopy.words[vocab.id] = {
        events: [createAddedDate()]
      }
    }
    setUserData(userDataCopy)
    saveUserData(userDataCopy)
    studyVocabAddUserDataEntry(vocab)
    // setUserDataEntries([...userDataEntries, vocab])
  }

  const recentScore = userDataId && userDataId.events && userDataId.events
  .filter(f => f.type === 'score')
  .filter(t => {
    return new Date().getTime() - t.t < window.playerInterval * 1000
  }).length > 0

  if(type === 'notecard') {
    return (      
      <div key={`${vocab.id}-note-card-${vocab.tokenPosition ? vocab.tokenPosition : ''}`} className="flex overflow-scroll vocab-word bg-white border rounded-lg p-4 mr-1 mb-1" style={{width: '250px', height: '350px'}}>
        <ActivitySection setTagListSearchValue={setTagListSearchValue} recentScore={recentScore} userIsActive={userIsActive} studyVocab={studyVocab} userDataId={userDataId} vocab={vocab} />
        <div className="self-start flex flex-col justify-start">
          <KanjiKana exactWord={exactKanjiKana ? searchValue : []} resultsInteractionMode={resultsInteractionMode} recentScore={recentScore} kanji={kanji } vocab={vocab} kanjiClass={kanjiClass} searchSetter={searchSetter} kana={kana} furiganaClass={furiganaClass} type={type} kanjiKanaMap={kanjiKanaMap} noKanji={noKanji} />
          <div className="overflow-scroll">
            <Definitions resultsInteractionMode={resultsInteractionMode} recentScore={recentScore} sense={sense} vocab={vocab} />
          </div>
        </div>
      </div>
    )
  }

  if(type === '') {
    return (      
      <div className="vocab-word bg-white w-full flex border rounded-lg p-4 mb-2 justify-between" key={`${vocab.id}-entry-${vocab.tokenPosition ? vocab.tokenPosition : ''}`}>
        <div className="w-1/4 flex">
          <ActivitySection setTagListSearchValue={setTagListSearchValue} recentScore={recentScore} userIsActive={userIsActive} studyVocab={studyVocab} userDataId={userDataId} vocab={vocab} />
          <KanjiKana exactWord={exactKanjiKana ? searchValue : []} resultsInteractionMode={resultsInteractionMode} recentScore={recentScore}  kanji={kanji } vocab={vocab} kanjiClass={kanjiClass} searchSetter={searchSetter} kana={kana} furiganaClass={furiganaClass} type={type} kanjiKanaMap={kanjiKanaMap} noKanji={noKanji} />
        </div>
        <div className="w-1/4">
          <Definitions resultsInteractionMode={resultsInteractionMode} recentScore={recentScore} sense={sense} vocab={vocab} />
        </div>
        <div className="w-1/2 flex self-start items-center">
          <KanjiSection resultsInteractionMode={resultsInteractionMode} recentScore={recentScore} kanji={kanji} searchSetter={searchSetter} vocab={vocab}/>
        </div>
      </div>
    )
  }

};