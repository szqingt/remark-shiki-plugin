import type { Root, Code } from 'mdast'
import type { HighlighterOptions, Highlighter, HtmlRendererOptions } from 'shiki'

import { createRequire } from 'module'
import { createSyncFn } from 'synckit'
import { visit } from 'unist-util-visit'

type CustomerHtmlHandle = (code: Code, shikiGenHtml: string) => string
export interface Options extends HighlighterOptions {
  generateMultiCode?: boolean
  highlightLines?: boolean
  highlighter?: Highlighter
  customerHtmlHandle?: CustomerHtmlHandle
}

function parseMarkingToLines(markingLines: string): HtmlRendererOptions['lineOptions'] {
  if (!markingLines) return []
  return markingLines.split(' ').filter(Boolean).map(mark => markToLines(mark)).flat(1)
}

const markToLines = (mark: string) => {
  const reg = /(.*)={([\d,-]+)}/
  // eg aa={1,2}
  const match = reg.exec(mark)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, className, lineInfoStr] = Array.from(match || [])
  if (!lineInfoStr) {
    console.warn('parase markToLines error, invalid code inline marking:', mark)
    return []
  }
  const lineList = lineInfoStr
    .split(',')
    .map(v => v.split('-').map(v => parseInt(v, 10)))
    .map(([start, end]) => {
      return end ? [...Array.from({ length: end - start + 1 }, (_, i) => start + i)] : [start]
    }).flat(1)

  return lineList.map(line => ({
    line,
    classes: className ? [className] : ['highlighted']
  }))
}

const ShikiRemarkPlugin = (options: Options) => {
  const {
    themes = [],
    theme = 'nord',
    generateMultiCode,
    highlightLines,
    langs,
    customerHtmlHandle
  } = options
  const custHighlighter = options.highlighter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // (?:\s|^)title=\s*(["'])(.*?)(?<!\\)\1
  let syncRun: any
  if (!custHighlighter) {
    const require = createRequire(import.meta.url)
    syncRun = createSyncFn(require.resolve('./worker'))
    syncRun('getHighlighter', { langs, themes, theme })
  }

  function highlight(code: Code, theme: string, lang: string, lineOptions: HtmlRendererOptions['lineOptions']) {
    let shikiGenHtml: string
    if (custHighlighter) {
      shikiGenHtml = custHighlighter.codeToHtml(code.value, { lang, theme, lineOptions })
    } else {
      shikiGenHtml = syncRun('codeToHtml', {
        code: code.value,
        theme,
        lang,
        lineOptions,
      })
    }
    if (customerHtmlHandle) {
      return customerHtmlHandle(code, shikiGenHtml)
    }
    return shikiGenHtml
  }
  return function (tree: Root) {

    visit(tree, 'code', visitor)
    function visitor(node: Code) {
      let highlightHTML: string
      const lineOptions = (highlightLines && node.meta) ? parseMarkingToLines(node.meta) : []
      if (generateMultiCode) {
        const allHighlighted = themes.map((theme) => {
          return highlight(node, theme as string, node.lang || 'text', lineOptions)
        })
        highlightHTML = `<div class="shiki-container">${allHighlighted.join('')}</div>`
      } else {
        highlightHTML = highlight(node, theme as string, node.lang || 'text', lineOptions)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.type = 'html'
      node.value = highlightHTML
    }

  }
}

export default ShikiRemarkPlugin