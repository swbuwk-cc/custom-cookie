let transparentShadow: HTMLCanvasElement | undefined

const setCanvasAsset = (name: string, canvas: HTMLCanvasElement) => {
  // Pic() feeds assets to drawImage(), which accepts canvases as well as images.
  Game.Loader.assets[name] = canvas as unknown as HTMLImageElement
  if (!Game.Loader.assetsLoaded.includes(name)) Game.Loader.assetsLoaded.push(name)
}

export const setCookieTexture = (canvas: HTMLCanvasElement) => {
  if (!transparentShadow) {
    transparentShadow = document.createElement("canvas")
    transparentShadow.width = transparentShadow.height = 1
  }
  setCanvasAsset("perfectCookie.png", canvas)
  setCanvasAsset("cookieShadow.png", transparentShadow)
}
