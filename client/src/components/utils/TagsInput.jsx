import { useState } from 'react'
import '../../styles/TagsInput.css'

export const TagsInput = props => {
  const [tags, setTags] = useState(props.tags)

  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

  const addTags = event => {
    if (event.target.value !== '') {
      setTags([...tags, event.target.value.trim()])
      props.setTags([...tags, event.target.value.trim()])
      event.target.value = ''
    }
  }
  return (
    <div className='tags-input'>
      <input
        className='form-control'
        type='text'
        onKeyUp={event => (event.key === ' ' ? addTags(event) : null)}
        placeholder='Press Space to add tags'
      />

      <div id='tagsScrollContainer'>
        {tags.length > 0 ? (
          <ul className='p-0' id='tags'>
            {tags.map((tag, index) => (
              <li
                className='bg-dark text-light mx-1 py-1 tag-title'
                key={index}
              >
                {`${tag}`}
                <span
                  className='removeTagButton'
                  onClick={() => removeTags(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <h6
            style={{
              width: '100%',
              textAlign: 'center'
            }}
          >
            No {props.tagTitle} added yet
          </h6>
        )}
      </div>
    </div>
  )
}
