import React, { useEffect, useState } from 'react'
import HeatMap from '@uiw/react-heat-map'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const DatesHeatmap = props => {
  const [activeIndex, setActiveIndex] = useState(0)

  const [activeValue, setActiveValue] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    setActiveValue(props.dates[Object.keys(props.dates)[activeIndex]].items)
    setStartDate(
      props.dates[Object.keys(props.dates)[activeIndex]].dateRange.startDate
    )
    setEndDate(
      props.dates[Object.keys(props.dates)[activeIndex]].dateRange.endDate
    )
  }, [activeIndex])

  return (
    <>
      {activeValue && startDate && endDate && (
        <div id='calendarHeatmapWrapper'>
          <div id='yearChanger'>
            <button
              disabled={activeIndex === 0}
              onClick={() => {
                if (activeIndex !== 0) {
                  setActiveIndex(activeIndex - 1)
                }
              }}
              className='btn yearChangeButton'
            >
              <FaChevronLeft />
            </button>
            <h4 className='fw-light'>{startDate.split('-')[0]}</h4>
            <button
              disabled={activeIndex === Object.keys(props.dates).length - 1}
              onClick={() => {
                if (activeIndex < Object.keys(props.dates).length - 1) {
                  setActiveIndex(activeIndex + 1)
                }
              }}
              className='btn yearChangeButton'
            >
              <FaChevronRight />
            </button>
          </div>
          <br />
          <HeatMap
            value={activeValue}
            width={720}
            rectSize={11}
            style={{
              display: 'inline',
              float: 'none'
            }}
            widths={20}
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            panelColors={{
              0: '#EBEDF0',
              1: '#7BC96F',
              2: '#C6E48B',
              3: '#239A3B',
              4: '#196127'
            }}
            rectProps={{
              rx: '4.5px'
            }}
            rectRender={(props, data) => {
              return (
                <Tooltip
                  key={data.index}
                  placement={'top'}
                  trigger={'click'}
                  overlay={
                    <p className='m-0 p-0'>
                      <b>Date: </b>
                      {new Date(data.date).toDateString()}
                      <br />
                      <b className='m-0 p-0'>{'Dream Entries: '}</b>
                      {data.count || 0}
                    </p>
                  }
                >
                  <rect {...props} />
                </Tooltip>
              )
            }}
          />
        </div>
      )}
    </>
  )
}

export default DatesHeatmap
