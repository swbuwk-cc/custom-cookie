import { handleSetImage } from "../handlers/common"
import { appName, imageStorageKey } from "../config"
import { updateBigCookie } from "../handlers/updateBigCookie"
import { settings } from "../settings"

let uploadRevision = 0

const refreshFilePreview = () => {
  const url = localStorage.getItem(imageStorageKey) || ""
  const preview = l("fileUploadPreview") as HTMLImageElement | null
  const resetButton = l(`${appName}FileResetButton`)
  const title = l(`${appName}FileUploadTitle`)
  if (preview) {
    preview.src = url
    preview.style.display = url ? "block" : "none"
  }
  if (resetButton) resetButton.style.display = url ? "block" : "none"
  if (title) title.style.display = url ? "none" : "block"
}

export const clearStoredImage = () => {
  ++uploadRevision
  localStorage.setItem(imageStorageKey, "")
  refreshFilePreview()
}

export const createFileUploader = () => {
  const fileUrl = localStorage.getItem(imageStorageKey)

  const fileUploaderWrapper = document.createElement("div")
  fileUploaderWrapper.style.position = "relative"
  fileUploaderWrapper.style.display = "flex"
  fileUploaderWrapper.style.width = "185px"
  fileUploaderWrapper.style.flexDirection = "column"

  const fileUploader = document.createElement("a")
  fileUploader.classList.add("smallFancyButton", "option")
  fileUploader.style.height = "138px"
  fileUploader.style.position = "relative"
  fileUploader.style.display = "flex"
  fileUploader.style.alignItems = "center"
  fileUploader.style.justifyContent = "center"
  fileUploader.id = `${appName}FileUploader`

  const fileUploadTitle = document.createElement("div")
  fileUploadTitle.id = `${appName}FileUploadTitle`
  fileUploadTitle.style.position = "absolute"
  fileUploadTitle.style.display = fileUrl ? "none" : "block" 
  fileUploadTitle.innerHTML = "Choose file"

  const fileUploadPreview = document.createElement("img")
  fileUploadPreview.id = "fileUploadPreview"
  fileUploadPreview.style.width = "100%"
  fileUploadPreview.style.height = "100%"
  fileUploadPreview.style.position = "absolute"
  fileUploadPreview.style.zIndex = "8"
  fileUploadPreview.style.display = fileUrl ? "block" : "none"
  fileUploadPreview.style.objectFit = settings.imageFit 
  fileUploadPreview.src = fileUrl || ""
  fileUploadPreview.style.transform = `scale(${settings.zoom})`
  fileUploadPreview.style.transformOrigin = "center"

  const previewViewport = document.createElement("div")
  previewViewport.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:8;"
  previewViewport.appendChild(fileUploadPreview)

  const circleCover = document.createElement("div")
  circleCover.id = "fileUploadCircleCover" 
  circleCover.style.position = "absolute"
  circleCover.style.top = "0"
  circleCover.style.left = "0"
  circleCover.style.width = "100%"
  circleCover.style.height = "100%"
  circleCover.style.zIndex = "9"
  circleCover.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
  circleCover.style.mixBlendMode = "hard-light"
  circleCover.style.display = settings.roundImage ? "block" : "none"

  const circleHole = document.createElement("div")
  circleHole.style.position = "absolute"
  circleHole.style.top = "0"
  circleHole.style.left = "0"
  circleHole.style.width = "100%"
  circleHole.style.height = "100%"
  circleHole.style.zIndex = "10"
  circleHole.style.backgroundColor = "gray"
  circleHole.style.borderRadius = "50%"

  const fileResetButton = document.createElement("div")
  fileResetButton.id = `${appName}FileResetButton`
  fileResetButton.style.position = "absolute"
  fileResetButton.style.top = "10px"
  fileResetButton.style.right = "10px"
  fileResetButton.style.zIndex = "11"
  fileResetButton.style.cursor = "pointer"
  fileResetButton.style.display = fileUrl ? "block" : "none"
  fileResetButton.innerHTML = "Clear"

  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.style.width = "100%"
  fileInput.style.height = "100%"
  fileInput.style.opacity = "0"
  fileInput.style.position = "absolute"
  fileInput.style.cursor = "pointer"
  fileInput.style.zIndex = "10"
  fileInput.id = `${appName}FileInput`

  const fileUploaderDescription = document.createElement("label")
  fileUploaderDescription.style.padding = "2px 0"
  fileUploaderDescription.innerHTML = `(file update can take up to 5 seconds)`

  fileInput.onchange = (e: Event) => {
    const target: HTMLInputElement = e.target as HTMLInputElement
    const file = target?.files?.[0]
    if (!file) return
    const revision = ++uploadRevision
    const reader = new FileReader()

    reader.onload = () => {
      if (revision !== uploadRevision || typeof reader.result !== "string") return
      handleSetImage(reader.result, true)
      // The game may have rebuilt the menu while FileReader was running.
      refreshFilePreview()
      target.value = ""
    }
    reader.readAsDataURL(file)
  }

  fileResetButton.onclick = () => {
    clearStoredImage()

    updateBigCookie()
    PlaySound('snd/tick.mp3');
    Game.Notify("Image removed!", "Here we go again", [10, 0])
  }

  circleCover.appendChild(circleHole)

  fileUploader.appendChild(fileInput)
  fileUploader.appendChild(previewViewport)
  fileUploader.appendChild(fileResetButton)
  fileUploader.appendChild(fileUploadTitle)
  fileUploader.appendChild(circleCover)

  fileUploaderWrapper.appendChild(fileUploader)
  fileUploaderWrapper.appendChild(fileUploaderDescription)

  return fileUploaderWrapper
}