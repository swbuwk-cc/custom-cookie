import { appName } from "../config";
import { settings } from "../settings";
import { updateBigCookie } from "../handlers/updateBigCookie";

export const createZoomSlider = () => {
  // Match Game.WriteSlider's native markup and CSS without inline handlers.
  const box = document.createElement("div");
  box.className = "sliderBox";

  const label = document.createElement("div");
  label.className = "smallFancyButton";
  label.style.cssFloat = "left";
  label.textContent = "Zoom";
  label.id = `${appName}ZoomSliderLabel`;

  const value = document.createElement("div");
  value.className = "smallFancyButton";
  value.style.cssFloat = "right";

  const slider = document.createElement("input");
  slider.id = `${appName}ZoomSlider`;
  slider.setAttribute("aria-labelledby", label.id);
  slider.className = "slider";
  slider.style.clear = "both";
  slider.type = "range";
  slider.min = "0.5";
  slider.max = "3";
  slider.step = "0.05";
  slider.value = String(settings.zoom);

  const updateLabel = () => {
    value.textContent = `${settings.zoom.toFixed(2)}×`;
  };
  updateLabel();
  slider.oninput = () => {
    settings.zoom = Number(slider.value);
    updateLabel();
    const preview = l("fileUploadPreview");
    if (preview) preview.style.transform = `scale(${settings.zoom})`;
  };
  slider.onchange = () => {
    updateBigCookie();
    PlaySound("snd/tick.mp3");
  };

  box.appendChild(label);
  box.appendChild(value);
  box.appendChild(slider);
  return box;
};
