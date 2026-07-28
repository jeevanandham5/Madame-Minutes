import React from 'react'
import { TimelineEditor } from '../components/timeline/TimelineEditor'

export function TimelinePage({ onOpenAddModal }) {
  return (
    <div className="space-y-6">
      <TimelineEditor onOpenAddModal={onOpenAddModal} />
    </div>
  )
}
