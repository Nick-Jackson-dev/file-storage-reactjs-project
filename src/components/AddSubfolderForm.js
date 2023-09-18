import React, { useState } from "react"
import { Button } from "react-bootstrap"

//notes: place in a component that needs to add an accreditation document
//the parent component may want to control whether the form renders which is the intent of setAddindSubfolder prop
export default function AddSubfolderForm({
  parentFolder,
  setAddingSubfolder,
  handleAdd,
}) {
  const [formError, setFormError] = useState("")
  const [isPending, setIsPending] = useState(false)

  const [newSubfolderName, setNewSubfolderName] = useState()
  //   const [isInternal, setIsInternal] = useState(false || parentFolder.isInternal)

  const handleSubmit = async (e) => {
    e.preventDefault()

    //see if required fields are filled
    if (!newSubfolderName) return setFormError("a subfolder name is required")

    setIsPending(true)

    //call handlupload to store document in right place and update the firestore
    await handleAdd({
      parentFolderId: parentFolder.id,
      folderName: newSubfolderName,
      //   isInternal,
    })

    setIsPending(false)
    setAddingSubfolder(false)
  }

  return (
    <>
      <form
        onSubmit={(e) => handleSubmit(e)}
        id="addSubfolderForm"
        className="d-flex flex-wrap align-items-baseline"
      >
        <label className="d-flex align-items-baseline">
          <span className="text-nowrap me-3">Folder name:</span>
          <input
            required
            type="text"
            onKeyDown={(e) => {
              if (e.key === "/")
                setFormError("all '/' characters will be replaced with '-'.")
            }}
            onChange={(e) =>
              setNewSubfolderName(e.target.value.replace("/", "-"))
            }
            value={newSubfolderName}
          />
        </label>
        {/* <label className="d-flex align-items-baseline">
          <span className="text-nowrap me-3">Internal Folder?</span>
          <input
            type="checkbox"
            onChange={(e) => setIsInternal(e.target.checked)}
            checked={isInternal}
            disabled={parentFolder.isInternal}
          />
        </label> */}
        <Button
          variant="primary"
          type="submit"
          className="me-3"
          form="addSubfolderForm"
          disabled={isPending || formError}
        >
          Add
        </Button>
        <p
          className="text-muted clickable text-decoration-underline"
          onClick={() => setAddingSubfolder(false)}
        >
          cancel
        </p>
      </form>
      {formError && <p className="error">{formError}</p>}
    </>
  )
}
