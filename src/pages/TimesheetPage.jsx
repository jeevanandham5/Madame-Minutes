import React from 'react'
import { TimesheetTable } from '../components/timesheet/TimesheetTable'

export function TimesheetPage({ onOpenAddModal }) {
  return (
    <div className="space-y-6">
      <TimesheetTable onOpenAddModal={onOpenAddModal} />
    </div>
  )
}
