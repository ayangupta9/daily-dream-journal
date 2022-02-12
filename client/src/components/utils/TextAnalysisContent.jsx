import React from 'react'
import '../../styles/TextAnalysisContent.css'
import CategoriesComponent from './TextAnalysisComponents/CategoriesComponent'
import EmotionComponent from './TextAnalysisComponents/EmotionComponent'
import EntitiesComponent from './TextAnalysisComponents/EntitiesComponent'
import KeywordsComponent from './TextAnalysisComponents/KeywordsComponent'
import SentimentComponent from './TextAnalysisComponents/SentimentComponent'

const TextAnalysisContent = ({
  textAnalysis,
  showAnalysis,
  textAnalysisRef
}) => {
  return (
    <div
      ref={textAnalysisRef}
      id='textAnalysisContent'
      className={
        showAnalysis.first
          ? 'firstComponent'
          : showAnalysis.second
          ? 'secondComponent'
          : 'thirdComponent'
      }
    >
      {showAnalysis.first === true ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <KeywordsComponent keywords={textAnalysis._keywords} />
          <EntitiesComponent entities={textAnalysis._entities} />
          <p className='text-light align-self-end mt-3 mb-1'>
            <b className='me-1'>
              <sup>*</sup>
            </b>

            <i>Hover over stacked emotion bar to see distribution</i>
          </p>
        </div>
      ) : null}

      {showAnalysis.second === true ? (
        <>
          <SentimentComponent
            confidenceScores={textAnalysis._sentenceSentiment.confidenceScores}
          />
          <div className='emotionsCategoriesWrapper'>
            <EmotionComponent emotions={textAnalysis._emotion} />
            <CategoriesComponent categories={textAnalysis._categories} />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default TextAnalysisContent
