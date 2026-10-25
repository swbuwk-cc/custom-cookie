import { loadImage } from "../handlers/common"
import { appName } from "../config"

let linkDraft = ""

export const createLinkUploader = () => {
  const wrapper = document.createElement("div")
  wrapper.id = `${appName}LinkUploader`
  wrapper.style.cssText = "display:flex;align-items:center;gap:6px;width:100%;min-width:0;"

  const input = document.createElement("input")
  input.type = "text"
  input.id = `${appName}LinkInput`
  input.style.cssText = "user-select:all;flex:1 1 0;min-width:0;width:100%;box-sizing:border-box;margin:0;"
  input.value = linkDraft
  input.oninput = () => { linkDraft = input.value }
  input.placeholder = "Paste image link"
  input.setAttribute("aria-label", "Image link")

  const apply = () => {
    const url = input.value.trim()
    if (!url) return
    linkDraft = ""
    input.value = ""
    void loadImage(url)
  }
  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      apply()
    }
  }

  const button = document.createElement("a")
  button.classList.add("smallFancyButton", "option")
  button.textContent = "Apply"
  button.style.cssText = "flex:0 0 auto;width:auto;min-width:0;text-align:center;margin:0;padding:2px 10px;"
  button.onclick = apply

  wrapper.appendChild(input)
  wrapper.appendChild(button)
  return wrapper
}
