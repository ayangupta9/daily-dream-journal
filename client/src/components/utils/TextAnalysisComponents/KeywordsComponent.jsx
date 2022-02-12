import React from 'react'
import '../../../styles/KeywordsComponent.css'

const KeywordsComponent = props => {
  return (
    <div
      style={{
        maxWidth: '800px'
      }}
    >
      <h1 className='d-block font-monospace mt-2 fw-bold'>KEYWORDS FOUND</h1>

      {props.keywords
        .sort((keyword1, keyword2) => keyword2.relevance - keyword1.relevance)
        .map(keyword => {
          return (
            <div className='font-monospace keywordSpan'>
              {keyword.text}
              <span
                style={{
                  paddingLeft: '20px'
                }}
              >
                <b>{keyword.count}</b>
              </span>
            </div>
          )
        })}
    </div>
  )
}

export default KeywordsComponent
