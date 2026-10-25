import { appName } from "./config";
import { addSettings } from "./handlers/addSettings";
import { applySettings } from "./handlers/applySettings";
import { Settings, settings } from "./settings";

const init = () => {
  const initUpdateMenu = Game.UpdateMenu;
  Game.UpdateMenu = () => {
    initUpdateMenu();
    addSettings();
  };
};

const save = () => {
  return JSON.stringify(settings);
};

const load = (dataStr: string) => {
  const data = JSON.parse(dataStr);

  (Object.keys(data) as (keyof Settings)[]).forEach(
    <K extends keyof Settings>(key: K) => {
      settings[key] = data[key];
    },
  );

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
