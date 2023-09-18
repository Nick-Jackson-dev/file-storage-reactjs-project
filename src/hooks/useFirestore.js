//uses Firebase 9
import { useState } from "react"
import { db } from "../firebase/config"
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore"

export function useFirestore() {
  const [isCanceled, setIsCanceled] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  const setDocument = async (documentPath, data) => {
    setError("")
    setIsPending(true)

    try {
      await setDoc(doc(db, documentPath), data)

      if (!isCanceled) setIsPending(false)
    } catch (err) {
      if (!isCanceled) {
        console.log(err.message)
        setIsPending(false)
        return setError(err.message)
      }
    }
  }

  const updateDocument = async (documentPath, updateObject) => {
    setError("")
    setIsPending(true)

    try {
      await updateDoc(doc(db, documentPath), updateObject)
      if (!isCanceled) {
        setIsPending(false)
      }
    } catch (err) {
      if (!isCanceled) {
        setError(err.message)
        console.log(err.message)
        setIsPending(false)
      }
    }
  }

  const getDocument = async (docPath) => {
    setError("")
    setIsPending(true)

    try {
      const data = await (await getDoc(doc(db, docPath))).data()

      if (!isCanceled) {
        setIsPending(false)
      }
      return data
    } catch (err) {
      if (!isCanceled) {
        setError(err.message)
        console.log(err.message)
        setIsPending(false)
      }
    }
  }

  const addDocument = async (collectionPath, data) => {
    setError(null)
    setIsPending(true)

    try {
      await addDoc(collection(db, collectionPath), data)
      if (!isCanceled) setIsPending(false)
    } catch (err) {
      if (!isCanceled) {
        console.log(err.message)
        setIsPending(false)
        setError(err.message)
      }
    }
  }

  const deleteDocument = async (docPath) => {
    setError(null)
    setIsPending(true)

    try {
      await deleteDoc(doc(db, docPath))
      if (!isCanceled) setIsPending(false)
    } catch (err) {
      if (!isCanceled) {
        console.log(err.message)
        setIsPending(false)
        setError(err.message)
      }
    }
  }

  const getDocuments = async (collectionPath, queryArray) => {
    setError("")
    setIsPending(true)
    let hasQuery = false
    if (queryArray && queryArray.length === 3) hasQuery = true

    try {
      const docs = []
      let ref = null
      if (hasQuery)
        ref = query(collection(db, collectionPath), where(...queryArray))
      else ref = collection(db, collectionPath)

      const querySnapshot = await getDocs(ref)
      querySnapshot.forEach((doc) => {
        docs.push(doc.data())
      })

      if (!isCanceled) {
        setIsPending(false)
      }
      return docs
    } catch (err) {
      if (!isCanceled) {
        console.log(err.message)
        setIsPending(false)
        return setError(err.message)
      }
    }
  }

  // useEffect(() => {
  //     return () => setIsCanceled(true)
  // },[])

  return {
    isPending,
    error,
    setDocument,
    updateDocument,
    getDocument,
    addDocument,
    deleteDocument,
    getDocuments,
  }
}

// can't get cleanup function to work properly - unmounts when the function is invoked at theplace where it is
