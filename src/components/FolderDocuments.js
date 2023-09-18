import React, { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useSortData } from "../hooks/useSortList"
import { format } from "date-fns"
import { useDocumentStore, AddDocumentForm } from "../index"

//components
import { Table, Button } from "react-bootstrap"
import TableHeaderSortable from "../components/TableHeaderSortable"
import CollapseIcon from "../components/basicComponents/CollapseIcon"
import DownloadFileButton from "../components/basicComponents/DownloadFileButton"

export default function FolderDocuments({ documents, user }) {
  const { folderId } = useParams()
  const { uploadDocument, error, isPending } = useDocumentStore()

  //form control
  const [addingDoc, setAddingDoc] = useState(false)
  const [newDocName, setNewDocName] = useState("")

  //table control
  const [expandedData, setExpandedData] = useState("")
  const [searchBy, setSearchBy] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortAsc, setSortAsc] = useState(true)

  //custom hooks defined below
  const filteredData = useGetFilteredData(documents, searchBy)

  const displayedData = useSortData(filteredData, sortBy, sortAsc)

  const changeSortBy = (newSort) => {
    if (sortBy === newSort) {
      setSortAsc((prev) => !prev)
    } else setSortAsc(true)
    setSortBy(newSort)
  }

  const tableHeaderArray = [
    { sortable: true, title: "Name", changeSortByTo: "name" },
    {
      sortable: true,
      title: "Upload Date",
      changeSortByTo: "currentDocument.uploadedAt",
    },
    { sortable: false, title: "UploadedBy", changeSortByTo: "" },
    { sortable: false, title: "Document", changeSortByTo: "" },
    { sortable: false, title: "Revise", changeSortByTo: "" },
  ]
  return (
    <>
      <div className="d-flex mb-3 flex-wrap">
        <Button
          variant="primary"
          disabled={addingDoc || isPending}
          onClick={() => setAddingDoc(true)}
        >
          Add Document
        </Button>
        <input
          style={{ width: "250px", margin: "0" }}
          className="ms-auto me-5"
          type="search"
          onChange={(e) => setSearchBy(e.target.value)}
          value={searchBy}
          placeholder="search documents"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {addingDoc && (
        <AddDocumentForm
          user={user}
          documents={documents}
          folderId={folderId}
          setAddingDoc={setAddingDoc}
          newDocName={newDocName}
          setNewDocName={setNewDocName}
          handleUpload={uploadDocument}
        />
      )}
      {displayedData.length === 0 && (
        <p className="error">No documents to display</p>
      )}
      {displayedData.length > 0 && (
        <div className="data-list-container">
          <Table striped hover bordered className="data-list-table" size="md">
            <TableHeaderSortable
              thArray={tableHeaderArray}
              sortBy={sortBy}
              sortAsc={sortAsc}
              changeSortBy={changeSortBy}
            />
            <tbody className="text-center">
              {displayedData.map((doc) => (
                <React.Fragment key={doc.name}>
                  <tr>
                    <td className="d-flex">
                      {doc.name}
                      {doc.history.length > 0 && expandedData !== doc.name && (
                        <h4
                          className="ms-2"
                          onClick={() => setExpandedData(doc.name)}
                        >
                          <CollapseIcon
                            collapsed={expandedData !== doc.name}
                            onClick={() => setExpandedData(doc.name)}
                          />
                        </h4>
                      )}
                      {doc.history.length > 0 && expandedData === doc.name && (
                        <h4
                          className="ms-2"
                          onClick={() => setExpandedData("")}
                        >
                          <CollapseIcon
                            collapsed={expandedData !== doc.name}
                            onClick={() => setExpandedData("")}
                          />
                        </h4>
                      )}
                    </td>
                    <td>
                      {format(
                        doc.currentDocument.uploadedAt.toDate(),
                        "yyyy-MM-dd"
                      )}
                    </td>
                    <td>{doc.currentDocument.uploadedBy.displayName}</td>
                    <td>
                      <DownloadFileButton
                        docURL={doc.currentDocument.documentURL}
                        fileName={`${doc.name}_${format(
                          doc.currentDocument.uploadedAt.toDate(),
                          "yyyy-MM-dd"
                        )}.pdf`}
                        buttonText="Download"
                      />
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setAddingDoc(true)
                          setNewDocName(doc.name)
                        }}
                      >
                        Revise
                      </Button>
                    </td>
                  </tr>

                  {/* expandable evaluation history*/}
                  {expandedData === doc.name &&
                    doc.history.map((h, i) => (
                      <tr
                        className="fs-7 text-muted expanded-row"
                        key={i.toString()}
                      >
                        <td></td>
                        <td>{format(h.uploadedAt.toDate(), "yyyy-MM-dd")}</td>
                        <td>{h.uploadedBy.displayName}</td>
                        <td>
                          <DownloadFileButton
                            docURL={h.documentURL}
                            fileName={`${doc.name}_${format(
                              h.uploadedAt.toDate(),
                              "yyyy-MM-dd"
                            )}.pdf`}
                            buttonText="Download"
                          />
                        </td>
                        <td></td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  )
}

const useGetFilteredData = (documents, searchBy) => {
  const [filteredData, setFilteredData] = useState([])

  useMemo(() => {
    //create arrray of documents
    let newList = documents.filter((doc) =>
      doc.name.trim().toLowerCase().includes(searchBy.trim().toLowerCase())
    )

    setFilteredData(newList)
  }, [documents, searchBy])

  return filteredData
}
