import { imageStorageKey } from "../config"
import { settings } from "../settings"

let imageRevision = 0

export const updateBigCookie = (notify?: boolean) => {
  const revision = ++imageRevision
  const fileUrl = localStorage.getItem(imageStorageKey) || ""
  const url = settings.isFromFile ? fileUrl : settings.url

  if (!url) {
    Game.Loader.Replace("perfectCookie.png", "perfectCookie.png");
    Game.Loader.Replace("cookieShadow.png", "cookieShadow.png");
    settings.isDefaultImage = true
    return
  }

  const isRound = settings.roundImage

  const image = new Image();
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  image.src = url;
  image.setAttribute('crossorigin', 'anonymous');

  image.onerror = () => {
    Game.Notify("Image is blocked from this URL!", "Try downloading it as a file", [15, 5])
    return
  }

  image.onload = () => {
    if (revision !== imageRevision) return
    canvas.width = image.width;
    canvas.height = image.width;

    if (!ctx) return;
    if (isRound) {
      const w = image.width;
      ctx.beginPath();
      ctx.arc(w/2, w/2, w/2, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.clip()
    }

    // Zoom around the center, keeping the output and round clipping unchanged.
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(settings.zoom, settings.zoom)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    if (settings.imageFit === "fill") { 
      const w = image.width;
      image.height = w;
      ctx.drawImage(image, 0, 0, w, w);
    } else {
      const maxSide = Math.max(image.width, image.height)
      const minSide = Math.min(image.width, image.height)
      const calcSize = settings.imageFit === "contain" ? maxSide : minSide
      
      const sizeDiff = calcSize / image.width
      const newWidth = image.width / sizeDiff
      const newHeight = image.height / sizeDiff
      const x = (canvas.width - newWidth) / 2
      const y = (canvas.height - newHeight) / 2
      ctx.drawImage(image, x, y, canvas.width - x * 2, canvas.width - y * 2);
    }


    const processedImage = new Image()
    processedImage.src = canvas.toDataURL()

    // does not work on Steam
    // ctx.reset();
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    processedImage.width = image.width;
    processedImage.height = image.width;

    processedImage.onload = () => {
      if (revision !== imageRevision) return
      const w = image.width;
      canvas.width = w;
      canvas.height = w;

      if (!ctx) return;

      if (settings.dropShadow) {
        ctx.shadowColor = "black";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 10;

        ctx.drawImage(processedImage, 15, 15, w-30, w-30)
      } else {
        ctx.drawImage(processedImage, 0, 0, w, w)
      }

      Game.Loader.Replace("perfectCookie.png", canvas.toDataURL());
      Game.Loader.Replace("cookieShadow.png", "filler.png");
      settings.isDefaultImage = false
      if (notify) Game.Notify(`New image set!`, "Looks wonderful!", [25, 7])
    }
  };
}