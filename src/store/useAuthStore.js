import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'

export const useAuthStore = create((set) => ({
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
          isGuest: true
        },
        isAuthLoading: false
      })
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        set({
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email.split('@')[0],
            photoURL: currentUser.photoURL,
            role: 'TMA Agent'
          },
          isAuthLoading: false
        })
      } else {
        set({
          user: {
            uid: 'tma-agent-007',
            email: 'agent@tma.org',
            displayName: 'Agent User',
            photoURL: null,
            role: 'Senior Task Analyst',
            isGuest: true
          },
          isAuthLoading: false
        })
      }
    })

    return unsubscribe
  },

  loginWithEmail: async (email, password) => {
    if (!isFirebaseConfigured || !auth) return { success: true }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  registerWithEmail: async (email, password) => {
    if (!isFirebaseConfigured || !auth) return { success: true }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  loginWithGoogle: async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) return { success: true }
    try {
      await signInWithPopup(auth, googleProvider)
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
        isGuest: true
      }
    })
  }
}))
