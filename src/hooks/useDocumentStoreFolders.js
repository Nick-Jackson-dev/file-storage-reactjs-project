//hooks
import { useState } from "react"
import { useStorage } from "../../../hooks/useStorage"
import { useFirestore } from "../../../hooks/useFirestore"
import { useCompanyContext } from "../../company"
import { useAuthContext } from "../../authentication"
//utilities
import { getBreadCrumbs, getAllChildFolderIds } from ".."

const useDocumentStoreFolders = () => {
  const { companyData, documentFolders } = useCompanyContext()
  const { user } = useAuthContext()
  const [error, setError] = useState("")
  const {
    uploadFile,
    error: uploadError,
    isPending: uploadPending,
  } = useStorage()
  const {
    isPending,
    error: firestoreError,
    getDocument,
    updateDocument,
    setDocument,
  } = useFirestore()

  const addFolder = async ({ folderName, isInternal, parentFolderId }) => {
    setError("")
    //make sure no folders with the same parentFolderId as this one matches in name
    let match = false
    documentFolders.forEach((folder) => {
      if (
        `${parentFolderId}` === `${folder.parentFolderId}` &&
        folder.name.toLowerCase() === folderName.toLowerCase()
      )
        match = true
    })

    if (match)
      return setError(
        "No two subfolders can have the same name within the same parent folder."
      )

    //updateFirestore
    const updateObject = {
      folders: [
        ...documentFolders,
        {
          isInternal: Boolean(isInternal),
          parentFolderId: `${parentFolderId}`,
          name: folderName,
          id: Math.round(Math.random() * 100000000000),
        },
      ],
    }

    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/documentClassification`,
      updateObject
    )
  }

  const changeFolderName = async ({ folderId, newName }) => {
    setError("")
    const newFolders = documentFolders.map((folder) => {
      if (`${folder.id}` === `${folderId}`) {
        return { ...folder, name: newName }
      }
      return folder
    })

    const updateObject = { folders: newFolders }

    //update firestore
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/documentClassification`,
      { ...updateObject }
    )
  }

  const makeFolderInternal = async (folderId, force = false) => {
    setError("")
    //get all subfolderIds
    const subfolderIds = getAllChildFolderIds({
      allFolders: documentFolders,
      folderId,
    })

    //if there are subfolders, display warning that all will be made internal
    if (!force && subfolderIds.length !== 0) {
      const carryOn = window.confirm(
        "The folder you are changing to internal only has subfolders that will also be changed to internal, do you want to continue?"
      )
      if (!carryOn) return
    }
    subfolderIds.push(folderId) //add the subject folder to the list that will be altered
    console.log(subfolderIds)

    //map through folders making them internal
    const newFolders = documentFolders.map((folder) => {
      if (
        subfolderIds.some((subfolderId) => `${subfolderId}` === `${folder.id}`)
      ) {
        return { ...folder, isInternal: true }
      }
      return folder
    })
    const updateObject = { folders: newFolders }

    //update firestore
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/documentClassification`,
      { ...updateObject }
    )
    return
  }

  const makeFolderPublic = async (folderId) => {
    setError("")
    //make sure no breadcrumb folders are internal, if so display error
    const breadCrumbs = getBreadCrumbs({
      allFolders: documentFolders,
      endFolderId: folderId,
    })

    if (
      breadCrumbs.some(
        (breadCrumb) =>
          breadCrumb.isInternal && `${breadCrumb.id}` !== `${folderId}`
      )
    ) {
      console.log(error)
      return setError(
        "You cannot make this folder public because a parent folder is set to internal."
      )
    }

    //map through folders make this one internal
    const newFolders = documentFolders.map((folder) => {
      if (`${folder.id}` === `${folderId}`)
        return { ...folder, isInternal: false }
      return folder
    })

    //update firestore
    const updateObject = { folders: newFolders }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/documentClassification`,
      { ...updateObject }
    )
  }

  const moveFileToFolder = async ({ destinationFolderId, documentId }) => {
    setError("")
    console.log("start move")
    //update Firestore document
    const updateObject = { folderId: destinationFolderId }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/${documentId}`,
      { ...updateObject }
    )

    if (firestoreError) return setError(firestoreError)
  }

  const changeParentFolder = async ({ subfolderId, destinationFolderId }) => {
    setError("")
    const folderToMove = documentFolders.find(
      (f) => `${f.id}` === `${subfolderId}`
    )
    const destinationFolder = documentFolders.find(
      (f) => `${f.id}` === `${destinationFolderId}`
    )

    let newFolders = documentFolders.map((folder) => {
      if (`${folder.id}` === `${subfolderId}`)
        return { ...folder, parentFolderId: destinationFolderId }
      return folder
    })

    if (
      destinationFolderId !== "root" &&
      destinationFolder.isInternal &&
      !folderToMove.isInternal
    ) {
      const cont = window.confirm(
        `You are moving ${folderToMove.name} to an internal folder. This means ${folderToMove.name} and any of its subfolders will also become internal if they are not already. Do you want to continue?`
      )
      if (!cont) return

      const subfolderIds = getAllChildFolderIds({
        allFolders: documentFolders,
        folderId: subfolderId,
      })
      subfolderIds.push(subfolderId) //add the subject folder to the list that will be altered
      //map through new folders making them internal
      newFolders = newFolders.map((folder) => {
        if (
          subfolderIds.some(
            (subfolderId) => `${subfolderId}` === `${folder.id}`
          )
        ) {
          return { ...folder, isInternal: true }
        }
        return folder
      })
    }

    //update firestore
    const updateObject = { folders: newFolders }
    await updateDocument(
      `companies/${companyData.companyId}/additionalDocuments/documentClassification`,
      { ...updateObject }
    )
  }

  return {
    addFolder,
    changeFolderName,
    makeFolderInternal,
    makeFolderPublic,
    moveFileToFolder,
    changeParentFolder,
    error,
    isPending: uploadPending || isPending,
  }
}

export { useDocumentStoreFolders }
