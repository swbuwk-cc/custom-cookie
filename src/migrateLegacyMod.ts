import { appName, imageStorageKey } from "./config"
import { loadImage } from "./handlers/common"
import { imageFitVariants, settings } from "./settings"

// Keep the legacy save and local image intact, so upgrading is non-destructive.
export const migrateLegacyMod = async () => {
  const migrationKey = `${appName}LegacyMigration`

  try {
    if (localStorage.getItem(migrationKey)
      || Game.modSaveData[appName]
      || localStorage.getItem(imageStorageKey)) return

    const oldSave = Game.modSaveData.AnyCookie
    const oldImage = localStorage.getItem("anyCookieImage") || ""
    if (!oldSave && !oldImage) return

    const legacy = oldSave ? JSON.parse(oldSave) : null
    if (oldSave && (!legacy || typeof legacy !== "object" || Array.isArray(legacy))) {
      throw new Error("Invalid legacy settings")
    }

    const migrated = { ...settings }
    for (const key of ["roundImage", "dropShadow"] as const) {
      if (typeof legacy?.[key] === "boolean") migrated[key] = legacy[key]
    }
    if (imageFitVariants.includes(legacy?.imageFit)) migrated.imageFit = legacy.imageFit

    // Respect the old source selection; don't restore an unused file over a URL.
    const image = !legacy || legacy.isFromFile
      ? oldImage
      : typeof legacy.url === "string" ? legacy.url : ""

    if (image && (!legacy || legacy.isFromFile)) {
      localStorage.setItem(imageStorageKey, image)
    }
    // This runs synchronously before registerMod invokes init/load.
    Game.modSaveData[appName] = JSON.stringify(migrated)
    localStorage.setItem(migrationKey, "1")

    if (image && legacy && !legacy.isFromFile) {
      // The shared loader handles CORS, quotas and cancellation by a new selection/reset.
      await loadImage(image)
    }
  } catch {
    Game.Notify("Could not migrate AnyCookie", "Old data is preserved. You can upload the image again.", [15, 5])
  }
}
