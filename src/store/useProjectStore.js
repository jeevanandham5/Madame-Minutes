import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_PROJECTS = [
  { id: 'p1', name: 'TMA Core / Nexus', color: '#F59E0B', code: 'TMA', budget: 120 },
  { id: 'p2', name: 'Madame Minute AI', color: '#F97316', code: 'MMAI', budget: 80 },
  { id: 'p3', name: 'Chrono Dashboard', color: '#22C55E', code: 'DASH', budget: 50 },
  { id: 'p4', name: 'Vault Protocol', color: '#3B82F6', code: 'VAULT', budget: 100 },
  { id: 'p5', name: 'Master Timeline Audit', color: '#A855F7', code: 'AUDIT', budget: 60 }
]

export const useProjectStore = create(
  persist(
    (set) => ({
      projects: DEFAULT_PROJECTS,
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: 'proj-' + Date.now() }]
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      }))
    }),
    { name: 'madame-minute-projects' }
  )
)
