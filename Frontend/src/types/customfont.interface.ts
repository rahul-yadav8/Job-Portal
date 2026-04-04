export interface ICustomFont {
  isCustomFontEnabled: boolean
  fontConfig: Record<string, string>
}

export interface IFont {
  fontName: string
  fontFile?: File
}
