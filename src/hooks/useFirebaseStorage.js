//react and Firebase 9
import { useState } from "react"

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { storage } from "../firebase/config"

export const useFirebaseStorage = () => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  const uploadFile = async (uploadPath, file, metadata, maxSize, fileType) => {
    setIsPending(true)
    setError("")
    let documentURL = ""
    //if needed, check for correct filetype
    if (fileType && !file.type.includes(fileType)) {
      setIsPending(false)
      return setError(`the selected file needs to be of type ${fileType}`)
    }
    //if needed check for filesize - maxSize is in bytes
    if (maxSize && file.size > maxSize) {
      setIsPending(false)
      return setError(`the selected file needs to be of type ${fileType}`)
    }

    try {
      const fileReference = ref(storage, `${uploadPath}`)
      const doc = await uploadBytes(fileReference, file, metadata)
      documentURL = await getDownloadURL(doc.ref)
      setIsPending(false)
    } catch (err) {
      setIsPending(false)
      return setError("the file upload was unsuccessful: ", err)
    }

    return documentURL
  }

  const downloadPDF = async (docURL, fileName) => {
    setIsPending(true)
    setError("")

    const file = getDownloadURL(ref(storage, docURL))
      .then((url) => {
        const dl = new XMLHttpRequest()
        const a = document.createElement("a")
        dl.responseType = "blob"
        dl.onload = (e) => {
          const blob = dl.response
          a.href = window.URL.createObjectURL(
            new Blob([blob], { type: "file/pdf" })
          )
          a.download = fileName
          a.click()
        }
        dl.open("GET", url)
        dl.send()
        setIsPending(false)
      })
      .catch((err) => {
        setIsPending(false)
        console.log(err)
        setError(err)
      })
    return
  }

  const deleteFile = async (docURL) => {
    setIsPending(true)
    setError("")
    const docRef = ref(storage, docURL)
    deleteObject(docRef)
      .then(() => {
        // File deleted successfully
        setIsPending(false)
      })
      .catch((error) => {
        console.log(error)
        setError(error)
        setIsPending(false)
      })
  }

  return { isPending, error, uploadFile, downloadPDF, deleteFile }
}
