import { transformKana } from '../js/utils'
import { kanjiObjects } from '../js/kanji'

const searchSetter = ({valueToSet, parentSetter}) => {
  if(document.querySelector('#search-input').value === '') {
    document.querySelector('#search-input').value = valueToSet
    parentSetter(valueToSet)
  } else {
    const newValue = document.querySelector('#search-input').value + `, ${valueToSet}`
    document.querySelector('#search-input').value = newValue
    parentSetter(newValue)
  }
}

export const DisplayKanji = ({kanji, parentSetter, vocabId}) => {
    const dictionaryEntry = kanjiObjects[kanji]
    
    return (
      <div key={`${vocabId}-DisplayKanji-${kanji}`} className="m-2">
        {dictionaryEntry ? (
        <div className="flex border rounded-lg p-2">
  
          <div className="flex flex-col justify-start items-start w-1/4">
            <div className={`text-4xl pl-2 pb-2`} ><span className={`cursor-pointer border-b border-white hover:border-zinc-500`}  onClick={() => {searchSetter({valueToSet: kanji, parentSetter: parentSetter})}}>{kanji}</span></div>
            <div className="bg-zinc-200 text-black py-2 px-3 rounded-lg inline-block text-sm ml-2">JLPT {dictionaryEntry.jlpt_new}</div>
            <div className="text-black px-3 inline-block text-sm mt-2"><span className="text-zinc-500 mr-1">Grade: </span><span>{dictionaryEntry.grade}</span></div>
            <div className="text-black px-3 inline-block text-sm"><span className="text-zinc-500 mr-1">Freq: </span><span>{dictionaryEntry.freq}</span></div>
            <div className="text-black px-3 inline-block text-sm"><span className="text-zinc-500 mr-1">Strokes: </span><span>{dictionaryEntry.strokes}</span></div>
          </div>
  
          <div className="text-sm w-1/4 p-1">
            {dictionaryEntry.meanings.map((kr, kri) => (<span key={`${vocabId}-DisplayKanji-meanings-${kri}`} className="">{kr}{kri !== dictionaryEntry.meanings.length - 1 ? ',' : ''} </span>))}
          </div>
  
  
          <div className="flex flex-col justify-start items-start w-1/2">
            <div className="flex justify-start items-start w-full">
              <span className="pr-2 font-bold">くん：</span>
              <div className="flex flex-col">
                {dictionaryEntry.readings_kun.map((kr, kri) => (<span key={`${vocabId}-DisplayKanji-meanings-readings_kun-${kri}`} className="cursor-pointer" onClick={() => {
                  let krs = kr
                  if(kr.indexOf('.') > -1){
                    krs = `${kanji}${kr.split('.')[1]}`
                  }
                  searchSetter({valueToSet: krs.replace(/[-.]/g, ''), parentSetter: parentSetter})}
                }><span className={`cursor-pointer border-b border-white hover:border-zinc-500`}  >{kr}</span></span>))}
              </div>
            </div>
            <div className="flex justify-start items-start w-full text-zinc-400">
              <div className="pr-2 font-bold">オン：</div>
              <div className="flex flex-col">
                {dictionaryEntry.readings_on.map((or, ori) => (<span key={`${vocabId}-DisplayKanji-meanings-readings_kun-${ori}`} className="cursor-pointer" onClick={() => {searchSetter({valueToSet: kanji, parentSetter: parentSetter})}}><span className={`cursor-pointer border-b border-white hover:border-zinc-500`}  >{transformKana(or)}</span></span>))}
              </div>
            </div>
          </div>
        </div>
      ) : (
          ''
        )}
      </div>
    )
  }