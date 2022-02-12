import React from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'reactstrap'

const CreateEntryFloatButton = () => {
  return (
    <div id='createEntryFloatButtonWrapper'>
      <Link
        className='btn btn-outline-dark'
        id='createEntryButton'
        
        to={'/create'}
      >
        📝 CREATE
      </Link>
    </div>
  )
}

export default CreateEntryFloatButton
