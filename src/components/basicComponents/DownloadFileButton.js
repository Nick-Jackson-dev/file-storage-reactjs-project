//component that downloiads a file from Firebase Storage bin
import { Button } from "react-bootstrap"
import { useFirebaseStorage } from "../../hooks/useFirebaseStorage"
import downloadFileIcon from "../../assets/download-file-icon.svg"

export default function DownloadFileButton({
  docURL,
  fileName,
  setDownloadError,
  buttonText,
  disabled,
  icon,
  className = "",
}) {
  const { downloadPDF, error, isPending } = useFirebaseStorage()
  //set defaults
  buttonText = buttonText ? buttonText : "download file"
  disabled = disabled ? disabled : false

  if (icon) {
    return (
      <img
        src={downloadFileIcon}
        className={`${className} icon`}
        alt="download file"
        title="download this file"
        onClick={async () => {
          if (disabled || isPending) return
          await downloadPDF(docURL, `${fileName}.pdf`)
          if (error) setDownloadError(error)
        }}
      />
    )
  }

  return (
    <Button
      variant="primary"
      disabled={disabled || isPending}
      type="button"
      onClick={async () => {
        await downloadPDF(docURL, `${fileName}.pdf`)
        if (error) setDownloadError(error)
      }}
    >
      {buttonText}
    </Button>
  )
}
