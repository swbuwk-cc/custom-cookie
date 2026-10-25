import { appName, imageStorageKey } from "../config"
import { updateBigCookie } from "./updateBigCookie"
import { refreshStoredImagePreview } from "./imagePreview"

let uploadRevision = 0
let activeDownload: AbortController | undefined
let loading = false

export const isImageLoading = () => loading

export const refreshImagePreview = () => {
  const url = localStorage.getItem(imageStorageKey) || ""
  refreshStoredImagePreview(url)
  const resetButton = l(`${appName}FileResetButton`)
  const title = l(`${appName}FileUploadTitle`)
  const status = l(`${appName}ImageStatus`)
  if (resetButton) resetButton.style.display = url ? "block" : "none"
  if (title) title.style.display = url ? "none" : "block"
  if (status) status.textContent = loading ? "Loading image…" : "Images are stored in this browser, not in the game save."
}

export const clearStoredImage = () => {
  ++uploadRevision
  activeDownload?.abort()
  activeDownload = undefined
  loading = false
  localStorage.removeItem(imageStorageKey)
  refreshImagePreview()
}

const readDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => typeof reader.result === "string"
    ? resolve(reader.result)
    : reject(new Error("Could not read the image."))
  reader.onerror = () => reject(new Error("Could not read the image."))
  reader.onabort = () => reject(new Error("Image reading was cancelled."))
  reader.readAsDataURL(blob)
})

const validateImage = (url: string) => new Promise<void>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve()
  image.onerror = () => reject(new Error("This file is not a supported image."))
  image.src = url
})

// Files and URLs share one commit path and one revision counter.
export const loadImage = async (source: File | string) => {
  const revision = ++uploadRevision
  activeDownload?.abort()
  const controller = new AbortController()
  activeDownload = controller
  loading = true
  refreshImagePreview()

  try {
    let blob: Blob
    if (typeof source === "string") {
      const url = new URL(source.trim())
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("Use an HTTP or HTTPS image link.")
      }
      const response = await fetch(url.href, { signal: controller.signal, credentials: "omit" })
      if (!response.ok) throw new Error(`Image download failed (HTTP ${response.status}).`)
      blob = await response.blob()
    } else {
      blob = source
    }
    const dataUrl = await readDataUrl(blob)
    await validateImage(dataUrl)

    // Only the latest selection may replace the stored image.
    if (revision !== uploadRevision) return

    // Do not change the current image unless storage succeeds (e.g. quota exceeded).
    localStorage.setItem(imageStorageKey, dataUrl)
    refreshImagePreview()
    updateBigCookie(true)
    PlaySound("snd/tick.mp3")
  } catch (error) {
    if (revision !== uploadRevision) return
    const message = error instanceof DOMException && error.name === "QuotaExceededError"
      ? "Browser storage is full. Try a smaller image."
      : typeof source === "string"
        ? "Could not download this image. Check the link and CORS permissions, or upload a file."
        : "Could not load this image. Try another file."
    Game.Notify("Image not changed", message, [15, 5])
  } finally {
    if (revision === uploadRevision) {
      activeDownload = undefined
      loading = false
      refreshImagePreview()
    }
  }
}
