import React, { useState, useEffect, useCallback } from 'react';
import { DisplayVocab } from './DisplayVocab'
import caret from '../images/caret.png'
// import { readings } from '../readings/readings'
// import { readings } from '../../data/json/readings.json'
import { tokenize, searchExactTokens, getReadings, saveReadings } from '../js/utils'

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
    studyVocabAddUserDataEntry
  }) => {
    const [readings, setReadings] = useState(null)
    const [activeReading, setActiveReading] = useState('街風') // where the reading comes from
    const [readingVocab, setReadingVocab] = useState([])
    const [tokens, setTokens] = useState([])
    const [selectedVocab, setSelectedVocab] = useState([]) // [{wordId: 123456, pos: 123, score: 10}]

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

    useEffect(() => {
        getReadings().then(r => {setReadings(r)})
    }, [])

    // const updateReadingSearchInputTag = useCallback(() => {
    //     document.querySelector('#reading-search-tag-input').value = activeReading
    // }, [activeReading])

    // useEffect(() => {
    //     console.log({readings})
    //     setTimeout(updateReadingSearchInputTag, document.querySelector('#reading-search-tag-input') === null ? 10 : 0) 
    // }, [readings, updateReadingSearchInputTag])

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

    useEffect(() => {
      console.log({readingVocab, activeReading, selectedVocab, readings})
    }, [readingVocab, activeReading, selectedVocab, readings])

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
                    value={activeReading}
                />
            </div>

            <input
                id="reading-name-input"
                className="border-2 rounded-lg p-2 pl-4 text-sm mr-2"
                placeholder={'Type name here...'}
                type="text"
                onChange={() => {console.log('Paste reading')}}
                autoComplete="off"
            />
            <input
                id="reading-input"
                className="border-2 rounded-lg p-2 pl-4 text-sm mr-2"
                placeholder={'Paste Reading here...'}
                type="text"
                onChange={() => {console.log('Paste reading')}}
                autoComplete="off"
            />
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('save reading')
              }}
            >Save Reading</button>
            <button
              style={{ transition: 'all 300ms'}}
              className={`${inactiveClass} px-4 py-2 mr-2 text-sm rounded-lg inline-block`}
              onClick={() => {
                console.log('score reading')
                parentSetter()
              }}
            >Confirm Scores</button>

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
      <ReadingToolbar parentSetter={() => {
        let readingVocabCopy = [ ...readingVocab ]
        setReadingVocab(readingVocabCopy)
      }} />
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
                    let matchingSelectedVocab = false
                    selectedVocab.forEach(sv => {
                        if(sv.wordId === f.wordId && sv.pos === f.tokenPosition) {
                            matchingSelectedVocab = true
                        }
                    })
                    return matchingSelectedVocab
                })
                .map(m => {
                    let matchingSelectedVocab
                    selectedVocab.forEach(sv => {
                        if(sv.wordId === m.wordId && sv.pos === m.tokenPosition) {
                            matchingSelectedVocab = sv
                        }
                    })

                    return { ...m, selectedTime: matchingSelectedVocab.selectedTime}
                })
                .sort((a, b) => {
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
