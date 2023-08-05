import React, { useState, useEffect } from 'react';
import { 
  openWindowWithString, 
  commaSeparateList, 
  saveUserData, 
  getJSON,
  windowCountDown,
  createScore,
  createAddedDate,
} from './js/utils'
import caret from './images/caret.png'
import copy from './images/copy.png'
import { DisplayVocab } from './components/DisplayVocab'

// todo: 
// 1. search for JLPT level of words and kanjis
// need to make sure I have all 5, 4, 3 words
// 2. only show first 25 words upon search to save memory

function App() {
  const [ results, setResults ] = useState([])
  const [userData, setUserData] = useState(null)
  const [userDataEntries, setUserDataEntries] = useState(null)
  const [exactSearch, setExactSearch] = useState(true)
  const [exactKanjiKana, setExactKanjiKana] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [listExactSearch, setListExactSearch] = useState(false)
  const [listSearchValue, setListSearchValue] = useState('')
  const [tagListExactSearch, setTagListExactSearch] = useState(false)
  const [tagListSearchValue, setTagListSearchValue] = useState('')
  const [activeVocabulary, setActiveVocabulary] = useState([])
  const [resultsViewMode, setResultsViewMode] = useState('')
  const [userLists, setUserLists] = useState([]);
  const [listSelectorOpen, setListSelectorOpen] = useState(false);
  const [vocabularyList, setVocabularyList] = useState(true);
  const [resultsInteractionMode, setResultsInteractionMode] = useState('');
  const [listPlayerIndex, setListPlayerIndex] = useState(0);
  // const [countdown, setCountdown] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchArray, setSearchArray] = useState([]);
  const [userInputTag, setUserInputTag] = useState('');
  const [exactOrder, setExactOrder] = useState(false);
  const [minScore, setMinScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [staticList, setStaticList] = useState([])
  const [playerInterval, setPlayerInterval] = useState(10)
  const [textMode, setTextMode] = useState(false)

  const studyVocabAddUserDataEntry = (entry) => {
    setUserDataEntries([...userDataEntries, entry])
  }
  
  const studyVocabList = (vocabList) => {
    let userDataCopy = { ...userData }
    let filteredDataEntries = []
    vocabList.forEach((vocab) => {
      if(userDataCopy.words[vocab.id] === undefined){
        filteredDataEntries.push(vocab)
        userDataCopy.words[vocab.id] = {
          events: [createAddedDate()],
          tags: []
        }
      } 
    })
    saveUserData(userDataCopy)
    setUserData(userDataCopy)
    setUserDataEntries([...userDataEntries, ...filteredDataEntries])
  }

  const testVocabId = (score, id) => {
    let userDataCopy = { ...userData }
    if(userData.words[id].events !== undefined){
      userDataCopy.words[id].events.push(createScore(score))
    } 
    saveUserData(userDataCopy)
    setUserData(userDataCopy)
  }

  const getAllAddedDates = () => {
    const uniqueDates = []
    Object.keys(userData.words).forEach((ud, udi) => {
      let addedDate = new Date(userData.words[ud].events.filter(e => {
        return e.type === 'addedDate'
      })[0].t)
      let addedDateFormatted = `${addedDate.getMonth() + 1}/${addedDate.getDate()}`
      if(uniqueDates.indexOf(addedDateFormatted) === -1) {
        uniqueDates.push(addedDateFormatted)
      }
    })
    const sortedDates = uniqueDates.sort((a, b) => {
      // We use the current year as the year component for comparison purposes.
      // This works fine as long as there are no cross-year comparisons needed (i.e. Dec vs Jan)
      let dateA = new Date(`${a}/2023`);
      let dateB = new Date(`${b}/2023`);
  
      // If dateA is bigger than dateB, we sort it to an earlier index
      if (dateA > dateB) return -1;
      // If dateA is smaller than dateB, we sort it to a later index
      if (dateA < dateB) return 1;
      // If dates are equal, we leave their order unchanged
      return 0;
    });
    return sortedDates
  }

  const TextVocabWord = (word, id, score = -10) => {
    return (<span onClick={testVocabId(score, id)}>{word}</span>)
  }

  const testVocab = (score) => {
    let userDataCopy = { ...userData }
    const activeList = isPlaying ? staticList : activeVocabulary
    let flashCardWord = activeList.filter((f, fi) => {
      return isPlaying ? (fi === listPlayerIndex) : f 
    })[0]
    let currentFlashCardId = flashCardWord.id
    if(userData.words[currentFlashCardId].events !== undefined){
      userDataCopy.words[currentFlashCardId].events.push(createScore(score))
    } 
    saveUserData(userDataCopy)
    setUserData(userDataCopy)
  }

  const tagVocabList = (vocabList, tag) => {
    if(tag === '') {
      return
    }
    let userDataCopy = {words: {}}
    vocabList.forEach((vocab) => {
      if(userDataCopy.words[vocab.id] === undefined){
        userDataCopy.words[vocab.id] = {
          events: [createAddedDate()],
          tags: []
        }
      }
      if(userDataCopy[vocab.id] && userDataCopy[vocab.id].tags) {
        userDataCopy.words[vocab.id].tags.push(tag)
      } else {
        userDataCopy.words[vocab.id].tags = [tag]
      }
    })
  }


  const searchExact = (searchQueryArray) => {
    return fetch('http://localhost:9999/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: searchQueryArray, exact: true})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation: ', error);
    })
  }

  const searchByIds = (searchIdArray) => {
    return fetch('http://localhost:9999/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: searchIdArray})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation: ', error);
    })
  }
  

  const searchFilter = (e) => {
    async function handleSearchFilter() {
      if(String(e.target.value).length === 0 && vocabularyList === false){
        return
      }
  
      const splitCommaString = String(e.target.value).split(', ').map(ss => ss.replace(',', '')).map(ss => ss.replace(' ', ''))
      const isSplitCommaString = splitCommaString.length > 1
  
      const searchArray = isSplitCommaString ? splitCommaString : [e.target.value]
      setSearchArray(searchArray)
  
      let filterArray = exactSearch ? await searchExact(searchArray) : await search(searchArray)
      if(filterArray.length > 0 && exactKanjiKana) {
        filterArray = filterArray.filter(f => {
          let hasKanji = f.kanji.length > 0
          let searchStringValues = hasKanji ? 
            [...f.kanji.map(k => k.text)] :
            [...f.kana.map(k => k.text)]
          return searchArray.filter(sa => {
            return searchStringValues.indexOf(sa) > -1
          }).length > 0
        })
      }
  
      if(filterArray.length > 0) {
        // console.log(filterArray);
        // if(filterArray.length > 150){
        //   setResults(filterArray.slice(0, 150))
        // } else {
          setResults(filterArray.sort((a, b) => {
            if(exactOrder) { return 0 }
            let aCommons = [...a.kana.filter(k => k.common === true), ...a.kanji.map(k => k.common === true)]
            let bCommons = [...b.kana.filter(k => k.common === true), ...b.kanji.map(k => k.common === true)]
            return bCommons.length - aCommons.length
          }).sort((a,b) => {
            if(exactOrder) { return 0 }
            let isUserDataVocabA = userData.words[a.id] !== undefined ? 1 : 0
            let isUserDataVocabB = userData.words[b.id] !== undefined ? 1 : 0
            return isUserDataVocabB - isUserDataVocabA
          })
          // .slice(0, 25)
          .filter((f, fi) => {
            return isPlaying ? (fi === listPlayerIndex) : f 
          }))
        // }
      } else {
        setResults([])
      }            
    }
    handleSearchFilter()
  }

  const onInputChange = (e) => {
    setSearchValue(String(e.target.value))
  }

  const onListInputChange = (e) => {
    setListSearchValue(String(e.target.value))
  }

  const onTagListInputChange = (e) => {
    setTagListSearchValue(String(e.target.value))
  }

  const onMinListInputChange = (e) => {
    setMinScore(String(e.target.value))
  }

  const onMaxListInputChange = (e) => {
    setMaxScore(String(e.target.value))
  }

  const clearMinMaxScore = () => {
    setMinScore(-10)
    setMaxScore(10)
  }

  // debug
  // window.setCountdown = (s) => setCountdown(s)
  window.getListPlayerIndex = () => listPlayerIndex
  window.setListPlayerIndex = (i) => setListPlayerIndex(i)
  window.setIsPlaying = (i) => setIsPlaying(i)
  window.getAllAddedDates = getAllAddedDates
  window.getJSON = getJSON
  window.saveUserData = saveUserData
  window.commaSeparateList = commaSeparateList
  window.openWindowWithString = openWindowWithString
  window.createAddedDate = createAddedDate

  const activeClass = 'hover:bg-zinc-500 bg-zinc-700 cursor-pointer text-white'
  const inactiveClass = 'hover:bg-zinc-400 bg-zinc-300 cursor-pointer text-black'

  useEffect(() => {
    window.playerInterval = playerInterval
  }, [playerInterval])

  useEffect(() => {
    window.flashCardMode = isPlaying
    if(isPlaying===true) {
      windowCountDown(staticList.length)
    }
  }, [isPlaying, staticList.length])

  useEffect(() => {
    const fetchSetUserDataEntries = async () => {
      if(userDataEntries === null) {
        const searchByIdsResults = await searchByIds(Object.keys(userData.words));
        setUserDataEntries(searchByIdsResults)
      }  
    }

    if(userData !== null && activeVocabulary !== null) {
      setUserLists(getAllAddedDates())
      if(isPlaying!==true){
        setStaticList([...activeVocabulary])
      }
      fetchSetUserDataEntries()
    }
  }, [
    userData,
    activeVocabulary
  ])

  // useEffect(() => {
  //   console.log(userDataEntries)
  // }, [
  //   userDataEntries
  // ])

  useEffect(() => {
    if(userData === null) {
      fetch('http://localhost:8080/db.json', {cache: "no-store"})
      .then((res) => res.json())
      .then((jsonResponseData) => setUserData(jsonResponseData))
    }
  }, [])


  // handles the users history and vocab on the left side of the application
  useEffect(()=> {
    async function handleUserData() {
      if(userData && userDataEntries !== null) {
        const result = userDataEntries;

        let filteredVocabList = result.filter((fi) => {
          return userData.words[fi.id].active === undefined || userData.words[fi.id].active === true;
        })
        .filter(avf => {
          let kanjis = avf.kanji.length > 0 ? avf.kanji.map(kj => kj.text) : [];
          let kanas = avf.kana.length > 0 ? avf.kana.map(kj => kj.text) : [];
  
          if(listSearchValue !== '') {
            if(listExactSearch) {
              kanjis = kanjis.filter(kj => kj === listSearchValue)
              kanas = kanas.filter(kj => kj === listSearchValue)
            } else {
              kanjis = kanjis.filter(kj => kj.indexOf(listSearchValue) > -1)
              kanas = kanas.filter(kj => kj.indexOf(listSearchValue) > -1)
            }
          }
  
          return kanjis.length + kanas.length > 0 ? true : false
        })
        .map((ud, udi) => {
            let addedDate = new Date(userData.words[ud.id].events.filter(e => {
              return e.type === 'addedDate'
            })[0].t)
            let addedDateFormatted = `${addedDate.getMonth() + 1}/${addedDate.getDate()}`
            return { ...ud, tags: [addedDateFormatted] }  
        })
        .sort((a, b) => {
            if(exactOrder === true) {
              return 0
            }
            let aTimestamp = userData.words[a.id].events.filter(e => {
              return e.type === 'addedDate'
            })[0].t
            let bTimestamp = userData.words[b.id].events.filter(e => {
              return e.type === 'addedDate'
            })[0].t
            return  bTimestamp - aTimestamp  
        })
        .filter(f => {
          if(tagListSearchValue !== '') {
            let foundInSearch = false
            let splitTags = tagListSearchValue.split(', ').map(t => t.replace(',', '').replace(' ', ''))
            splitTags.forEach((st) => {
              if(tagListExactSearch) {
                if(f.tags.filter(t => t === st).length > 0) {
                  foundInSearch = true
                }
              } else {
                if(f.tags.filter(t => t.indexOf(st) > -1).length > 0) {
                  foundInSearch = true
                }
              }  
            })
            return foundInSearch
          } else {
            return true
          }
        })
        .map(f => {
          let scoreArray = userData.words[f.id].events
          .filter(e => {
            return e.type === 'score'
          })
          .map(m => m.s)
          let totalScore = 0
          if(scoreArray.length > 0){
            totalScore = scoreArray.reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            })
          }
          const arrayLength = scoreArray.length ? scoreArray.length : 1
          const averageScore = totalScore / arrayLength
          return { ...f, totalScore, averageScore }
        })
        .filter(f => {
          let minScoreGuard = minScore !== null ? minScore : -10
          let maxScoreGuard = maxScore !== null ? maxScore : 10
          return f.averageScore >= minScoreGuard && f.averageScore <= maxScoreGuard ? true : false
        })
  
        setActiveVocabulary(filteredVocabList.sort((a, b) => {
          let aScore = userData.words[a.id].events
          .filter((f) => {
            if(f.type === 'score') {
              return true
            } else {
              return false
            }
          })

          if(aScore.length > 0) {
            aScore = aScore.map(s => s.s)
            .reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            })
          } else {
            aScore = -100
          }

          let bScore = userData.words[b.id].events
          .filter((f) => {
            if(f.type === 'score') {
              return true
            } else {
              return false
            }
          })

          if(bScore.length > 0) {
            bScore = bScore.map(s => s.s)
            .reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            })
          } else {
            bScore = -100
          }

          return aScore - bScore
        }))
      }
    }

    handleUserData()

  }, [userData, listSearchValue, tagListSearchValue, listExactSearch, tagListExactSearch, maxScore, minScore, userDataEntries])

  useEffect(() => {
    searchFilter({target: { value: searchValue }})
  }, [exactSearch, searchValue, exactKanjiKana])

  const search = (searchQueryArray) => {
    return fetch('http://localhost:9999/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: searchQueryArray})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation: ', error);
    })
  }
  

  return (
    <div className="flex flex-col h-full items-center justify-start">
      <div id="routes-container" className="w-full p-8" >
        <div className="drop-shadow-lg border text-xl px-4 py-3 bg-zinc-100 rounded-lg flex items-center justify-between mb-4">
          <span className="mr-4 flex justify-start text-2xl">JLPT <span className="italic pl-2 text-zinc-700">Study</span></span>
          <span className="w-full flex justify-between">
            <input id="search-input" className="border-2 rounded-lg w-full p-2 pl-4" placeholder={'Search'} type="text" onChange={onInputChange} />
            <button
              style={{transition: 'all 300ms', width: '150px'}}
              className={`${exactSearch ? activeClass : inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}
              onClick={() => {
                  setExactSearch(!exactSearch)
                }
              }
            >Exact Search</button>
            <button
              style={{transition: 'all 300ms', width: '150px'}}
              className={`${exactKanjiKana ? activeClass : inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}
              onClick={() => {
                  setExactKanjiKana(!exactKanjiKana)
                }
              }
            >Single Word</button>
            {/* <button
              style={{transition: 'all 300ms', width: '150px'}}
              className={`${exactOrder ? activeClass : inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}
              onClick={() => {
                  setExactOrder(!exactOrder)
                }
              }
            >Exact Order</button> */}
            
          </span>
        </div>          
        
        <div className="flex w-full">
          <div className={`${isPlaying ? 'w-0 overflow-hidden opacity-0' : 'w-1/4 mr-4 p-4 border rounded-lg drop-shadow-lg'} flex flex-col bg-white`} style={{transition: 'width 300ms, opacity 300ms'}}>
          <div className="flex justify-between mb-4">
            <div className="text-xl italic text-zinc-700">Vocabulary</div>
            <div className="flex">
            <button
                style={{transition: 'all 300ms'}}
                className={`${inactiveClass} mr-1 text-sm px-4 rounded-lg inline-block`}
                onClick={(e) => {
                    const listOnly = () =>{
                      const vocabCSV = userData && activeVocabulary.map(ud => {
                        let kanjis = ud.kanji.length > 0 ? ud.kanji.map(kj => kj.text) : [];
                        let kanas = ud.kana.length > 0 ? ud.kana.map(kj => kj.text) : [];
  
                        return kanjis.length ? 
                        kanjis.map(m => m) : 
                        kanas.map(m => m)  
                      })
  
                      const reducedVocabCSV = vocabCSV.reduce((acc, val) => {
                        return acc.concat(val)
                      })
                      navigator.clipboard.writeText(reducedVocabCSV.join(','))  
                    }

                    const markdownList = () =>{
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
                      console.log(reducedVocabCSV)
                      navigator.clipboard.writeText(reducedVocabCSV.join(','))  
                    }

                    e.shiftKey ? markdownList() : listOnly()

                  }
                }
              >
                <img style={{minHeight: '12px', minWidth: '12px', maxHeight: '12px', maxWidth: '12px'}} src={copy}></img>
              </button>
              <button
                style={{transition: 'all 300ms'}}
                className={`${vocabularyList ? activeClass : inactiveClass} text-sm px-4 rounded-lg inline-block`}
                onClick={() => {
                    setVocabularyList(!vocabularyList)
                  }
                }
              >{vocabularyList ? 'X' : '>'}</button>

            </div>
            </div>
            <div className="flex pb-4">
              <input
                id="list-search-input"
                className="border-2 rounded-lg w-full p-2 pl-4"
                placeholder={'Search'}
                type="text"
                onChange={onListInputChange}
              />
              <button
                style={{transition: 'all 300ms'}}
                className={`${listExactSearch ? activeClass : inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}
                onClick={() => {
                    setListExactSearch(!listExactSearch)
                  }
                }
              >Exact</button>
            </div>
            <div className="flex pb-4">
                <input
                  id="list-search-input"
                  className="border-2 rounded-lg w-full p-2 pl-4 mr-1"
                  placeholder={'Min Score'}
                  type="text"
                  onChange={onMinListInputChange}
                  value={minScore}
                />
                <input
                  id="list-search-input"
                  className="border-2 rounded-lg w-full p-2 pl-4 ml-1"
                  placeholder={'Max Score'}
                  type="text"
                  onChange={onMaxListInputChange}
                  value={maxScore}
                />
                <button
                  onClick={clearMinMaxScore}
                  style={{transition: 'all 300ms'}}
                  className={`${inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}  
                >X</button>
              </div>

            <div className="flex pb-4">
              <div className="relative w-full">
                <img
                  alt="Selet List"
                  className="absolute"
                  style={{transition: 'all 200ms', right: '16px', top: '16px', transform: listSelectorOpen ? '' : 'rotate(180deg'}}
                  src={caret}
                  onClick={() => {
                    setListSelectorOpen(!listSelectorOpen)
                    document.querySelector('.list-selector-option-0').focus()
                  }}
                />
                <div className={`${listSelectorOpen ? '' : 'pointer-events-none opacity-0'} absolute bg-white border-2 rounded-lg w-full p-2`} style={{transition: 'all 200ms', top: '48px', zIndex: '10'}}>
                  {userLists.sort(function(a, b) {
                      // Split the date by '/' and create a new Date object
                      let aDate = new Date('2023/' + a); // using 2023 as a dummy year
                      let bDate = new Date('2023/' + b); // using 2023 as a dummy year

                      // Now, compare the two dates
                      if (aDate > bDate) {
                          return -1;
                      } else if (aDate < bDate) {
                          return 1;
                      } else {
                          return 0;
                      }
                  }).map((list, index) => {
                    return (
                      <div className={`p-2 list-selector-option-${index} hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer rounded-lg`} key={index} onClick={() => {
                        setListSelectorOpen(!listSelectorOpen)
                        document.querySelector('#list-search-tag-input').value = list
                        setTagListSearchValue(list)
                      }}>
                        {list}
                      </div>  
                    )
                  })}
                </div>
                <input
                  id="list-search-tag-input"
                  className="border-2 rounded-lg w-full p-2 pl-4"
                  placeholder={'Tag Search'}
                  type="text"
                  onChange={onTagListInputChange}
                />
              </div>
              <button
                style={{transition: 'all 300ms'}}
                className={`${tagListExactSearch ? activeClass : inactiveClass} text-sm px-4 rounded-lg ml-2 inline-block`}
                onClick={() => {
                    setTagListExactSearch(!tagListExactSearch)
                  }
                }
              >Exact</button>
            </div>
            {
              userData && activeVocabulary
                .slice(0,100)
                .map(ud => {
                let kanjis = ud.kanji.length > 0 ? ud.kanji.map(kj => kj.text) : [];
                let kanas = ud.kana.length > 0 ? ud.kana.map(kj => kj.text) : [];

                return (
                  <div key={`${ud.id}`} className={`rounded-lg py-2 px-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer`} >
                    <div className="flex">
                      <div className="flex flex-col">
                        {
                          ud.tags.map((t, ti) => {
                            return (<span key={`${ud.id}-tag-${ti}`} className="text-sm bg-zinc-200 text-black rounded-lg px-2 py-1 mr-2 cursor-pointer" onClick={() => {
                              setTagListSearchValue(t);
                              document.querySelector('#list-search-tag-input').value = t
                            }}>{
                              t
                              }</span>)
                          })
                        }
                      </div>
                      <div className="flex flex-col">
                        {
                          kanjis.length ? kanjis.map((m, mi) => { return (
                            <span key={`${ud.id}-kanjis-${mi}`} className="hover:underline" onClick={() => {
                              document.querySelector('#search-input').value = m
                              setSearchValue(m)}}
                            >
                              {m}
                            </span>
                          )}) : 
                          kanas.map((m, mi) => { return (
                            <span key={`${ud.id}-kanas-${mi}`} className="hover:underline" onClick={() => {
                              document.querySelector('#search-input').value = m
                              setSearchValue(m)}}
                            >
                              {m}
                            </span>
                          )})
                        }
                      </div>
                    </div>
                  </div>
                )
              })  
            }
          </div>
          <div className={`text-xl px-4 py-2 bg-white border rounded-lg flex justify-start drop-shadow-lg w-full`}>
            <div className={`flex flex-col justify-start content-start w-full`}>
              <div className="flex flex-none justify-between w-full py-2">
                <div className="text-xl italic text-zinc-700">
                  {vocabularyList ? `Vocabulary (${isPlaying ? `${listPlayerIndex+1}/` : ''}${staticList.length}) ${((staticList.length * playerInterval)/60).toFixed(0)}:${((staticList.length * playerInterval)%60).toFixed(0)}` : `Search Results (${results.length})`}
                </div>
                <div className="view-toggle flex" style={{transition: 'all 300ms'}}>
                <button
                    className={`flex-none ${inactiveClass} ml-1 text-sm px-4 py-2 rounded-lg inline-block`}
                    style={{transition: 'all 300ms'}}
                    onClick={
                      () => {
                        // console.log(userInputTag,userInputTag.length > 0)
                        studyVocabList(vocabularyList ? activeVocabulary : results, userInputTag)
                      }
                    }
                  ><div>Study All</div></button>
                  <input style={{width: '150px'}} id="tag-all-list-input" className="ml-1 text-sm border-2 rounded-lg w-full p-1 pl-2" placeholder={'Tag'} type="text" onChange={(e) => setUserInputTag(e.target.value)} />
                  <button
                    className={`${inactiveClass} ml-1 text-sm px-4 py-2 rounded-lg inline-block`}
                    style={{transition: 'all 300ms'}}
                    onClick={
                      () => {
                        // console.log(userInputTag,userInputTag.length > 0)
                        tagVocabList(vocabularyList ? activeVocabulary : results, userInputTag)
                      }
                    }
                  ><div>Tag All</div></button>
                  <button
                    className={`${isPlaying ? activeClass : inactiveClass} ml-1 text-sm px-4 py-2 rounded-lg inline-block`}
                    style={{transition: 'all 300ms'}}
                    onClick={() => {
                        if(isPlaying) {
                          setIsPlaying(false)
                          window.clearInterval(window.timerInterval)
                        } else {
                          setIsPlaying(true)
                        }
                        document.querySelector('#play-controller-input').focus()
                      }
                    }
                  >{`${isPlaying ? 'Stop' : 'Play'}`}</button>

                  <input style={{left: '0px', top: '0px'}} className="opacity-0 fixed bg-transparent" id="play-controller-input" placeholder={''} type="text" onKeyDown={
                    (e) => {
                      if(e.key === 'ArrowUp') {
                        testVocab((window.timerValue % playerInterval) === 0 ? 10 : (window.timerValue % playerInterval) * (10 / playerInterval))
                      }
                      if(e.key === 'ArrowDown') {
                        testVocab((window.timerValue % playerInterval) === 0 ? -10 : (window.timerValue % playerInterval) * (10 / playerInterval) * -1)
                      }
                    }
                  } />

                  <input style={{width: '75px'}} id="player-interval" className="ml-1 text-sm border-2 rounded-lg w-full p-1 pl-2" value={playerInterval} placeholder='Seconds' type="text" onChange={(e) => setPlayerInterval(e.target.value)} />
                  <button
                    className={`ml-1 ${resultsInteractionMode === 'flashcard' ? activeClass : inactiveClass} text-sm px-4 py-2 rounded-lg inline-block`}
                    style={{transition: 'all 300ms'}}
                    onClick={() => {
                      resultsInteractionMode === 'flashcard' ? setResultsInteractionMode('') : setResultsInteractionMode('flashcard')
                      }
                    }
                  >Flashcard</button>
                  <button
                    className={`${resultsViewMode === 'notecard' ? activeClass : inactiveClass} ml-1 text-sm px-4 py-2 rounded-lg inline-block`}
                    style={{transition: 'all 300ms'}}
                    onClick={() => {
                      resultsViewMode === 'notecard' ? setResultsViewMode('') : setResultsViewMode('notecard')
                      }
                    }
                  >Notecard</button>
                </div>

              </div>
              <style>
                {`
                  .fade-in-10-15 {
                    opacity: 0;
                    animation: fadeInAnimation ease-in ${(playerInterval/2) * 3}s forwards;
                  }        
                
                  .fade-in-5-10 {
                    opacity: 0;
                    animation: fadeInAnimationDelay ${playerInterval}s forwards;
                  }
                  
                  .fade-in-0-5 {
                    opacity: 0;
                    animation: fadeInAnimation ${playerInterval/2}s forwards;
                  }
                `}
              </style>
              <div className={`flex ${resultsViewMode === 'notecard' ? 'flex-wrap self-start justify-start' : 'flex-col justify-start'} `}>
                {(textMode === true && vocabularyList && activeVocabulary && (<div>Textmode</div>)
                )}
                {
                  (textMode === false && vocabularyList === false && results.length > 0 && isPlaying === false) && (
                  results
                  .slice(0, 50)
                  .map(r => DisplayVocab({
                    vocab: r,
                    parentSetter: setSearchValue,
                    userDataId: userData.words[r.id],
                    userData: userData,
                    setUserData: setUserData,
                    type:resultsViewMode,
                    exactKanjiKana: exactKanjiKana,
                    searchValue: searchArray,
                    resultsInteractionMode: resultsInteractionMode,
                    setTagListSearchValue: setTagListSearchValue,
                    studyVocabAddUserDataEntry: studyVocabAddUserDataEntry
                  })
                ))}
                {(textMode === false && vocabularyList !== false && isPlaying === false) && (
                  activeVocabulary
                  .slice(0, 50)            
                  .map(r => DisplayVocab({
                    vocab: r, 
                    parentSetter: setSearchValue, 
                    userDataId: userData.words[r.id], 
                    userData: userData, 
                    setUserData: setUserData, 
                    type: resultsViewMode, 
                    exactKanjiKana: exactKanjiKana, 
                    searchValue: searchArray, 
                    resultsInteractionMode: resultsInteractionMode, 
                    setTagListSearchValue: setTagListSearchValue, 
                    studyVocabAddUserDataEntry: studyVocabAddUserDataEntry
                  })
                ))}
                {
                  (textMode === false && vocabularyList !== false && isPlaying === true) && (
                    staticList
                    .filter((f, fi) => {
                      return isPlaying ? (fi === listPlayerIndex) : f 
                    })
                    .map(r => DisplayVocab({
                      vocab: r, 
                      parentSetter: setSearchValue, 
                      userDataId: userData.words[r.id], 
                      userData: userData, 
                      setUserData: setUserData, 
                      type: resultsViewMode, 
                      exactKanjiKana: exactKanjiKana, 
                      searchArray: searchArray, 
                      resultsInteractionMode: resultsInteractionMode, 
                      setTagListSearchValue: setTagListSearchValue, 
                      studyVocabAddUserDataEntry: studyVocabAddUserDataEntry
                    }))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;