import React from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const EmotionComponent = ({ emotions }) => {
  const emotionsColors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)'
  ]

  const data = {
    labels: ['sadness', 'joy', 'fear', 'disgust', 'anger'],
    datasets: [
      {
        label: '# of Votes',
        data: Object.values(emotions),
        backgroundColor: emotionsColors,
        // 'rgba(255, 159, 64, 0.7)'
        borderColor: ['white', 'white', 'white', 'white', 'white', 'white'],
        borderWidth: 1
      }
    ]
  }

  return (
    <div className='emotionsWrapper'>
      <h1 className='font-monospace pb-1 mt-3'>EMOTIONS DETECTED</h1>
      <span className='mb-3 font-monospace doughnutInfo'>
        <i>
          <b>* Hover over each sector to see distribution</b>
        </i>
      </span>

      <div id='doughnutChart'>
        <div id='doughnutContainer'>
          <Doughnut
            options={{
              layout: {
                padding: 5
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

export default EmotionComponent
