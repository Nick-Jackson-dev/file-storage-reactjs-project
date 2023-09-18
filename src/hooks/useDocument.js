//compatible with Firebase 9 and React
import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'

//firebase imports
import  { doc, onSnapshot } from 'firebase/firestore'

export const useDocument = (docPath) => {
    const [docData, setDocData] = useState(null)

    useEffect(() => {
        let ref = doc(db, docPath)

        const unsub = onSnapshot(ref, (snapshot) => {
            setDocData(snapshot.data())
        })

        return () => unsub()
    }, [docPath])

    return { docData }
}