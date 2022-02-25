import React from 'react'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'

const EntitiesComponent = props => {
  let randomColors = [
    '#ff3d3d', // anger
    '#57ff84', // disgust
    '#7e3dff', // fear
    '#ffe26e', // joy,
    '#5980ff' // sad
  ]

  return (
    <div id='entitiesWrapper'>
      <h1 className='font-monospace mb-4 mt-5'>ENTITIES DETECTED</h1>

      <div id='entitiesContainer'>
        {props.entities.length === 0 ? (
          <h6
            className='font-monospace'
            style={{
              textAlign: 'center',
              width: '100%'
            }}
          >
            No entities detected
          </h6>
        ) : null}

        {props.entities.map((entity, idx) => {
          let totalEmotion = 0

          Object.values(entity.emotion).forEach(val => {
            totalEmotion += val
          })

          return (
            <ul
              key={idx}
              className='list-group list-group-flush'
              id='entityWrapper'
            >
              <li className='list-group-item'>
                <span>Name</span>
                <h2
                  className='display-4 font-monospace'
                  style={{
                    fontSize: '25px'
                  }}
                >
                  {entity.text}
                </h2>
              </li>

              <li className='list-group-item'>
                <span>Entity type</span>
                <h2
                  className='display-4 font-monospace'
                  style={{
                    fontSize: '25px'
                  }}
                >
                  {entity.type}
                </h2>
              </li>

              <li className='list-group-item'>
                <span>Confidence</span>
                <h2
                  className='display-4 font-monospace'
                  style={{
                    fontSize: '25px'
                  }}
                >
                  {entity.confidence}
                </h2>
              </li>

              <li className='list-group-item'>
                <span className='mb-2'>Sentiment</span>
                <h6 className='m-0 font-monospace'>{entity.sentiment.label}</h6>
                <h6 className='font-monospace'>{entity.sentiment.score}</h6>
              </li>

              <li className='list-group-item'>
                <span>Emotion*</span>
                <div className='entityEmotionContainer'>
                  {Object.entries(entity.emotion).map((emo, index) => {
                    return (
                      <Tooltip
                        trigger={'hover'}
                        key={index}
                        overlay={
                          <div className='m-0 p-1'>
                            <h5>{emo[0]}</h5>
                            <h6>{emo[1]}</h6>
                          </div>
                        }
                      >
                        <div
                          style={{
                            maxWidth: '100%',
                            height: `${(emo[1] / totalEmotion) * 120}px`,
                            backgroundColor: `${randomColors[index]}`
                          }}
                        ></div>
                      </Tooltip>
                    )
                  })}
                </div>
              </li>
            </ul>
          )
        })}
      </div>
    </div>
  )
}

export default EntitiesComponent
