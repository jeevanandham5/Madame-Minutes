import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'

export const firestoreService = {
  async fetchTimesheets(userId) {
    if (!isFirebaseConfigured || !db || !userId) return null
    try {
      const q = query(
        collection(db, 'timesheets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Error fetching timesheets from Firestore:', err)
      return null
    }
  },

  async fetchAllTimesheets() {
    if (!isFirebaseConfigured || !db) return null
    try {
      const q = query(
        collection(db, 'timesheets'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Error fetching all timesheets from Firestore:', err)
      return null
    }
  },

  async saveUserProfile(userObj) {
    if (!isFirebaseConfigured || !db || !userObj?.uid) return
    try {
      const ref = doc(db, 'users', userObj.uid)
      const cleanName = (userObj.displayName && userObj.displayName !== 'Agent User' && userObj.displayName !== 'TMA Agent')
        ? userObj.displayName
        : (userObj.email ? userObj.email.split('@')[0] : 'TMA Agent')

      await setDoc(ref, {
        uid: userObj.uid,
        email: userObj.email || '',
        displayName: cleanName,
        photoURL: userObj.photoURL || null,
        role: userObj.email === 'jeevajeevanandham30@gmail.com' ? 'Master Timeline Commander (Admin)' : 'TMA Agent',
        isAdmin: userObj.email === 'jeevajeevanandham30@gmail.com',
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (err) {
      console.error('Error saving user profile to Firestore:', err)
    }
  },

  async fetchAllUsers() {
    if (!isFirebaseConfigured || !db) return null
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Error fetching all users from Firestore:', err)
      return null
    }
  },

  async addTimesheet(userId, entry) {
    if (!isFirebaseConfigured || !db) return null
    try {
      const docRef = await addDoc(collection(db, 'timesheets'), {
        ...entry,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding timesheet to Firestore:', err)
      return null
    }
  },

  async updateTimesheet(id, updates) {
    if (!isFirebaseConfigured || !db) return null
    try {
      const ref = doc(db, 'timesheets', id)
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      return true
    } catch (err) {
      console.error('Error updating timesheet in Firestore:', err)
      return false
    }
  },

  async deleteTimesheet(id) {
    if (!isFirebaseConfigured || !db) return null
    try {
      await deleteDoc(doc(db, 'timesheets', id))
      return true
    } catch (err) {
      console.error('Error deleting timesheet in Firestore:', err)
      return false
    }
  },

  async fetchProjects() {
    if (!isFirebaseConfigured || !db) return null
    try {
      const snapshot = await getDocs(collection(db, 'projects'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Error fetching projects from Firestore:', err)
      return null
    }
  }
}
