import { imageStorageKey } from "../config"
import { ImageSource, loadImageSource } from "../images/imageSource"
import { createCookieRenderer } from "./renderCookie"
import { setCookieTexture } from "./cookieTexture"
import { clearPreviewFrame, setPreviewFrame } from "./imagePreview"

let revision = 0
let current: {
  url: string
  source: ImageSource
  render: ReturnType<typeof createCookieRenderer>
} | undefined
let pending: { url: string; source: Promise<ImageSource> } | undefined
let hookRegistered = false

const renderCurrent = () => {
  if (!current) return
  setCookieTexture(current.render(current.source.frame))
  setPreviewFrame(current.url, current.source)
}

export const updateBigCookie = async (notify?: boolean) => {
  const request = ++revision
  const url = localStorage.getItem(imageStorageKey) || ""

  if (!url) {
    current = undefined
    pending = undefined
    clearPreviewFrame()
    Game.Loader.Replace("perfectCookie.png", "perfectCookie.png")
    Game.Loader.Replace("cookieShadow.png", "cookieShadow.png")
    return
  }

  try {
    if (current?.url !== url) {
      // Repeated settings changes while loading share the same decode operation.
      if (pending?.url !== url) pending = { url, source: loadImageSource(url) }
      const source = await pending.source
      if (request !== revision) return
      current = { url, source, render: createCookieRenderer(source.width, source.height) }
      pending = undefined
    }

    renderCurrent()
    if (!hookRegistered) {
      Game.registerHook("logic", () => {
        if (current?.source.advance(performance.now())) renderCurrent()
      })
      hookRegistered = true
    }
    if (notify) Game.Notify("New image set!", "Looks wonderful!", [25, 7])
  } catch {
    if (request !== revision) return
    pending = undefined
    Game.Notify("Could not render the image", "Try uploading another file", [15, 5])
  }
}
