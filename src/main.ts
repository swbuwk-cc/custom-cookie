import { appName } from "./config";
import { migrateLegacyMod } from "./migrateLegacyMod";
import { addSettings } from "./handlers/addSettings";
import { applySettings } from "./handlers/applySettings";
import { imageFitVariants, settings } from "./settings";

const init = () => {
  const initUpdateMenu = Game.UpdateMenu;
  Game.UpdateMenu = () => {
    const active = document.activeElement as HTMLInputElement | null;
    const selection = active?.id === `${appName}LinkInput`
      ? { start: active.selectionStart, end: active.selectionEnd, direction: active.selectionDirection }
      : null;

    initUpdateMenu();
    addSettings();

    const input = l(`${appName}LinkInput`) as HTMLInputElement | null;
    if (selection && input) {
      input.focus({ preventScroll: true });
      input.setSelectionRange(selection.start, selection.end, selection.direction ?? undefined);
    }
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
  void migrateLegacyMod();
  Game.registerMod(appName, customCookieMod);
};

if (typeof Steam !== "undefined") {
  // Wait for Steam to load
  setTimeout(registerMod, 2000);
} else {
  registerMod();
}
