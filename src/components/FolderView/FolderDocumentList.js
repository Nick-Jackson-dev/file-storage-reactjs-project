import React, { useState } from "react"
import { useSortData } from "../../hooks/useSortList"

import { Table, Button } from "react-bootstrap"
import TableHeaderSortable from "../TableHeaderSortable"
import CollapseIcon from "../basicComponents/CollapseIcon"
import DownloadFileButton from "../basicComponents/DownloadFileButton"
import { format } from "date-fns"
import editIcon from "../../assets/edit-icon.svg"
import trashIcon from "../../assets/trashcan-icon.svg"
import deleteAllIcon from "../../assets/trashcan-delete-all-icon.svg"
import moveFileIcon from "../../assets/move-file-icon.svg"

export default function FolderDocumentList({
  documents,
  callRevise,
  callStartMove,
  callDeleteCurrent,
  callDeleteAll,
  callDeleteHistoricalDocument,
}) {
  const [expandedDocumentHistory, setExpandedDocumentHistory] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortAsc, setSortAsc] = useState(true)

  const displayedDocuments = useSortData(documents, sortBy, sortAsc)

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
    // { sortable: false, title: "UploadedBy", changeSortByTo: "" },
    { sortable: false, title: "File Actions", changeSortByTo: "" },
  ]

  if (displayedDocuments.length === 0) {
    return <p className="error">No files to display</p>
  }

  return (
    <div className="data-list-container">
      <h2>Files</h2>
      <Table striped hover bordered className="data-list-table" size="md">
        <TableHeaderSortable
          thArray={tableHeaderArray}
          sortBy={sortBy}
          sortAsc={sortAsc}
          changeSortBy={changeSortBy}
        />
        <tbody className="text-center">
          {displayedDocuments.map((doc) => (
            <React.Fragment key={doc.name}>
              <tr>
                <td className="d-flex">
                  {doc.name}
                  {doc.history.length > 0 &&
                    expandedDocumentHistory !== doc.name && (
                      <h4
                        className="ms-2"
                        onClick={() => setExpandedDocumentHistory(doc.name)}
                      >
                        <CollapseIcon
                          collapsed={expandedDocumentHistory !== doc.name}
                          onClick={() => setExpandedDocumentHistory(doc.name)}
                        />
                      </h4>
                    )}
                  {doc.history.length > 0 &&
                    expandedDocumentHistory === doc.name && (
                      <h4
                        className="ms-2"
                        onClick={() => setExpandedDocumentHistory("")}
                      >
                        <CollapseIcon
                          collapsed={expandedDocumentHistory !== doc.name}
                          onClick={() => setExpandedDocumentHistory("")}
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
                {/* <td>{doc.currentDocument.uploadedBy.displayName}</td> */}
                <td className="align-left">
                  <DownloadFileButton
                    className="ms-2 me-2"
                    docURL={doc.currentDocument.documentURL}
                    fileName={doc.currentDocument.fileName}
                    buttonText=""
                    icon={true}
                  />
                  <>
                    <img
                      src={editIcon}
                      alt="edit document"
                      title="edit this document"
                      className="icon ms-2 me-2"
                      onClick={() => callRevise(doc.name)}
                    />
                    <img
                      src={moveFileIcon}
                      alt="move document"
                      title="move this document to a different folder"
                      className="icon ms-2 me-2"
                      onClick={() => callStartMove(doc)}
                    />
                    <img
                      src={trashIcon}
                      alt="delete document"
                      title="delete this document - cannot recover"
                      className="icon ms-2 me-2"
                      onClick={() =>
                        callDeleteCurrent({ documentId: doc.name })
                      }
                    />
                    {doc.history.length > 0 && (
                      <img
                        src={deleteAllIcon}
                        alt="delete All documents"
                        title="delete this document and its history - cannot recover"
                        className="icon ms-2 me-2"
                        onClick={() => callDeleteAll({ documentId: doc.name })}
                      />
                    )}
                  </>
                </td>
              </tr>

              {/* expandable evaluation history*/}
              {expandedDocumentHistory === doc.name &&
                doc.history.map((h, i) => (
                  <tr
                    className="fs-7 text-muted expanded-row"
                    key={i.toString()}
                  >
                    <td></td>
                    <td>{format(h.uploadedAt.toDate(), "yyyy-MM-dd")}</td>
                    {/* <td>{h.uploadedBy.displayName}</td> */}
                    <td>
                      <DownloadFileButton
                        className="ms-2 me-2"
                        docURL={h.documentURL}
                        fileName={h.fileName}
                        buttonText=""
                        icon={true}
                      />
                      <img
                        src={trashIcon}
                        alt="delete document"
                        title="delete this document from history - cannot recover"
                        className="icon ms-2 me-2"
                        onClick={() =>
                          callDeleteHistoricalDocument({
                            documentId: doc.name,
                            fileURL: h.documentURL,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
