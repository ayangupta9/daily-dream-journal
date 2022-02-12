import React, { useEffect, useState } from 'react'
import 'animate.css'
import { useLocation } from 'react-router'
import { FaDiceOne, FaDiceTwo } from 'react-icons/fa'
import ToggleSwitch from '../utils/ToggleSwitch'
import TextAnalysisContent from '../utils/TextAnalysisContent'
import { useRef } from 'react'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import DreamImageComponent from '../utils/DreamImageComponent'
import { formattedDateForEntrySummary } from '../../util/FormattedDate'

const DreamContent = ({
  textContent,
  sentenceSentiment,
  isToggled,
  setIsToggled
}) => {
  return (
    <>
      <div id='dreamEntryContent' className='dreamEntryFields mt-2 mb-3'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
          className='dreamEntryContentHeader'
        >
          <h5 className='fw-bold'>Description</h5>

          <ToggleSwitch isToggled={isToggled} setIsToggled={setIsToggled} />
        </div>
        <p
          style={{
            textAlign: 'justify'
          }}
        >
          {isToggled === true ? (
            <>
              {sentenceSentiment.sentences.map((sentence, idx) => {
                let sentenceColor = null
                if (sentence.sentiment === 'positive') {
                  sentenceColor = 'rgba(0,255,0,0.15)'
                } else if (sentence.sentiment === 'negative') {
                  sentenceColor = 'rgba(255,0,0,0.15)'
                } else if (sentence.sentiment === 'neutral') {
                  sentenceColor = 'rgba(173,216,230,0.5)'
                }

                return (
                  <>
                    <Tooltip
                
                      placement={'top'}
                      trigger={'click'}
                      key={idx}
                      overlay={
                        <p
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}
                          className='m-0 p-0'
                        >
                          <b className='m-0 p-0'>Confidence Scores:</b>
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'space-evenly'
                            }}
                          >
                            <b>Positive : </b>
                            {sentence.confidenceScores[0]}
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'space-evenly'
                            }}
                          >
                            <b>Neutral : </b>
                            {sentence.confidenceScores[1]}
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'space-evenly'
                            }}
                          >
                            <b>Negative : </b>
                            {sentence.confidenceScores[2]}
                          </span>
                          {/* {data.count || 0} */}
                        </p>
                      }
                    >
                      <span
                        key={idx}
                        style={{
                          backgroundColor: `${sentenceColor}`,
                          cursor: 'pointer'
                        }}
                      >
                        {sentence.text}{' '}
                      </span>
                    </Tooltip>
                  </>
                )
              })}
            </>
          ) : (
            <>{textContent}</>
          )}

          {/* {textContent.split('.').map((sentence, idx) => {})} */}
        </p>
      </div>
    </>
  )
}

const NotebookTablets = ({ isToggled, setShowAnalysis, textAnalysisRef }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '25px',
        marginLeft: '20px'
        // marginTop: '5px'
      }}
    >
      <div
        onClick={
          isToggled === true
            ? () => {
                setShowAnalysis({
                  first: true,
                  second: false
                })

                // window.scrollBy({
                //   top: textAnalysisRef.current.offsetTop
                // })
              }
            : null
        }
        style={{
          backgroundColor: 'orangered'
        }}
        className={`bookmark ${isToggled === true ? 'showSide' : 'hideSide'}`}
      >
        <FaDiceOne />
      </div>

      <div
        onClick={() => {
          setShowAnalysis({
            first: false,
            second: true
          })
          // window.scrollTo({
          //   top: textAnalysisRef.current.offsetTop -20
          // })
        }}
        style={{
          backgroundColor: 'blueviolet'
        }}
        className={`bookmark ${isToggled === true ? 'showSide' : 'hideSide'}`}
      >
        <FaDiceTwo />
      </div>
    </div>
  )
}

const EntryDetailsPage = props => {
  const [dreamEntry, setDreamEntry] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState({
    first: false,
    second: false
  })
  const [isToggled, setIsToggled] = useState(false)

  const [textAnalysis, setTextAnalysis] = useState(null)

  const entryContentRef = useRef(null)
  const textAnalysisRef = useRef(null)
  const params = useLocation()

  const dreamTypeEmoji = ['😱', '👾', '💡', '👁', '🌪', '🔁']

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let entries = currentUser.entries

    const entryId = params.pathname.split('/')[2]
    const index = entries.findIndex(entry => entry.entryId === entryId)
    let currentEntry = entries[index]

    currentEntry.dreamType = JSON.parse(currentEntry.dreamType)

    if (currentEntry.hasOwnProperty('characters')) {
      currentEntry.characters = currentEntry.characters.split(',')
    }
    if (currentEntry.hasOwnProperty('locations')) {
      currentEntry.locations = currentEntry.locations.split(',')
    }
    if (currentEntry.hasOwnProperty('emotions')) {
      currentEntry.emotions = currentEntry.emotions.split(',')
    }

    if (currentEntry.textAnalysis) {
      currentEntry.textAnalysis = JSON.parse(currentEntry.textAnalysis)
    }

    setShowAnalysis({
      ...showAnalysis
    })

    setTextAnalysis(currentEntry.textAnalysis)

    setDreamEntry({ ...currentEntry, index: index })
  }, [showAnalysis, params.pathname])

  useEffect(() => {
    if (textAnalysisRef.current !== null) {
      window.scrollTo({
        top: textAnalysisRef.current.offsetTop - 50
      })
    }
  }, [showAnalysis])

  useEffect(() => {
    setShowAnalysis({ first: false, second: false })
  }, [isToggled])

  return (
    <div id='entryDetailsPage'>
      {dreamEntry && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <NotebookTablets
            isToggled={isToggled}
            setShowAnalysis={setShowAnalysis}
            textAnalysisRef={textAnalysisRef}
            // entryContentRef={entryContentRef}
          />

          <div ref={entryContentRef} id='entryDetailsContent'>
            <h2 id='dreamEntryIndexHeader'>
              {/* DREAM ENTRY */}
              <div id='indexHeader'>{dreamEntry.index + 1}</div>
            </h2>
            <h4 id='dreamTitleHeader' className='text-dark'>
              {dreamEntry.entrytitle}
            </h4>
            <h5 id='dreamTimeHeader'>
              <i>{formattedDateForEntrySummary(dreamEntry.timestamp)}</i>
            </h5>

            <div id='dreamEntry'>
              <div id='firstRowFieldsWrapper'>
                {dreamEntry.entry_time_went_to_bed && (
                  <div
                    className='dreamEntryFields m-1 firstRowField'
                    id='hitTheBedTime'
                  >
                    <h5 className='fw-bold'>Time went to bed</h5>
                    <p>{dreamEntry.entry_time_went_to_bed}</p>
                  </div>
                )}

                {dreamEntry.entry_mood_at_bedtime && (
                  <div
                    id='moodsBeforeHittingBed'
                    className='dreamEntryFields m-1 firstRowField'
                  >
                    <h5 className='fw-bold'>Mood(s) before hitting the bed</h5>
                    <p>{dreamEntry.entry_mood_at_bedtime}</p>
                  </div>
                )}

                {dreamEntry.dreamType &&
                  Object.values(dreamEntry.dreamType).findIndex(
                    type => type === true
                  ) !== -1 && (
                    <div
                      className='m-1 firstRowField'
                      id='dreamTypeDetailsWrapper'
                    >
                      <h5 className='fw-bold'>Dream type</h5>
                      <div
                        style={{
                          width: '100%',
                          textAlign: 'start',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          gap: '5px'
                        }}
                      >
                        {Object.entries(dreamEntry.dreamType).map(
                          (dreamTypeEntry, index) => {
                            if (dreamTypeEntry[1] === true) {
                              return (
                                <p key={index} className='dreamTypeVal'>
                                  {dreamTypeEmoji[index]} {dreamTypeEntry[0]}
                                </p>
                              )
                            } else {
                              return null
                            }
                          }
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div id='secondRowFieldsWrapper'>
                {dreamEntry.characters && (
                  <div
                    id='dreamEntryCharacters'
                    className='dreamEntryFields secondRowField'
                  >
                    <h5 className='fw-bold'>People in my dream</h5>
                    {/* {dreamEntry.characters} */}

                    <div className='displayChipsWrapper'>
                      {dreamEntry.characters.map(character => {
                        if (character.length > 0) {
                          return (
                            <span className='bg-dark text-light displayChip'>
                              {character}
                            </span>
                          )
                        } else {
                          return null
                        }
                      })}
                    </div>
                  </div>
                )}

                {dreamEntry.locations && (
                  <div
                    id='dreamEntryLocations'
                    className='dreamEntryFields secondRowField'
                  >
                    <h5 className='fw-bold'>Places & Locations in my dream</h5>
                    {/* {dreamEntry.locations} */}
                    <div className='displayChipsWrapper'>
                      {dreamEntry.locations.map(location => {
                        if (location.length > 0) {
                          return (
                            <span className='bg-dark text-light displayChip'>
                              {location}
                            </span>
                          )
                        } else {
                          return null
                        }
                      })}
                    </div>
                  </div>
                )}

                {dreamEntry.emotions && (
                  <div
                    id='dreamEntryEmotions'
                    className='dreamEntryFields secondRowField'
                  >
                    <h5 className='fw-bold'>Emotions & Feelings</h5>
                    {/* {dreamEntry.emotions.constructor.name} */}
                    <div className='displayChipsWrapper'>
                      {dreamEntry.emotions.map(emotion => {
                        if (emotion.length > 0) {
                          return (
                            <span className='bg-dark text-light displayChip'>
                              {emotion}
                            </span>
                          )
                        } else {
                          return null
                        }
                      })}
                    </div>
                  </div>
                )}
              </div>

              {dreamEntry.entrycontent && textAnalysis && (
                <DreamContent
                  isToggled={isToggled}
                  setIsToggled={setIsToggled}
                  sentenceSentiment={textAnalysis._sentenceSentiment}
                  textContent={dreamEntry.entrycontent}
                />
              )}

              <DreamImageComponent
                entry_id={dreamEntry.entryId}
                profile_id={dreamEntry.profileId}
              />

              {dreamEntry.entry_postscript && (
                <div id='dreamEntryPostscript' className='dreamEntryFields'>
                  <h5 className='fw-bold'>PostScript (Any extra details)</h5>
                  <p>{dreamEntry.entry_postscript}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isToggled === true &&
      textAnalysis &&
      Object.values(showAnalysis).findIndex(val => val === true) !==
        -1 /*&& showAnalysis.textAnalysis*/ ? (
        <TextAnalysisContent
          textAnalysisRef={textAnalysisRef}
          textAnalysis={textAnalysis}
          showAnalysis={showAnalysis}
        />
      ) : null}
    </div>
  )
}

export default EntryDetailsPage

/*

😱 - nightmare
👾 - fantasy
💡 - symbolic
👁 -lucid
🌪 - bizzare
🔁 - recurring

*/
