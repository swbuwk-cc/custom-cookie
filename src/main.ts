import { appName } from "./config";
import { addSettings } from "./handlers/addSettings";
import { applySettings } from "./handlers/applySettings";
import { imageFitVariants, settings } from "./settings";

const init = () => {
  const initUpdateMenu = Game.UpdateMenu;
  Game.UpdateMenu = () => {
    initUpdateMenu();
    addSettings();
  };
  applySettings();
};

const save = () => {
  return JSON.stringify(settings);
};

const load = (dataStr: string) => {
  const data = JSON.parse(dataStr);

  if (!data || typeof data !== "object") return;
  // Only visual preferences belong in saves, never image data or source URLs.
  for (const key of ["roundImage", "dropShadow", "collapseSettings"] as const) {
    if (typeof data[key] === "boolean") settings[key] = data[key];
  }
  if (imageFitVariants.includes(data.imageFit)) settings.imageFit = data.imageFit;

  settings.zoom =
    typeof data.zoom === "number" && Number.isFinite(data.zoom)
      ? Math.min(3, Math.max(0.5, data.zoom))
      : 1;

  applySettings();
};

const customCookieMod = {
  init,
  save,
  load,
};

const registerMod = () => {
  Game.registerMod(appName, customCookieMod);
};

if (typeof Steam !== "undefined") {
  // Wait for Steam to load
  setTimeout(registerMod, 2000);
} else {
  registerMod();
}
