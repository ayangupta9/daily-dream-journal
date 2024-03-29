import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../utils/SearchBar'
import '../../styles/SearchPage.css'
import { useNavigate } from 'react-router-dom'
import { formattedDateForEntrySummary } from '../../util/FormattedDate'
import { accessCurrentUser } from '../../util/AccessCurrentUser'

const SearchedItemSummary = ({ entry }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/entry/${entry.entryId}`)
      }}
      className='searchedItem p-3 bg-light'
    >
      <div className='searchedItemContent'>
        <b className='text-start'>{entry.entrytitle}</b>
        <i>{formattedDateForEntrySummary(entry.timestamp)}</i>
      </div>

      {entry.entrycontent !== undefined ? (
        <p className='text-start mb-1 text-start'>
          {entry.entrycontent
            .split(' ')
            .slice(0, 15)
            .join(' ')}
          ...
        </p>
      ) : null}
    </div>
  )
}

const SearchPage = () => {
  const [searchedQuery, setSearchedQuery] = useState('')
  const [searchedList, setSearchedList] = useState([])
  const searchBarRef = useRef(null)

  const navigate = useNavigate()

  let totalEntries = null
  if (accessCurrentUser()) {
    totalEntries = accessCurrentUser().entries
  } else {
    navigate('/error')
  }

  useEffect(() => {
    totalEntries.forEach(entry => {
      if (
        entry.hasOwnProperty('dreamType') &&
        entry.dreamType.constructor.name === 'Object'
      ) {
        let entryDreamType = JSON.parse(entry.dreamType)
        const newEntryDreamType = Object.entries(entryDreamType)
          .map(newEntry => {
            if (newEntry[1] === 'true' || newEntry[1] === true) {
              return newEntry[0]
            }
          })
          .filter(newEntry => newEntry !== undefined)
        entry.dreamType = newEntryDreamType.join(' ')
      }
    })
  }, [])

  function searchInEntries () {
    let filteredEntries = []

    filteredEntries = totalEntries.filter(entry => {
      return Object.values(entry)
        .join('')
        .toLowerCase()
        .includes(searchedQuery.toLowerCase())
    })

    return filteredEntries
  }

  useEffect(() => {
    setSearchedList(searchInEntries())
  }, [searchedQuery])

  return (
    <div id='searchPage'>
      <div id='searchPageContent'>
        <SearchBar
          searchBarRef={searchBarRef}
          searchedQuery={searchedQuery}
          setSearchedQuery={setSearchedQuery}
        />
        <div className='divider'></div>
        {searchedList.length === 0 ? (
          <div className='alert'>
            <i>No entries yet! 😴</i>
          </div>
        ) : (
          <div id='searchedItemSummaryContainer'>
            {Array.from(searchedList).map((item, idx) => {
              return <SearchedItemSummary key={idx} entry={item} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
