//note, this is now done in company context
//hooks
import { useCollection } from "../../../hooks/useCollection"

const useGetDocumentsFromStore = ({ companyId }) => {
  //get array of objects representing the documents in the folder
  const { documents: companyAdditionalDocuments } = useCollection(
    `companies/${companyId}/additionalDocuments`
  )

  return companyAdditionalDocuments
}

export { useGetDocumentsFromStore }
