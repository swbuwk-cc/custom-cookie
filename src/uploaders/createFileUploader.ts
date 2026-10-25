import { clearStoredImage, loadImage } from "../handlers/common"
import { appName, imageStorageKey } from "../config"
import { updateBigCookie } from "../handlers/updateBigCookie"
import { settings } from "../settings"

export const createFileUploader = () => {
  const fileUrl = localStorage.getItem(imageStorageKey)

  const fileUploaderWrapper = document.createElement("div")
  fileUploaderWrapper.style.cssText = "position:relative;width:150px;"

  const fileUploader = document.createElement("a")
  fileUploader.classList.add("smallFancyButton", "option")
  fileUploader.style.cssText = "position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:150px;height:150px;margin:0;padding:0;text-align:center;overflow:hidden;"
  fileUploader.id = `${appName}FileUploader`

  const fileUploadTitle = document.createElement("div")
  fileUploadTitle.id = `${appName}FileUploadTitle`
  fileUploadTitle.style.position = "absolute"
  fileUploadTitle.style.display = fileUrl ? "none" : "block" 
  fileUploadTitle.textContent = "Upload a file"

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
  fileInput.accept = "image/*"
  fileInput.setAttribute("aria-label", "Upload an image file")
  fileInput.style.width = "100%"
  fileInput.style.height = "100%"
  fileInput.style.opacity = "0"
  fileInput.style.position = "absolute"
  fileInput.style.cursor = "pointer"
  fileInput.style.zIndex = "10"
  fileInput.id = `${appName}FileInput`

  fileInput.onchange = (e: Event) => {
    const target: HTMLInputElement = e.target as HTMLInputElement
    const file = target?.files?.[0]
    if (!file) return
    void loadImage(file)
    target.value = ""
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

  return fileUploaderWrapper
}