import { settings } from "../settings"
import type { ImageSource } from "../images/imageSource"

let current: { url: string; source: ImageSource } | undefined

const drawFrame = (preview: HTMLCanvasElement, source: ImageSource) => {
  if (preview.width !== source.width) preview.width = source.width
  if (preview.height !== source.height) preview.height = source.height
  const ctx = preview.getContext("2d")!
  ctx.clearRect(0, 0, preview.width, preview.height)
  ctx.drawImage(source.frame, 0, 0)
}

export const setPreviewFrame = (url: string, source: ImageSource) => {
  current = { url, source }
  const preview = l("fileUploadPreview") as HTMLCanvasElement | null
  if (preview?.getAttribute("data-image-url") === url) drawFrame(preview, source)
}

export const clearPreviewFrame = () => { current = undefined }

export const createImagePreview = (url: string) => {
  const preview = document.createElement("canvas")
  preview.id = "fileUploadPreview"
  preview.setAttribute("data-image-url", url)
  preview.style.cssText = "position:absolute;width:100%;height:100%;z-index:8;transform-origin:center;"
  preview.style.display = url ? "block" : "none"
  preview.style.objectFit = settings.imageFit
  preview.style.transform = `scale(${settings.zoom})`
  if (url === current?.url) drawFrame(preview, current.source)
  return preview
}

export const refreshStoredImagePreview = (url: string) => {
  const preview = l("fileUploadPreview")
  if (!preview) return
  if (preview.getAttribute("data-image-url") !== url) {
    preview.replaceWith(createImagePreview(url))
  } else {
    preview.style.objectFit = settings.imageFit
    preview.style.transform = `scale(${settings.zoom})`
  }
}
