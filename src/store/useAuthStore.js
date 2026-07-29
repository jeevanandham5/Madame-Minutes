import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'
import { firestoreService } from '../firebase/firestoreService'

const saveLocalRegisteredUser = (userObj) => {
  if (!userObj || !userObj.email) return
  try {
    const existingStr = localStorage.getItem('madame_registered_users') || '[]'
    const existing = JSON.parse(existingStr)
    if (!existing.some(u => u.email === userObj.email || u.uid === userObj.uid)) {
      existing.push(userObj)
      localStorage.setItem('madame_registered_users', JSON.stringify(existing))
    }
  } catch (err) {
    console.error('Error saving local user profile:', err)
  }
}

export const getLocalRegisteredUsers = () => {
  try {
    const existingStr = localStorage.getItem('madame_registered_users') || '[]'
    return JSON.parse(existingStr)
  } catch {
    return []
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthLoading: true,
  isFirebaseActive: isFirebaseConfigured,

  initAuthListener: () => {
    if (!isFirebaseConfigured || !auth) {
      // Offline / Fallback Guest TMA Agent User
      set({
        user: {
          uid: 'tma-agent-007',
          email: 'agent@tma.org',
          displayName: 'Agent User',
          photoURL: null,
          role: 'Senior Task Analyst',
          isGuest: true,
          isAdmin: false
        },
        isAuthLoading: false
      })
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const isAdmin = currentUser.email === 'jeevajeevanandham30@gmail.com'
        const computedName = (currentUser.displayName && currentUser.displayName !== 'Agent User' && currentUser.displayName !== 'TMA Agent')
          ? currentUser.displayName
          : (currentUser.email ? currentUser.email.split('@')[0] : 'TMA Agent')

        const userObj = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: computedName,
          photoURL: currentUser.photoURL,
          role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
          isAdmin
        }
        set({ user: userObj, isAuthLoading: false })
        // Save user profile in Firestore and local registry
        firestoreService.saveUserProfile(userObj)
        saveLocalRegisteredUser(userObj)
      } else {
        set({
          user: {
            uid: 'tma-agent-007',
            email: 'agent@tma.org',
            displayName: 'Agent User',
            photoURL: null,
            role: 'Senior Task Analyst',
            isGuest: true,
            isAdmin: false
          },
          isAuthLoading: false
        })
      }
    })

    return unsubscribe
  },

  loginWithEmail: async (email, password) => {
    const isAdmin = email === 'jeevajeevanandham30@gmail.com'
    const computedName = email.split('@')[0]
    const fallbackUserObj = {
      uid: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
      email,
      displayName: computedName,
      role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
      isAdmin,
      isGuest: false
    }

    if (!isFirebaseConfigured || !auth) {
      set({ user: fallbackUserObj })
      saveLocalRegisteredUser(fallbackUserObj)
      return { success: true }
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (cred?.user) {
        const userObj = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || cred.user.email?.split('@')[0] || computedName,
          photoURL: cred.user.photoURL,
          role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
          isAdmin
        }
        await firestoreService.saveUserProfile(userObj)
        saveLocalRegisteredUser(userObj)
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  registerWithEmail: async (email, password) => {
    const isAdmin = email === 'jeevajeevanandham30@gmail.com'
    const computedName = email.split('@')[0]
    const fallbackUserObj = {
      uid: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
      email,
      displayName: computedName,
      role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
      isAdmin,
      isGuest: false
    }

    if (!isFirebaseConfigured || !auth) {
      set({ user: fallbackUserObj })
      saveLocalRegisteredUser(fallbackUserObj)
      return { success: true }
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred?.user) {
        const userObj = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: computedName,
          photoURL: cred.user.photoURL,
          role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
          isAdmin
        }
        await firestoreService.saveUserProfile(userObj)
        saveLocalRegisteredUser(userObj)
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  loginWithGoogle: async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) return { success: true }
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      if (cred?.user) {
        const isAdmin = cred.user.email === 'jeevajeevanandham30@gmail.com'
        const computedName = cred.user.displayName || cred.user.email?.split('@')[0] || 'TMA Agent'
        const userObj = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: computedName,
          photoURL: cred.user.photoURL,
          role: isAdmin ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
          isAdmin
        }
        await firestoreService.saveUserProfile(userObj)
        saveLocalRegisteredUser(userObj)
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  logoutUser: async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth)
    }
    set({
      user: {
        uid: 'tma-agent-guest',
        email: 'guest@tma.org',
        displayName: 'Guest Agent',
        photoURL: null,
        role: 'Guest Agent',
        isGuest: true,
        isAdmin: false
      }
    })
  }
}))

if (typeof window !== 'undefined') {
  window.__useAuthStore = useAuthStore
}
