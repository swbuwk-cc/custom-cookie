import { createGifSource } from "./gifSource"

const isGif = (url: string) =>
  /^data:image\/gif[;,]/i.test(url) || /^data:[^,]*;base64,R0lGOD/.test(url)

// Both adapters expose a ready frame; only animated sources advance over time.
export type ImageSource = {
  readonly frame: CanvasImageSource
  readonly width: number
  readonly height: number
  advance: (now: number) => boolean
}

export const loadImageSource = async (url: string): Promise<ImageSource> => {
  if (isGif(url)) return createGifSource(url)

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not decode the image"))
    image.src = url
  })
  return {
    frame: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    advance: () => false,
  }
}
