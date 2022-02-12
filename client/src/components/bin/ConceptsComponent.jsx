import React from 'react'

const ConceptsComponent = () => {
  const concepts = [
    { text: 'English-language films', relevance: 0.985181 },
    { text: '1990s music groups', relevance: 0.713847 },
    { text: '2003 albums', relevance: 0.589966 },
    { text: 'ARIA Charts', relevance: 0.56669 },
    { text: 'The Work', relevance: 0.559047 },
    { text: 'Graph theory', relevance: 0.55809 },
    { text: 'The Notebook', relevance: 0.54558 },
    { text: 'Talk radio', relevance: 0.542262 }
  ]

  return (
    <div
      style={{
        maxWidth: '800px'
      }}
    >
      <h1 className='font-monospace text-white mt-5 mb-3'>CONCEPTS DETECTED</h1>

      {concepts.map(concept => {
        return (
          <p
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {concept.text} {concept.relevance}
          </p>
        )
      })}
    </div>
  )
}

export default ConceptsComponent
