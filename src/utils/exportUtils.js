export function exportToCSV(entries, filename = 'madame_minute_timesheet.csv') {
  if (!entries || !entries.length) return

  const headers = ['Date', 'Project', 'Task Title', 'Description', 'Status', 'Start Time', 'End Time', 'Hours', 'Tags']
  
  const rows = entries.map(e => [
    `"${e.date || ''}"`,
    `"${e.project || ''}"`,
    `"${(e.taskTitle || e.task || '').replace(/"/g, '""')}"`,
    `"${(e.description || '').replace(/"/g, '""')}"`,
    `"${e.status || ''}"`,
    `"${e.startTime || ''}"`,
    `"${e.endTime || ''}"`,
    `"${e.hours || 0}"`,
    `"${Array.isArray(e.tags) ? e.tags.join(', ') : e.tags || ''}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
