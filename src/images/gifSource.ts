import { decompressFrames, parseGIF, ParsedFrame } from "gifuct-js"
import type { ImageSource } from "./imageSource"

// GIF-specific composition stays here, independent of the game and preview.
export const createGifSource = (url: string): ImageSource => {
  const bytes = Uint8Array.from(atob(url.slice(url.indexOf(",") + 1)), char => char.charCodeAt(0))
  const gif = parseGIF(bytes.buffer)
  const frames = decompressFrames(gif, true)
  if (!frames.length) throw new Error("GIF contains no image frames")

  const canvas = document.createElement("canvas")
  canvas.width = gif.lsd.width
  canvas.height = gif.lsd.height
  const ctx = canvas.getContext("2d")!
  const patch = document.createElement("canvas")
  const patchCtx = patch.getContext("2d")!
  let index = 0
  let previous: ParsedFrame | undefined
  let restore: ImageData | undefined

  const paint = () => {
    if (index === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    } else if (previous?.disposalType === 2) {
      const { left, top, width, height } = previous.dims
      ctx.clearRect(left, top, width, height)
    } else if (previous?.disposalType === 3 && restore) {
      ctx.putImageData(restore, 0, 0)
    }

    const frame = frames[index]
    restore = frame.disposalType === 3
      ? ctx.getImageData(0, 0, canvas.width, canvas.height)
      : undefined
    const { left, top, width, height } = frame.dims
    patch.width = width
    patch.height = height
    const pixels = patchCtx.createImageData(width, height)
    pixels.data.set(frame.patch)
    patchCtx.putImageData(pixels, 0, 0)
    ctx.drawImage(patch, left, top)
    previous = frame
  }

  paint()
  let nextFrameAt = performance.now() + frames[0].delay
  return {
    frame: canvas,
    width: canvas.width,
    height: canvas.height,
    advance: (now) => {
      if (now < nextFrameAt || frames.length === 1) return false
      // Skip catch-up work after a hidden tab; resume with the next frame.
      index = (index + 1) % frames.length
      paint()
      nextFrameAt = now + frames[index].delay
      return true
    },
  }
}
