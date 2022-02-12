import React from 'react'
import { useNavigate } from 'react-router'
import '../../styles/EntrySummary.css'
import { formattedDateForEntrySummary } from '../../util/FormattedDate'

const EntrySummary = props => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/entry/${props.entry.entryId}`)
      }}
      className='entrySummary'
    >
      <div className='entryIndex'>{props.index}</div>

      <div className='entrySummaryTitle'>
        <b>{props.entry.entrytitle}</b>
      </div>
      <div className='entrySummaryAnalysis'>
        <b>
          <i>{props.entry.entryanalysis ? props.entry.entryanalysis : ''}</i>
        </b>
      </div>
      <div
        style={{
          textOverflow: 'ellipsis'
        }}
        className='entrySummaryContent'
      >
        {props.entry.entrycontent
          ? props.entry.entrycontent
              .split(' ')
              .slice(0, 10)
              .join(' ') + ' ...'
          : ''}
      </div>
      <div className='entrySummaryDate'>
        {formattedDateForEntrySummary(props.entry.timestamp)}
      </div>
    </div>
  )
}

export default EntrySummary
