import React, { useState, useEffect, useCallback } from 'react';
import { DisplayVocab } from './DisplayVocab'
import caret from '../images/caret.png'
// import { readings } from '../readings/readings'
// import { readings } from '../../data/json/readings.json'
import { tokenize, searchExactTokens, getReadings, saveReadings, saveLists } from '../js/utils'

const SentenceContainer = ({elements}) => {
    return (<div>{elements}</div>)
}

window.getReadings = getReadings
window.saveReadings = saveReadings

function parseAndRenderString(readingTokens, parentSetter, WordComponent, readingVocab, selectedVocab) {
    let elements = [[]]
    let rowIndex = 0
    readingTokens.forEach(rt => {
        // const currentScore = readingVocab && readingVocab.find(rv => rv.id === rt.id) && readingVocab.length > 0 ? readingVocab.find(rv => rv.id === rt.id).score : 10
        if(rt.surface_form === '\n') {
            elements.push([])
            rowIndex++  
        } else {
            const vocabSelected = selectedVocab.length > 0 
            const foundSelectedVocab = selectedVocab.find(sv => {
                return rt.word_id === sv.wordId && rt.word_position === sv.pos
            })
            const currentScore = vocabSelected && foundSelectedVocab ? -10 : 10

            const isWithinReadingVocab = readingVocab.find(rv => {
                return rt.word_id === rv.wordId && rt.word_position === rv.tokenPosition
            })

            if(rt.pos !== '助詞' && rt.basic_form !== '*' && rt.pos !== "助動詞" && rt.word_type !== 'UNKNOW' && isWithinReadingVocab) {
                elements[rowIndex].push(<WordComponent wordId={rt.word_id} key={`rt.basic_form-${Math.random()}`} id={`rt.basic_form-${Math.random()}`} word={rt.surface_form} parentSetter={parentSetter} score={currentScore} pos={rt.word_position}/>);
            } else {
                elements[rowIndex].push(<span className="py-4 pr-1 inline-block" key={`${rt.surface_form}-${rt.word_position}`}>{rt.surface_form}</span>)
            }    
        }
    })
    return elements.map((els, elsI) => <SentenceContainer elements={els} key={`sentence-${elsI}`} />);
  }

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
    studyVocabAddUserDataEntry,
    lists,
    listsSetter
  }) => {
    const [readings, setReadings] = useState(null)
    const [activeReading, setActiveReading] = useState('街風') // where the reading comes from
    const [readingVocab, setReadingVocab] = useState([])
    const [tokens, setTokens] = useState([])
    const [selectedVocab, setSelectedVocab] = useState([]) // [{wordId: 123456, pos: 123, score: 10}]
    const [showAll, setShowAll] = useState(false)

    // "街風": {
    //   "japanese": "こちら大阪 生野区朝鮮人部落\nﾌﾟﾙﾙﾙ 電話がひっきりなしになりまくる\nそろそろ仕事だ\nﾌﾟﾙﾙ プルッてる場合じゃないよまったく\nくれるだけくれよ ありのままの\n嫌味ありがたく いただけるかも今の気分\nなんだか気は張ってる 四六時中\nいつ何時でも己の敵は自分\nクソッタレ 気にせん全然\nI ain't the type of brother for you to start testin'\nていうかこんなとこいないよ先生\n今夜もヤサに篭もっても 燃やす先生\nデンジャー 危険だ黄色い信号\nより良い結果 のためこらえて辛抱\n俺のハイライフ関係ない金土\nほんまにぶら下がってんのチンポ？\n尻尾 見せたら潰される きっと\nそんなしっとりしたパンチライン じゃ\n俺の心 響かせん ちっとも\nもう面倒 妬みと嫉妬\n疲れ 困る 結構いいところ\nクリティカルヒット お前にピンポイント\nお前よりいってる 結構いいところ\nお前 今も探す 拠り所\n離れなかった薬の売買\nヤク中生活とも これでバイバイ\n我忘れ街を徘徊\nでもぶら下がってぶんどった\nこのライフスタイル\n石ころ蹴り飛ばし歩いた\nこの道端にツバ吐き 肩で風を切る\n身内は身内でよそはよそ\n福は内で鬼は外 でも世間は鬼\n限られた仲間たちと生きる\nでもくたばる時ぐらい一人で死ぬ\n調子に乗るなよクソガキ\nYou better listen if you don't wanna mess it with my squad\n肌をさす風が吹き抜ける街道\n自分は自分でやれるようにと\nコーナーの売人 商売繁盛\nランナーは毎日 朝昼晩も\n欲を満たした自分のために\nブレーキを効かせて 欲と駆け引き\n幸せのために 不幸せを糧に\n手のひら返しが 道中のバネに\n朝まで意識を高めた結果\nまるでヒップホップの関係ができた\nあのとき正義を貫いた結果\nまるでヒップホップみたいな環境ができた\n外には一つもスキを見せるなよ\n身内は身内で よそはよそ\nここまでやってきたことは楽勝\n気の緩みは許されずに レディゴー\n石ころ蹴り飛ばし歩いた\nこの道端にツバ吐き 肩で風を切る\n身内は身内でよそはよそ\n福は内で鬼は外 でも世間は鬼\n限られた仲間たちと生きる\nでもくたばる時ぐらい一人で死ぬ\n調子に乗るなよクソガキ\nYou better listen if you don't wanna mess it with my squad",
    //   "addedDate": 1692212852717
    // }

    const setSelectedVocabByWordIdPos = ({wordId, pos}) => {
        let selectedVocabCopy = [ ...selectedVocab ]
        const matchingSelectedVocab = selectedVocabCopy.filter(vocab => vocab.wordId === wordId && vocab.pos === pos)
        if(matchingSelectedVocab.length === 0) {
          selectedVocabCopy.push({wordId, pos, selectedTime: new Date().getTime()})
        }
        if(matchingSelectedVocab.length > 0) {
          selectedVocabCopy = selectedVocabCopy.filter(vocab => vocab.wordId !== wordId && vocab.pos !== pos)
        }
        setSelectedVocab(selectedVocabCopy)
      }  

    let getToken = useCallback(() => {
        const asyncToken = async () => {
            let tokens = await tokenize(readings[activeReading].japanese)
            console.log({tokens})
            return tokens        
        }
        return asyncToken()
        
    }, [activeReading, readings])

    // useEffect(() => {
    //     getReadings().then(r => {setReadings(r)})
    // }, [])

    useEffect(() => {
      fetch('http://localhost:8080/readings.json', { cache: "no-store" })
        .then((res) => res.json())
        .then((jsonResponseData) => setReadings(jsonResponseData))
    }, [])  

    useEffect(() => {
        readings !== null && getToken().then((t) => {setTokens(t)})
    }, [getToken, readings])

    useEffect(() => {
        const foundTokens = tokens.map(t => {
            return {
                word_position: t.word_position,
                basic_form: t.basic_form,
                surface_form: t.surface_form,
                pos: t.pos,
                word_id: t.word_id
            }
        })

        const filteredFoundTokens = foundTokens.filter(ffbf => ffbf.pos !== '助詞' && ffbf.pos !== '助動詞' && ffbf.basic_form !== '*')

        const foundBasicFormsToken = filteredFoundTokens.map( t => {
            return {
                searchQuery: t.basic_form,
                tokenPosition: t.word_position,
                wordId: t.word_id
            }
        })

        searchExactTokens(foundBasicFormsToken).then(searchResults => {
            if(searchResults !== null) {
                const readingVocabFormat = searchResults.map(sr => { return { ...sr.vocab, tokenPosition: sr.tokenPosition, wordId: sr.wordId }})
                const sortedVocab = readingVocabFormat.sort((a, b) => {
                    return a.tokenPosition - b.tokenPosition
                })
                setReadingVocab(sortedVocab)
            }
        })
    }, [tokens])


    // const testVocabId = (score, id) => {
    //   let userDataCopy = { ...userData }
    //   if(userData.words[id].events !== undefined){
    //     userDataCopy.words[id].events.push(createScore(score))
    //   } 
    //   saveUserData(userDataCopy)
    //   setUserData(userDataCopy)
    // }
  
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
  
    const Word = ({id, word, score = 10, parentSetter, pos, wordId }) => {
      const activeClassTextVocabWord = 'hover:bg-zinc-500 bg-zinc-700 cursor-pointer text-white'
      const inactiveClassTextVocabWord = 'hover:border-zinc-500 border-zinc-200 border-2 cursor-pointer text-black'
  
      return (
      <button
        className={`ml-1 ${score === 10 ? inactiveClassTextVocabWord : activeClassTextVocabWord } px-4 py-2 m-2 rounded-lg inline-block`}
        style={{ transition: 'all 300ms' }}
        onClick={
          () => {
            // console.log(readingVocab)
            parentSetter({wordId, pos})
            console.log(wordId, word, score)
          }
        }
      >{word}</button>
      )
    }
  
    const ReadingToolbar = ({readings, setReadings}) => {
        const [listSelectorOpen, setListSelectorOpen] = useState(false);
        const [newReadingName, setNewReadingName] = useState('')
        const [newReadingJapanese, setNewReadingJapanese] = useState('')

        const saveNewList = useCallback(() => {
          console.log({readingVocab, activeReading, selectedVocab, readings})
          let ids = []
          if(readingVocab.length > 0) {
            let saveReadingVocab = readingVocab.map(rv => {
              return {
                id: rv.id,
                tokenPosition: rv.tokenPosition,
                wordId: rv.wordId
              }
            })
            const noDupesSaveReadingVocab = saveReadingVocab.filter(srv => {
              if(ids.indexOf(srv.id) === -1) {
                ids.push(srv.id)
                return true
              } else { return false }
            })
    
            const noDupesSaveReadingVocabStudying = noDupesSaveReadingVocab.filter(f => {
              return userData.words[f.id] !== undefined
            })
    
            
            const newLists = { ...lists, [activeReading]: {vocab: noDupesSaveReadingVocabStudying, addedDate: new Date().getTime() }}
            
            // console.log({
            //   newLists,
            //   readingVocab,
            //   saveReadingVocab,
            //   noDupesSaveReadingVocab,
            //   noDupesSaveReadingVocabStudying,
            //   userData
            // })

            listsSetter(newLists)
            saveLists(newLists)

        }
        }, [readings])
    

        const updateReadings = useCallback(() => {
          // console.log({readingVocab, activeReading, selectedVocab, readings})
          // let ids = []
          // if(readingVocab.length > 0) {
          //   let saveReadingVocab = readingVocab.map(rv => {
          //     return {
          //       id: rv.id,
          //       tokenPosition: rv.tokenPosition,
          //       wordId: rv.wordId
          //     }
          //   })
          //   const noDupesSaveReadingVocab = saveReadingVocab.filter(srv => {
          //     if(ids.indexOf(srv.id) === -1) {
          //       ids.push(srv.id)
          //       return true
          //     } else { return false }
          //   })
    
          //   const noDupesSaveReadingVocabStudying = noDupesSaveReadingVocab.filter(f => {
          //     return userData.words[f.id] !== undefined
          //   })

          //   const newLists = { ...lists, [activeReading]: {vocab: noDupesSaveReadingVocabStudying, addedDate: new Date().getTime() }}
            
          //   console.log({
          //     newLists,
          //     readingVocab,
          //     saveReadingVocab,
          //     noDupesSaveReadingVocab,
          //     noDupesSaveReadingVocabStudying,
          //     userData
          //   })

          //   listsSetter(newLists)
          //   saveLists(newLists)

          // }
    

          let readingsCopy = { ...readings }
          readingsCopy[newReadingName] = {
            japanese: newReadingJapanese,
            addedDate: new Date().getTime()
          }
          console.log(readingsCopy)
          setReadings(readingsCopy)
          saveReadings(readingsCopy)
        }, [readings, newReadingName, newReadingJapanese, setReadings])      

        const onTagListInputChange = (e) => {
            e.preventDefault()
            e.stopPropagation()
            setTagListSearchValue(String(e.target.value))
        }
        
        return (
        <div
          className="w-full flex justify-start mb-2 pt-4 border-t-2 border-zinc-100"
        >

            <div className="relative mr-2">
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
                        setReadingVocab([])
                        setActiveReading(reading)
                        // setTimeout(() => {
                        //     document.querySelector('#reading-search-tag-input').value = reading
                        // }, 1)
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
                    value={activeReading}
                />
            </div>

            <input
                id="reading-name-input"
                className="border-2 rounded-lg p-2 pl-4 text-sm mr-2"
                placeholder={'Type name here...'}
                type="text"
                // value={newReadingName}
                onChange={(e) => {
                  // console.log('Reading name')
                  setNewReadingName(e.target.value)
                }}
                autoComplete="off"
            />
            <textarea
                id="reading-input"
                style={{maxHeight: '40px'}}
                className="border-2 rounded-lg p-2 pl-4 text-sm mr-2"
                placeholder={'Paste Reading here...'}
                type="text"
                // value={newReadingJapanese}
                onChange={(e) => {
                  // console.log('Japanese reading')
                  setNewReadingJapanese(e.target.value)
                }}
                autoComplete="off"
            />
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('save reading')
                updateReadings()
              }}
            >Save Reading</button>
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('save list')
                saveNewList()
              }}
            >Save List</button>
            {/* <button
              style={{ transition: 'all 300ms'}}
              className={`${editingReading ? activeClass : inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('edit reading')
                setEditingReading(!editingReading)
              }}
            >Edit</button> */}
            <button
              style={{ transition: 'all 300ms'}}
              className={`${showAll ? activeClass : inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('show all')
                setShowAll(!showAll)
              }}
            >Show All</button>
            {/* <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('score reading')
                // parentSetter()
              }}
            >Confirm Scores</button> */}
        </div>
      )
    }



    // const setReadingVocabScoreById = ({id}) => {
    //   const readingVocabCopy = [ ...readingVocab ]
    //   const updatedVocab = readingVocabCopy.map(rvc => {
    //     if(rvc.id === id) {
    //       return { ...rvc, score: rvc.score * -1}
    //     } else {
    //       return rvc
    //     }
    //   })
    //   setReadingVocab(updatedVocab)
    // }


    return (readings !== null ? <div>
      <ReadingToolbar readings={readings} setReadings={setReadings} />
        <div className="flex">
            <div className="flex py-12 justify-center w-1/2">
                <span className="text-4xl">「</span>
                <div className="font-thin" style={{}}>
                    {tokens && parseAndRenderString(tokens, setSelectedVocabByWordIdPos, Word, readingVocab, selectedVocab)}
                </div>
                <span className="text-4xl self-end">」</span>
            </div>

            <div className="py-12 w-1/2">
                {userDataEntries.length > 0 && tokens.length > 0 && readingVocab.length > 0 && readingVocab
                .filter((f) => {
                    if(showAll === true) {
                      return f
                    }

                    let matchingSelectedVocab = false
                    selectedVocab.forEach(sv => {
                        if(sv.wordId === f.wordId && sv.pos === f.tokenPosition) {
                            matchingSelectedVocab = true
                        }
                    })
                    return matchingSelectedVocab
                })
                .map(m => {
                  if(showAll === true) {
                    return m
                  }

                    let matchingSelectedVocab
                    selectedVocab.forEach(sv => {
                        if(sv.wordId === m.wordId && sv.pos === m.tokenPosition) {
                            matchingSelectedVocab = sv
                        }
                    })

                    return { ...m, selectedTime: matchingSelectedVocab.selectedTime ? matchingSelectedVocab.selectedTime : 0}
                })
                .sort((a, b) => {
                  if(showAll === true) {
                    return 0
                  }

                    return b.selectedTime - a.selectedTime
                })
                .map((activeReadingVocabWord) => {
                    return DisplayVocab({
                    vocab: activeReadingVocabWord,
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

            </div>
        </div>
    </div> : '');
  }
