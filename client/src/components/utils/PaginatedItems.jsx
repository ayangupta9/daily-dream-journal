import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import EntrySummary from './EntrySummary'
import '../../styles/PaginatedItems.css'

const Items = props => {
  return (
    <div id='entriesList'>
      {props.currentItems &&
        props.currentItems.map((entry, index) => {
          return <EntrySummary key={index} index={index + 1} entry={entry} />
        })}
    </div>
  )
}

const PaginatedItems = props => {
  const [currentItems, setCurrentItems] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)

  useEffect(() => {
    const endOffset = itemOffset + props.itemsPerPage
    setCurrentItems(props.items.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(props.items.length / props.itemsPerPage))
  }, [props.items, itemOffset, props.itemsPerPage])

  const handlePageClick = event => {
    const newOffset = (event.selected * props.itemsPerPage) % props.items.length

    setItemOffset(newOffset)
  }

  return (
    <>
      <Items currentItems={currentItems} />
      <div id='paginateWrapper'>
        <ReactPaginate
          nextLabel='>'
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel='<'
          pageClassName='page-item'
          pageLinkClassName='page-link'
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakLabel='...'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          containerClassName='pagination'
          activeClassName='active'
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  )
}

export default PaginatedItems
