import type { Root, Code } from 'mdast'
import type { HighlighterOptions, Highlighter, HtmlRendererOptions } from 'shiki'

import { createRequire } from 'module'
import { createSyncFn } from 'synckit'
import { visit } from 'unist-util-visit'

interface Options extends HighlighterOptions {
  highlighter?: Highlighter
  generateMultiCode: boolean
  highlightLines: boolean
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
  const [_, className, lineInfoStr ] = Array.from(match || [])
  if (!lineInfoStr) {
    console.warn('parase markToLines error, invalid code inline marking:', mark);
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
  const { themes = [], theme = 'nord', generateMultiCode, highlightLines, langs } = options;
  const custHighlighter = options.highlighter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let syncRun: any
  if (!custHighlighter) {
    const require = createRequire(import.meta.url)
    syncRun = createSyncFn(require.resolve('./worker'))
    syncRun('getHighlighter', { langs, themes, theme })
  }

  function highlight(code: string, theme: string, lang: string, lineOptions: HtmlRendererOptions['lineOptions']) {
  
    if (custHighlighter) {
      return custHighlighter.codeToHtml(code, { lang, theme, lineOptions })
    } else {
      return syncRun('codeToHtml', {
        code,
        theme,
        lang,
        lineOptions,
      })
    }
  }
  return function (tree: Root) {

    visit(tree, 'code', visitor)
    function visitor(node: Code) {
      let highlightHTML;
      const lineOptions = (highlightLines && node.meta) ? parseMarkingToLines(node.meta) : []
      if (generateMultiCode) {
        const allHighlighted = themes.map((theme) => {
          return highlight(node.value, theme as string, node.lang || 'text', lineOptions)
        })
        highlightHTML = `<div class="shiki-container">${allHighlighted.join('')}</div>`
      } else {
        highlightHTML = highlight(node.value, theme as string, node.lang || 'text', lineOptions)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.type = 'html'
      node.value = highlightHTML
    }

  }
}

export default ShikiRemarkPlugin