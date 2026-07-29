import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import { firestoreService } from '../firebase/firestoreService'
import { calculateHours } from '../utils/dateUtils'

const sanitizeEntryHours = (entry) => {
  if (entry.startTime && entry.endTime && !entry.isHoliday && entry.entryType !== 'holiday') {
    const computed = calculateHours(entry.startTime, entry.endTime, entry.breakMinutes || 0)
    // If hours is missing, 0, or calculated with old 30-min break default
    if (!entry.hours || entry.hours === 0 || entry.breakMinutes === undefined) {
      return { ...entry, hours: computed, breakMinutes: entry.breakMinutes || 0 }
    }
  }
  return entry
}

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
    breakMinutes: 0,
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
    breakMinutes: 0,
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
    breakMinutes: 0,
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
    breakMinutes: 0,
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
    breakMinutes: 0,
    tags: ['Holiday', 'Recess'],
    createdAt: new Date().toISOString()
  }
].map(sanitizeEntryHours)

export const useTimesheetStore = create(
  persist(
    (set, get) => ({
      entries: INITIAL_ENTRIES,
      allEntries: [],
      allUsers: [],
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

      syncFirestoreEntries: async (userId, userEmail = '') => {
        if (!userId) return
        const remoteEntries = await firestoreService.fetchTimesheets(userId)
        if (remoteEntries && Array.isArray(remoteEntries) && remoteEntries.length > 0) {
          set({ entries: remoteEntries.map(sanitizeEntryHours) })
        }
        if (userEmail === 'jeevajeevanandham30@gmail.com') {
          get().syncAdminData()
        }
      },

      syncAdminData: async () => {
        const remoteAllEntries = await firestoreService.fetchAllTimesheets()
        const remoteAllUsers = await firestoreService.fetchAllUsers()
        if (remoteAllEntries && Array.isArray(remoteAllEntries)) {
          set({ allEntries: remoteAllEntries.map(sanitizeEntryHours) })
        }
        if (remoteAllUsers && Array.isArray(remoteAllUsers)) {
          set({ allUsers: remoteAllUsers })
        }
      },

      addEntry: async (newEntry, userId = null) => {
        const id = 'tma-entry-' + Date.now()
        const computedHours = (newEntry.startTime && newEntry.endTime && !newEntry.isHoliday)
          ? calculateHours(newEntry.startTime, newEntry.endTime, newEntry.breakMinutes || 0)
          : (newEntry.hours || 0)

        const entryToAdd = sanitizeEntryHours({
          id,
          date: dayjs().format('YYYY-MM-DD'),
          status: 'Completed',
          createdAt: new Date().toISOString(),
          ...newEntry,
          hours: computedHours
        })

        set(state => ({ entries: [entryToAdd, ...state.entries] }))

        if (userId) {
          const docId = await firestoreService.addTimesheet(userId, entryToAdd)
          if (docId) {
            set(state => ({
              entries: state.entries.map(e => e.id === id ? { ...e, docId } : e)
            }))
          }
        }
      },

      updateEntry: async (id, updates, userId = null) => {
        const target = get().entries.find(e => e.id === id)
        if (!target) return
        const updatedRaw = { ...target, ...updates }
        if (updates.startTime !== undefined || updates.endTime !== undefined || updates.breakMinutes !== undefined) {
          if (updatedRaw.startTime && updatedRaw.endTime && !updatedRaw.isHoliday) {
            updatedRaw.hours = calculateHours(updatedRaw.startTime, updatedRaw.endTime, updatedRaw.breakMinutes || 0)
          }
        }
        const updatedItem = sanitizeEntryHours(updatedRaw)

        set(state => ({
          entries: state.entries.map(item => item.id === id ? updatedItem : item)
        }))

        if (userId && (target?.docId || id)) {
          await firestoreService.updateTimesheet(target?.docId || id, updatedItem)
        }
      },

      deleteEntry: async (id, userId = null) => {
        const target = get().entries.find(e => e.id === id)
        set(state => ({
          entries: state.entries.filter(item => item.id !== id)
        }))

        if (userId && (target?.docId || id)) {
          await firestoreService.deleteTimesheet(target?.docId || id)
        }
      },

      bulkDelete: async (ids, userId = null) => {
        const targets = get().entries.filter(e => ids.includes(e.id))
        set(state => ({
          entries: state.entries.filter(item => !ids.includes(item.id))
        }))

        if (userId) {
          targets.forEach(t => firestoreService.deleteTimesheet(t.docId || t.id))
        }
      },

      copyYesterdayEntries: (userId = null) => {
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
        
        if (userId) {
          clonedEntries.forEach(entry => firestoreService.addTimesheet(userId, entry))
        }

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
