//hooks
import { useState } from "react"
import { useFirebaseStorage } from "./useFirebaseStorage"
import { useFirestore } from "./useFirestore"
import { useDocumentContext } from "./useDocumentContext"

//utilities
import { format } from "date-fns"
import { getFileExtension, getMetadata } from "../../../util/verifyFileInput"
import checkDuplicateInArray from "../../../util/checkDuplicateInArray"
import { Timestamp } from "firebase/firestore"
import { useAuthContext } from "../../authentication"

const useDocumentStore = () => {
  const { companyData, additionalDocuments, documentsOverMaxPermitted } =
    useDocumentContext()
  const { user } = useAuthContext()
  const [error, setError] = useState("")
  const {
    uploadFile,
    deleteFile,
    error: uploadError,
    isPending: uploadPending,
  } = useFirebaseStorage()
  const {
    isPending,
    error: firestoreError,
    getDocument,
    updateDocument,
    setDocument,
    deleteDocument,
  } = useFirestore()

  //uploads the document to storage and updates firestore as neeeded.
  const uploadDocument = async ({ document, documentInfo, folderId }) => {
    setError("")
    //check if the company has permitted number of documents
    if (documentsOverMaxPermitted)
      return setError(
        "the company account has the maximum permitted files saved, see the your primary account holder to increase the allowance"
      )
    const dateString = format(new Date(), "yyyy-MM-dd")
    const fileExtension = getFileExtension(document)
    const metadata = getMetadata(document)

    //Check if document exists
    const { exists: documentExists, duplicateData: duplicateDocument } =
      checkDuplicateInArray(additionalDocuments, documentInfo.name, "name")
    //if it does, get the document data from firestore
    let documentObject = null
    if (documentExists) {
      documentObject = await getDocument(
        `companies/${companyData.companyId}/additionalDocuments/${documentInfo.name}`
      )
      //not allowed to use the same document in multiple categories
      if (documentObject && `${documentObject.folderId}` !== `${folderId}`)
        return alert(
          "The document name you are using is being used in another folder, THIS IS NOT ALLOWED."
        )

      const cont = window.confirm(
        "This document name is already in user, do you want to revise it? The previous document will be moved to history."
      )
      if (!cont) return
    }
    let fileName = `${documentInfo.name}_Rev0_${dateString}.${fileExtension}`
    if (documentExists)
      fileName = `${documentInfo.name}_Rev${
        documentObject.history.length + 1
      }_${dateString}.${fileExtension}`

    const storagePath = `companies/${companyData.companyId}/additionalDocuments/${folderId}/${documentInfo.name}/${fileName}`

    //place document in storage
    const documentURL = await uploadFile(storagePath, document, metadata)
    if (uploadError) return setError(uploadError)

    //update Firestore documentList and document
    let updateObject = {}
    let historyObject = []
    let newDocument = null
    if (!documentObject) {
      //if there is a matching document name
      updateObject = {
        folderId: `${folderId}`,
        name: documentInfo.name,
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: {
          displayName: user.displayName,
          uid: user.uid,
        },
        currentDocument: {
          documentURL,
          uploadedAt: Timestamp.fromDate(new Date()),
          uploadedBy: {
            displayName: user.displayName,
            uid: user.uid,
          },
          fileName,
        },
        history: [],
      }
      newDocument = await setDocument(
        `companies/${companyData.companyId}/additionalDocuments/${documentInfo.name}`,
        updateObject
      )
    } else {
      //if there is a matching document
      historyObject = [
        { ...documentObject.currentDocument },
        ...documentObject.history,
      ]
      updateObject = {
        currentDocument: {
          documentURL,
          uploadedAt: Timestamp.fromDate(new Date()),
          uploadedBy: {
            displayName: user.displayName,
            uid: user.uid,
          },
          fileName,
        },
        history: historyObject,
      }
      newDocument = await updateDocument(
        `companies/${companyData.companyId}/additionalDocuments/${documentInfo.name}`,
        updateObject
      )
    }
    //console.log("update object => ", updateObject)
  }

  //deletes the current document and moves the latest historical document info to the current info, then deletes that one from the document history. also deleted the current document file from firebase storage
  const deleteCurrentDocument = async ({ documentId }) => {
    const { cont, error: verificationError } = verifyDelete({
      companyId: companyData.companyId,
      user,
      documentId,
    })
    if (verificationError) return setError(verificationError)
    if (!cont) return

    //getFirestore document
    const documentData = await getDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`
    )

    //delete From Storage
    //delete from storage
    deleteFile(documentData.currentDocument.documentURL)

    //if no document history just delete the document
    if (documentData.history.length === 0) {
      //delete the entire firestore
      deleteDocument(
        `companies/${companyData.companyId}/additionalDocuments/${documentId}`
      )
    } else {
      //if there is document history, the first documetnData.history array element will replace documentData.currentDocument:
      //get new history and the first element
      const newCurrentDocument = documentData.history[0]
      const newHistory = documentData.history.slice(1)
      console.log("current hist: ", documentData.history)
      console.log("new history: ", newHistory)
      const updateObject = {
        currentDocument: newCurrentDocument,
        history: newHistory,
      }

      //update firestore
      updateDocument(
        `companies/${companyData.companyId}/additionalDocuments/${documentId}`,
        { ...updateObject }
      )
    }

    //update deletedDocument log
    const deleteLogObject = { lastUpdated: new Date() }
    deleteLogObject[`${documentData.name}_currentDocument_${new Date()}`] = {
      documentName: documentData.name,
      deletedAt: new Date(),
      deletedBy: {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
      },
      message: `deleted the most recent revision of Document ${documentData.name} - ${documentData.currentDocument.fileName}`,
    }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/deletedDocuments`,
      { ...deleteLogObject }
    )
  }

  //deletes a specific document from history data of the document, also deletes that correspoinding file from firebase storage
  const deleteDocumentFromHistory = async ({ documentId, fileURL }) => {
    const { cont, error: verificationError } = verifyDelete({
      companyId: companyData.companyId,
      user,
      deleteHistoryDoc: true,
      documentId,
    })
    if (verificationError) return setError(verificationError)
    if (!cont) return

    //getFirestore document
    const documentData = await getDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`
    )

    //get the document from history that is to be deleted, and new history array
    let docToDelete = null
    const newHistory = documentData.history.filter((historicalDoc) => {
      if (historicalDoc.documentURL === fileURL) {
        docToDelete = historicalDoc
        return false
      }
      return true
    })

    console.log("doc to delete", docToDelete)
    console.log("new history: ", newHistory)

    //delete document From storage
    deleteFile(docToDelete.documentURL)

    //updateFirestore Document
    const newDocumentObject = { history: newHistory }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`,
      { ...newDocumentObject }
    )

    //track the document that was deleted
    const deleteLogObject = { lastUpdated: new Date() }
    deleteLogObject[`${documentData.name}_historical_${new Date()}`] = {
      documentName: documentData.name,
      deletedAt: new Date(),
      deletedBy: {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
      },
      message: `deleted the historical Document ${docToDelete.fileName}`,
    }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/deletedDocuments`,
      { ...deleteLogObject }
    )
  }

  //deletes an entire document, history and all (removes the document from the firestore subcollection). also deletes all associated files from firebase storage.
  const deleteDocumentAndHistory = async ({ documentId }) => {
    const { cont, error: verificationError } = verifyDelete({
      companyId: companyData.companyId,
      user,
      delteAll: true,
      documentId,
    })
    if (verificationError) return setError(verificationError)
    if (!cont) return

    //getFirestore document
    const documentData = await getDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`
    )

    //delete each file in firebase storage assoiated with current doc and history
    deleteFile(documentData.currentDocument.documentURL)
    if (documentData.history.length > 0) {
      documentData.history.forEach((historicalDocument) => {
        deleteFile(historicalDocument.documentURL)
      })
    }

    //delete the firestore document
    deleteDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`
    )

    //add to deletedDocumetns array
    const updateObject = { lastUpdated: new Date() }
    updateObject[`${documentData.name}_${new Date()}`] = {
      documentName: documentData.name,
      deletedAt: new Date(),
      deletedBy: {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
      },
      message: "deleted the document and all of its history",
    }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/deletedDocuments`,
      { ...updateObject }
    )
  }

  return {
    uploadDocument,
    deleteCurrentDocument,
    deleteDocumentFromHistory,
    deleteDocumentAndHistory,
    error,
    isPending: uploadPending || isPending,
  }
}

export { useDocumentStore }

const verifyDelete = ({
  documentId,
  companyId,
  user,
  deleteHistoryDoc = false,
  deleteAll = false,
}) => {
  //make sure the user has rights to do this
  if (!user.admin || user.company !== companyId)
    return {
      cont: false,
      error: "you do not have the rights to delete documents or files",
    }

  let message = `You are DELETING this document's (${documentId}) most recent entry. This file CANNOT be recovered from eLabTracker after this is done. Do you want to continue?`

  if (deleteHistoryDoc)
    message = `You are DELETING a file from this document's (${documentId}) historical revisions. This file CANNOT be recovered from eLabTracker after this is done. Do you want to continue?`
  else if (deleteAll)
    message = `You are DELETING this document (${documentId}) and all of it's associated historical documents and files. These files CANNOT be recovered from eLabTracker after this is done. Do you want to continue?`

  //confirm the user wants to do this
  const cont = window.confirm(message)
  if (!cont) return { cont: false, error: null }
  else return { cont: true, error: null }
}
