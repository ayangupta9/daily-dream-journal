import React from 'react'
import '../../../styles/SentimentComponent.css'

const SentimentComponent = ({ confidenceScores }) => {
  return (
    <div id='sentimentComponentWrapper'>
      <h1 className='font-monospace mt-3'>SENTIMENTS DETECTED</h1>

      <div id='containsSentiments'>
        <div className='eachSentiment'>
          <div className='sentimentLogo'>😃</div>
          <span className='confidenceScore'>{confidenceScores.positive}</span>
          <p>
            <b>POSITIVE</b>
          </p>
        </div>
        <div className='eachSentiment'>
          <div className='sentimentLogo'>😐</div>
          <span className='confidenceScore'>{confidenceScores.neutral}</span>
          <p>
            <b>NEUTRAL</b>
          </p>
        </div>
        <div className='eachSentiment'>
          <div className='sentimentLogo'>😔</div>
          <span className='confidenceScore'>{confidenceScores.negative}</span>
          <p>
            <b>NEGATIVE</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SentimentComponent
