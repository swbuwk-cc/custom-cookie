export const imageFitVariants = ["contain", "cover", "fill"] as const
export const imageFitDescriptions = [
  "(contain: changes width and height to make sure image fits inside, saving proportions)",
  "(cover: changes width and height to fill all space, saving proportions)",
  "(fill: changes width and height to fill all space, NOT saving proportions)"
]

export type Settings = {
  zoom: number
  collapseSettings: boolean
  isFromFile: boolean
  url: string
  roundImage: boolean
  isDefaultImage: boolean
  imageFit: typeof imageFitVariants[number]
  dropShadow: boolean
}

export const settings: Settings = {
  zoom: 1,
  collapseSettings: false,
  isFromFile: false,
  url: "",
  roundImage: false,
  isDefaultImage: true,
  imageFit: "contain",
  dropShadow: true
}