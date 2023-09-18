import React, { useState } from "react"
import { verifyPDF } from "../util/verifyFileInput"
import { Button } from "react-bootstrap"

//notes: place in a component that needs to add an accreditation document
//the parent component may want to control whether the form renders which is the intent of setAddindDoc prop
//newDocName and setNewDocName are not local because they may be auto-filled by parent in the event of a revision to a document.
export default function AddDocumentForm({
  folderId,
  setAddingDoc,
  newDocName,
  setNewDocName,
  handleUpload,
}) {
  const [formError, setFormError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [newDocument, setNewDocument] = useState("")

  //file change
  const handleFileChange = (e) => {
    setNewDocument(null)
    setFormError("")
    const { pdf: selected, error: fileError } = verifyPDF(e.target.files[0])

    if (fileError) return setFormError(fileError)
    setNewDocument(selected)
  }

  const startUpload = async (e) => {
    e.preventDefault()

    //see if required fields are filled
    if (!newDocument)
      return setFormError("you need to select a pdf file to upload")
    if (!newDocName) return setFormError("a document name is required")

    setIsPending(true)

    //call handlupload to store document in right place and update the firestore
    await handleUpload({
      document: newDocument,
      documentInfo: {
        name: newDocName,
        // reviewFrequency: 12, //TODO: This should be state/ref value
        // assignedUser: null, //TODO: have a Select in the form to get this
      },
      folderId,
    })
    setIsPending(false)
    setNewDocName("")
    setNewDocument("")
    setAddingDoc(false)
  }

  return (
    <>
      <form onSubmit={(e) => startUpload(e)} className="mt-2">
        <label className="d-flex">
          <span>document name*: </span>
          <input
            style={{ width: 300 + "px" }}
            type="text"
            required
            className="form-control ms-3"
            onKeyDown={(e) => {
              if (e.key === "/")
                setFormError("all '/' characters will be replaced with '-'.")
            }}
            onChange={(e) => setNewDocName(e.target.value.replace("/", "-"))}
            value={newDocName}
          />
        </label>
        <div className="d-flex">
          <input
            type="file"
            onChange={(e) => handleFileChange(e)}
            className="form-control mb-2"
          />
          <Button
            variant="primary"
            className="ms-4"
            type="submit"
            disabled={isPending}
          >
            Submit
          </Button>
          <p
            className="ms-3 text-muted text-decoration-underline clickable"
            onClick={() => {
              setNewDocument("")
              setNewDocName("")
              setAddingDoc(false)
              setFormError("")
            }}
          >
            cancel
          </p>
        </div>
      </form>
      {formError && <p className="error">{formError}</p>}
    </>
  )
}
