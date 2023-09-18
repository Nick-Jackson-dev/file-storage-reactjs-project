//compatible with Firebase 9 and React
import { useState, useEffect, useRef } from "react"
import { db } from "../firebase/config"

//firebase imports
import { collection, onSnapshot, query, where } from "firebase/firestore"

export const useCollection = (c, _q) => {
  const [documents, setDocuments] = useState([])

  //setup query
  const q = useRef(_q).current

  useEffect(() => {
    let ref = collection(db, c)

    if (q && q.length) {
      ref = query(collection(db, c), where(...q))
    }

    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      const docs = []
      console.log(querySnapshot)
      querySnapshot.docs.forEach((doc) => {
        docs.push(doc.data())
      })
      setDocuments([...docs])
    })

    return () => unsubscribe()
  }, [c, q])

  return { documents }
}
