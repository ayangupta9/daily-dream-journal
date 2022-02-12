import React from 'react'

const CategoriesComponent = ({ categories }) => {
  return (
    <div className='categoriesWrapper'>
      <h1 className='font-monospace mt-3'>CATEGORIES DETECTED</h1>

      <div id='categoriesContainer'>
        {categories.map(category => {
          return (
            <div className='categoryLabelWrapper'>
              {category.label
                .replace('/', '')
                .split('/')
                .map(newLabel => {
                  return (
                    <>
                      <b className='boldCategoryLabel'>{newLabel}</b>
                      <hr
                        style={{
                          width: '100%',
                          marginTop: '2px',
                          marginBottom: '2px'
                        }}
                      />
                    </>
                  )
                })}

              <span className='categoryScore'>{category.score}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoriesComponent
