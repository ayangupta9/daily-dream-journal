import React from 'react'

const DreamTypeCheckboxes = props => {
  const dreamCategories = [
    'nightmare',
    'fantasy',
    'symbolic',
    'lucid',
    'bizarre',
    'recurring'
  ]

  const dreamTypeEmoji = ['😱', '👾', '💡', '👁', '🌪', '🔁']

  return (
    <>
      <label
        id='dreamTypeWrapperLabel'
        htmlFor='dreamTypeWrapper'
        className='font-monospace'
      >
        Dream Type
      </label>
      <div id='dreamTypeWrapper'>
        {dreamCategories.map((dreamCat, i) => {
          return (
            <div key={i} className='form-check'>
              <label
                htmlFor={dreamCat}
                className='form-check-label text-uppercase'
              >
                {dreamTypeEmoji[dreamCategories.indexOf(dreamCat)]} {dreamCat}
              </label>
              <input
                className='form-check-input'
                type='checkbox'
                name={dreamCat}
                id={dreamCat + 'Checkbox'}
                onClick={event => {
                  let newDreamType = { ...props.dreamType }
                  if (event.target.checked) {
                    newDreamType[dreamCat] = true
                    // props.setDreamType(newDreamTypes)
                  } else {
                    newDreamType[dreamCat] = false
                  }
                  props.setDreamType(newDreamType)
                }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default DreamTypeCheckboxes
