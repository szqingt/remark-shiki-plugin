import type { Highlighter, HtmlRendererOptions, ILanguageRegistration, IThemeRegistration } from 'shiki'
import { getHighlighter } from 'shiki'
import { runAsWorker } from 'synckit'

let h: Highlighter

function handler(command: 'getHighlighter', options: {
  themes: IThemeRegistration[]
  langs: ILanguageRegistration[]
}): void
function handler(command: 'codeToHtml', options: {
  code: string
  lang: string
  theme: string | undefined
  lineOptions: HtmlRendererOptions['lineOptions']
}): Promise<string>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handler(command: 'getHighlighter' | 'codeToHtml', options: any) {
  if (command === 'getHighlighter') {
    if (h) return;
    h = await getHighlighter(options)
  }
  else if (command === 'codeToHtml') {
    const { code, lang, theme, lineOptions } = options
    const loadedLanguages = h.getLoadedLanguages()
    if (loadedLanguages.includes(lang))
      return h.codeToHtml(code, { lang, theme, lineOptions })
    else
      return h.codeToHtml(code, { lang: 'text', theme, lineOptions })
  }
}

runAsWorker(handler)
