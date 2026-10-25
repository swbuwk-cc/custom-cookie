import { settings } from "../settings"
import { handleSetImage } from "../handlers/common"
import { appName } from "../config"
import { updateBigCookie } from "../handlers/updateBigCookie"

export const createLinkUploader = () => {
  const linkUploader = document.createElement("div")
  linkUploader.id = `${appName}LinkUploader`
  linkUploader.style.display = "flex"
  linkUploader.style.alignItems = "center"  
  
  const linkInput = document.createElement("input")
  linkInput.type = "text"
  linkInput.id = `${appName}LinkInput`
  linkInput.style.userSelect = "all"
  linkInput.style.width = "300px"
  linkInput.placeholder = "https://example.com"
  linkInput.value = settings.url

  const applyButton = document.createElement("a")
  applyButton.id = `${appName}ApplyButton`
  applyButton.classList.add("smallFancyButton", "option")
  applyButton.style.width = "30px"
  applyButton.innerHTML = "Apply"

  const clearButton = document.createElement("a")
  clearButton.id = `${appName}ClearButton`
  clearButton.classList.add("smallFancyButton", "option")
  clearButton.style.width = "30px"
  clearButton.innerHTML = "Clear"

  const clearBigCookie = () => {
    settings.url = ""
    linkInput.value = ""
    PlaySound('snd/tick.mp3');
    if (settings.isDefaultImage) return
    updateBigCookie()
    Game.Notify("Image removed!", "Here we go again", [10, 0])
  }

  applyButton.onclick = () => {
    if (!linkInput.value) {
      clearBigCookie()
      return
    }
    handleSetImage(linkInput.value, false)
  }

  clearButton.onclick = clearBigCookie

  linkUploader.appendChild(linkInput)
  linkUploader.appendChild(applyButton)
  linkUploader.appendChild(clearButton)

  return linkUploader
}