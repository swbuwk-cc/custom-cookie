import { appName, displayName } from "../config"
import { updateBigCookie } from "./updateBigCookie"
import { imageFitDescriptions, imageFitVariants, settings } from "../settings"
import { createFileUploader } from "../uploaders/createFileUploader"
import { createLinkUploader } from "../uploaders/createLinkUploader"
import { clearStoredImage, isImageLoading } from "./common"
import { createSettingsOptions } from "../utils/createSettingsOptions"
import { createZoomSlider } from "../utils/createZoomSlider"

export const addSettings = () => {
  if (!l("menu")?.childNodes?.length) return
  if (Game.onMenu !== 'prefs') return

  // Settings section
  const settingsEl = document.createElement("div")
  settingsEl.id = `${appName}ModSettings`
  settingsEl.className = "subsection"

  const settingsTitle = document.createElement("div")
  settingsTitle.className = "title"
  const titleContent = document.createElement("span")
  titleContent.style.cssText = "display:inline-flex;align-items:center;gap:12px;"
  const titleLabel = document.createElement("span")
  titleLabel.textContent = `${displayName} Settings`
  titleContent.appendChild(titleLabel)

  const collapseButton = document.createElement("a")
  collapseButton.className = "smallFancyButton"
  collapseButton.href = "#"
  collapseButton.style.cssText = "flex-shrink:0;white-space:nowrap;"
  titleContent.appendChild(collapseButton)
  settingsTitle.appendChild(titleContent)

  const settingsListing = document.createElement("div")
  settingsListing.className = "listing"
  settingsListing.id = `${appName}SettingsListing`
  collapseButton.setAttribute("aria-controls", settingsListing.id)
  const updateCollapsedState = () => {
    settingsListing.hidden = settings.collapseSettings
    collapseButton.textContent = settings.collapseSettings ? "Expand" : "Collapse"
    collapseButton.setAttribute("aria-expanded", String(!settings.collapseSettings))
  }
  collapseButton.onclick = (event) => {
    event.preventDefault()
    settings.collapseSettings = !settings.collapseSettings
    updateCollapsedState()
  }
  updateCollapsedState()
  // Settings section end

  const uploaders = document.createElement("div")
  uploaders.style.cssText = "display:flex;flex-direction:column;align-items:flex-start;gap:8px;max-width:360px;margin:8px 0 6px;"
  const separator = document.createElement("label")
  separator.textContent = "or"
  uploaders.appendChild(createLinkUploader())
  uploaders.appendChild(separator)
  uploaders.appendChild(createFileUploader())
  settingsListing.appendChild(uploaders)

  const imageStatus = document.createElement("label")
  imageStatus.id = `${appName}ImageStatus`
  imageStatus.style.cssText = "display:block;width:fit-content;margin:0 0 12px;"
  imageStatus.textContent = isImageLoading()
    ? "Loading image…"
    : "Images are stored in this browser, not in the game save."
  settingsListing.appendChild(imageStatus)

  // Rounding button
  const roundingSettingOption = createSettingsOptions("roundImage", "Round image", () => {
    const fileUploadCircleCover = l("fileUploadCircleCover")
    if (fileUploadCircleCover) {
      fileUploadCircleCover.style.display = settings.roundImage ? "block" : "none"
    }
  })

  settingsListing.appendChild(roundingSettingOption)
  settingsListing.appendChild(document.createElement("br"))
  // Rounding button end

  // Image fit button 
  const imageFitOption = document.createElement("a")
  imageFitOption.id = `imageFitSettingOption`
  imageFitOption.classList.add("smallFancyButton", "option")
  imageFitOption.innerHTML = `Image fit: ${settings.imageFit.toUpperCase()}`

  imageFitOption.onclick = () => {
    const optionIndex = imageFitVariants.indexOf(settings.imageFit)
    settings.imageFit = imageFitVariants[(optionIndex + 1) % imageFitVariants.length]
    updateBigCookie()
    imageFitOption.innerHTML = `Image fit: ${settings.imageFit.toUpperCase()}`
    imageFitDescription.innerHTML = imageFitDescriptions[imageFitVariants.indexOf(settings.imageFit)]
    const fileUploadPreview = l("fileUploadPreview")
    if (fileUploadPreview) {
      fileUploadPreview.style.objectFit = settings.imageFit
    }
    PlaySound('snd/tick.mp3');
  }

  const imageFitDescription = document.createElement("label")
  imageFitDescription.innerHTML = imageFitDescriptions[imageFitVariants.indexOf(settings.imageFit)]

  settingsListing.appendChild(imageFitOption)
  settingsListing.appendChild(imageFitDescription)
  settingsListing.appendChild(document.createElement("br"))
  // Image fit button end

  settingsListing.appendChild(createZoomSlider())
  settingsListing.appendChild(document.createElement("br"))

  // Drop shadow button
  const dropShadowOption = createSettingsOptions("dropShadow", "Drop shadow")

  settingsListing.appendChild(dropShadowOption)
  // Drop shadow button end

  // Reset button
  const resetButton = document.createElement("a")
  resetButton.id = "resetButton"
  resetButton.classList.add("smallFancyButton", "option", "warning")
  resetButton.innerHTML = `Reset to default`

  resetButton.onclick = () => {
    settings.roundImage = false
    settings.zoom = 1
    clearStoredImage()
    const zoomSlider = l(`${appName}ZoomSlider`) as HTMLInputElement | null
    if (zoomSlider) {
      zoomSlider.value = "1"
      zoomSlider.dispatchEvent(new Event("input"))
    }
    updateBigCookie()
    Game.Notify("All image data removed!", "Here we go again", [10, 0])
    PlaySound('snd/tick.mp3');
  }

  settingsListing.appendChild(document.createElement("br"))
  settingsListing.appendChild(resetButton)
  // Reset button end
  
  settingsEl.appendChild(settingsTitle)
  settingsEl.appendChild(settingsListing)

  l('menu')?.insertBefore(settingsEl, l('menu')?.childNodes[3] || null)
}