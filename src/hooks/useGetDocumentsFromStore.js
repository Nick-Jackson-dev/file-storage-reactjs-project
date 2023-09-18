//note, this is now done in company context
//hooks
import { useCollection } from "./useCollection"

const useGetDocumentsFromStore = ({}) => {
  //get array of objects representing the documents in the folder
  const { documents: companyAdditionalDocuments } =
    useCollection(`additionalDocuments`)

  return companyAdditionalDocuments
}

export { useGetDocumentsFromStore }
