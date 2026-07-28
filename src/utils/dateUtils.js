import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export function formatDate(date, formatStr = 'MMM DD, YYYY') {
  return dayjs(date).format(formatStr)
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  if (timeStr.includes(':')) {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${m} ${ampm}`
  }
  return timeStr
}

export function calculateHours(startTime, endTime, breakMinutes = 0) {
  if (!startTime || !endTime) return 0
  const todayStr = dayjs().format('YYYY-MM-DD')
  const start = dayjs(`${todayStr} ${startTime}`)
  let end = dayjs(`${todayStr} ${endTime}`)

  if (end.isBefore(start)) {
    end = end.add(1, 'day')
  }

  const diffMinutes = end.diff(start, 'minute') - (parseInt(breakMinutes, 10) || 0)
  const hours = Math.max(0, diffMinutes / 60)
  return parseFloat(hours.toFixed(2))
}

export function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0

  const uniqueDates = [...new Set(entries.map(e => dayjs(e.date).format('YYYY-MM-DD')))].sort().reverse()
  if (uniqueDates.length === 0) return 0

  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  let streak = 0
  let checkDate = uniqueDates.includes(today) ? today : uniqueDates.includes(yesterday) ? yesterday : null

  if (!checkDate) return 0

  let current = dayjs(checkDate)
  while (uniqueDates.includes(current.format('YYYY-MM-DD'))) {
    streak += 1
    current = current.subtract(1, 'day')
  }

  return streak
}

export function getHeatmapData(entries) {
  // Generate past 90 days grid
  const days = []
  const today = dayjs()
  for (let i = 89; i >= 0; i--) {
    const dateObj = today.subtract(i, 'day')
    const dateStr = dateObj.format('YYYY-MM-DD')
    const dayEntries = entries.filter(e => dayjs(e.date).format('YYYY-MM-DD') === dateStr)
    const totalHours = dayEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)
    
    let level = 0
    if (totalHours > 0 && totalHours < 3) level = 1
    else if (totalHours >= 3 && totalHours < 6) level = 2
    else if (totalHours >= 6 && totalHours < 8) level = 3
    else if (totalHours >= 8) level = 4

    days.push({
      date: dateStr,
      formattedDate: dateObj.format('MMM DD, YYYY'),
      totalHours: totalHours.toFixed(1),
      count: dayEntries.length,
      level
    })
  }
  return days
}
