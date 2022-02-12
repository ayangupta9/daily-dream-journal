import React from 'react'

const SearchBar = ({ searchedQuery, setSearchedQuery, searchBarRef }) => {

  return (
    <div id='searchBarWrapper' className='fixed-top'>
      <div id='searchBar'>
        <h1 className='mt-2 fw-light'>SEARCH YOUR DREAM ENTRY 🔍</h1>

        <input
          ref={searchBarRef}
          onChange={event => {
            setSearchedQuery(event.target.value)
          }}
          value={searchedQuery}
          type='text'
          name='dreamSearchInput'
          className='form-control dreamSearchInput'
        />
      </div>
    </div>
  )
}

export default SearchBar
