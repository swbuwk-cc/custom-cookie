import { settings } from "../settings"

// Fixed texture geometry keeps static images and GIFs identical at any source resolution.
const textureSize = 512
const padding = 36
const imageSize = textureSize - padding * 2

// Canvases are reused between frames. Shadow space is reserved even when it is disabled.
export const createCookieRenderer = (width: number, height: number) => {
  const image = document.createElement("canvas")
  const output = document.createElement("canvas")
  image.width = image.height = imageSize
  output.width = output.height = textureSize
  const ctx = image.getContext("2d")!
  const outputCtx = output.getContext("2d")!

  return (source: CanvasImageSource) => {
    ctx.clearRect(0, 0, imageSize, imageSize)
    ctx.save()
    if (settings.roundImage) {
      ctx.beginPath()
      ctx.arc(imageSize / 2, imageSize / 2, imageSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }
    ctx.translate(imageSize / 2, imageSize / 2)
    ctx.scale(settings.zoom, settings.zoom)
    if (settings.imageFit === "fill") {
      ctx.drawImage(source, -imageSize / 2, -imageSize / 2, imageSize, imageSize)
    } else {
      const ratio = imageSize / (settings.imageFit === "contain"
        ? Math.max(width, height)
        : Math.min(width, height))
      const w = width * ratio
      const h = height * ratio
      ctx.drawImage(source, -w / 2, -h / 2, w, h)
    }
    ctx.restore()

    outputCtx.clearRect(0, 0, textureSize, textureSize)
    outputCtx.save()
    if (settings.dropShadow) {
      outputCtx.shadowColor = "black"
      outputCtx.shadowBlur = 12
      outputCtx.shadowOffsetY = 8
    }
    outputCtx.drawImage(image, padding, padding, imageSize, imageSize)
    outputCtx.restore()
    return output
  }
}
