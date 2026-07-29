import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import { firestoreService } from '../firebase/firestoreService'

const INITIAL_ENTRIES = [
  {
    id: 'tma-entry-1',
    date: dayjs().format('YYYY-MM-DD'),
    project: 'TMA Core / Nexus',
    taskTitle: 'Master Timeline Monotonic Sync',
    description: 'Resolved timeline deviation anomalies in Sector 63. Calibrated temporal sensors and logged branch variances.',
    status: 'Completed',
    startTime: '09:00',
    endTime: '12:30',
    hours: 3.5,
    tags: ['Critical', 'Nexus'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tma-entry-2',
    date: dayjs().format('YYYY-MM-DD'),
    project: 'Madame Minute AI',
    taskTitle: 'Voice Prompt Calibration & Speech Synthesis',
    description: 'Updated acoustic neural weights for Madame Minute retro speech synthesizer. Optimized warning notifications.',
    status: 'In Progress',
    startTime: '13:30',
    endTime: '17:00',
    hours: 3.5,
    tags: ['AI', 'Audio'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tma-entry-3',
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    project: 'Chrono Dashboard',
    taskTitle: 'CRT Monitor Scanline Shader Optimization',
    description: 'Refactored CSS webgl scanline filters to decrease GPU power drain on vintage terminal workstations.',
    status: 'Completed',
    startTime: '10:00',
    endTime: '16:00',
    hours: 6.0,
    tags: ['Frontend', 'Performance'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tma-entry-4',
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    project: 'Vault-Tec Protocol',
    taskTitle: 'Security Clearance Audit',
    description: 'Audited Level 4 access logs across all variant record archives. Verified zero unauthorized timeline overwrites.',
    status: 'Completed',
    startTime: '08:30',
    endTime: '15:30',
    hours: 7.0,
    tags: ['Security', 'Audit'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tma-entry-holiday-1',
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    project: 'Official Recess',
    taskTitle: 'Official Public Holiday - Organization Recess',
    description: 'TMA Official Organization Holiday. All variant temporal logs paused for Official Recess celebration.',
    status: 'Holiday',
    isHoliday: true,
    entryType: 'holiday',
    startTime: '00:00',
    endTime: '23:59',
    hours: 8.0,
    tags: ['Holiday', 'Recess'],
    createdAt: new Date().toISOString()
  }
]

export const useTimesheetStore = create(
  persist(
    (set, get) => ({
      entries: INITIAL_ENTRIES,
      activeTimer: {
        isRunning: false,
        elapsedSeconds: 0,
        taskTitle: '',
        project: 'TMA Core / Nexus',
        startTime: null
      },
      searchQuery: '',
      selectedProjectFilter: 'All',
      selectedStatusFilter: 'All',

      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedProjectFilter: (proj) => set({ selectedProjectFilter: proj }),
      setSelectedStatusFilter: (status) => set({ selectedStatusFilter: status }),

      addEntry: async (newEntry, userId = null) => {
        const id = 'tma-entry-' + Date.now()
        const entryToAdd = {
          id,
          date: dayjs().format('YYYY-MM-DD'),
          status: 'Completed',
          createdAt: new Date().toISOString(),
          ...newEntry
        }

        set(state => ({ entries: [entryToAdd, ...state.entries] }))

        if (userId) {
          await firestoreService.addTimesheet(userId, entryToAdd)
        }
      },

      updateEntry: async (id, updates, userId = null) => {
        set(state => ({
          entries: state.entries.map(item => item.id === id ? { ...item, ...updates } : item)
        }))

        if (userId) {
          await firestoreService.updateTimesheet(id, updates)
        }
      },

      deleteEntry: async (id, userId = null) => {
        set(state => ({
          entries: state.entries.filter(item => item.id !== id)
        }))

        if (userId) {
          await firestoreService.deleteTimesheet(id)
        }
      },

      bulkDelete: async (ids, userId = null) => {
        set(state => ({
          entries: state.entries.filter(item => !ids.includes(item.id))
        }))

        if (userId) {
          ids.forEach(id => firestoreService.deleteTimesheet(id))
        }
      },

      copyYesterdayEntries: () => {
        const yesterdayStr = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        const todayStr = dayjs().format('YYYY-MM-DD')
        const yesterdayEntries = get().entries.filter(e => dayjs(e.date).format('YYYY-MM-DD') === yesterdayStr)

        if (yesterdayEntries.length === 0) return 0

        const clonedEntries = yesterdayEntries.map(e => ({
          ...e,
          id: 'tma-entry-' + Math.random().toString(36).substr(2, 9),
          date: todayStr,
          status: 'Completed',
          createdAt: new Date().toISOString()
        }))

        set(state => ({ entries: [...clonedEntries, ...state.entries] }))
        return clonedEntries.length
      },

      // Timer control
      startTimer: (taskTitle = '', project = 'TMA Core / Nexus') => set(state => ({
        activeTimer: {
          ...state.activeTimer,
          isRunning: true,
          taskTitle: taskTitle || state.activeTimer.taskTitle,
          project: project || state.activeTimer.project,
          startTime: state.activeTimer.startTime || new Date().toISOString()
        }
      })),

      pauseTimer: () => set(state => ({
        activeTimer: {
          ...state.activeTimer,
          isRunning: false
        }
      })),

      tickTimer: () => set(state => ({
        activeTimer: {
          ...state.activeTimer,
          elapsedSeconds: state.activeTimer.elapsedSeconds + 1
        }
      })),

      stopAndSaveTimer: (userId = null) => {
        const { activeTimer } = get()
        if (activeTimer.elapsedSeconds < 10) {
          set({
            activeTimer: { isRunning: false, elapsedSeconds: 0, taskTitle: '', project: 'TMA Core / Nexus', startTime: null }
          })
          return null
        }

        const hours = parseFloat((activeTimer.elapsedSeconds / 3600).toFixed(2))
        const now = dayjs().format('HH:mm')
        const start = activeTimer.startTime ? dayjs(activeTimer.startTime).format('HH:mm') : '09:00'

        const newEntry = {
          id: 'tma-entry-' + Date.now(),
          date: dayjs().format('YYYY-MM-DD'),
          project: activeTimer.project || 'TMA Core / Nexus',
          taskTitle: activeTimer.taskTitle || 'Logged Session',
          description: `Logged via Madame Minute Live Timer (${Math.floor(activeTimer.elapsedSeconds / 60)} minutes tracked)`,
          status: 'Completed',
          startTime: start,
          endTime: now,
          hours,
          tags: ['Timer', 'Live'],
          createdAt: new Date().toISOString()
        }

        get().addEntry(newEntry, userId)
        set({
          activeTimer: { isRunning: false, elapsedSeconds: 0, taskTitle: '', project: 'TMA Core / Nexus', startTime: null }
        })
        return newEntry
      }
    }),
    {
      name: 'madame-minute-timesheets'
    }
  )
)
