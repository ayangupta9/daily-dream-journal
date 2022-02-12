const days = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formattedDateForProfile = timestamp => {
  const date = new Date(parseInt(timestamp))
  const formattedDay = days[date.getDay()]
  const formattedMonth = month[date.getMonth()]
  const finalFormattedDate = `${formattedDay}, ${formattedMonth} ${date
    .getDate()
    .toString()
    .padStart(2, 0)}, ${date.getFullYear()}`
  console.log(finalFormattedDate)
  return finalFormattedDate
}

export const formattedDateForEntrySummary = timestamp => {
  const date = new Date(parseInt(timestamp))
  const formattedDay = days[date.getDay()]
  const formattedMonth = month[date.getMonth()]

  const formattedTime = `${date
    .getHours()
    .toString()
    .padStart(2, 0)}:${date
    .getMinutes()
    .toString()
    .padStart(2, 0)}`

  const finalFormattedDate = `${formattedTime}    |    ${formattedDay}, ${formattedMonth} ${date
    .getDate()
    .toString()
    .padStart(2, 0)}, ${date.getFullYear()}`
  return finalFormattedDate
}
