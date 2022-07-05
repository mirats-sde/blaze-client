import { getDownloadURL, listAll, ref } from "firebase/storage"
import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { storage } from "../../firebase"

const DocumentsContext = createContext()

export const useDocumentContext = () => {
	return useContext(DocumentsContext)
}

const DocumentsContextProvider = ({ children }) => {
	const { surveyID } = useParams()

	const [uploadedDocuments, setUploadedDocuments] = useState([])
	const [documentLoading, setDocumentLoading] = useState(true)
	useEffect(() => {
		setDocumentLoading(true)
		const folderRef = ref(
			storage,
			`Survey-attachement-documents/${surveyID}`
		)

		listAll(folderRef)
			.then(res => {
				if (!res.items.length) setDocumentLoading(false)
				res.items.forEach(itemRef => {
					// All the items under listRef.
					getDownloadURL(itemRef)
						.then(res => {
							setUploadedDocuments(prevArr => [
								...prevArr,
								{ file_name: itemRef.name, file_url: res },
							])
							setDocumentLoading(false)
						})
						.catch(err => {
							console.log(err)
							setDocumentLoading(false)
						})
				})
			})
			.catch(error => {
				console.log(error)
			})
	}, [surveyID])
	const value = { uploadedDocuments, documentLoading }
	return (
		<DocumentsContext.Provider value={value}>
			{children}
		</DocumentsContext.Provider>
	)
}

export default DocumentsContextProvider
