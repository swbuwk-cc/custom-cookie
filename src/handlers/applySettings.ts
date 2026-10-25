import { handleUploadesrToggle } from "./common"
import { appName } from "../config"
import { updateBigCookie } from "./updateBigCookie"

export const applySettings = () => {
  updateBigCookie()

  const fileUploader = l(`${appName}FileUploader`)
  const linkUploader = l(`${appName}LinkUploader`)

  if (!fileUploader || !linkUploader) return

  handleUploadesrToggle(fileUploader, linkUploader)
}