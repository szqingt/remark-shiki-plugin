import type { Root, Code } from 'mdast'
import type { HighlighterOptions, Highlighter } from 'shiki'

import { createRequire } from 'module'
import { createSyncFn } from 'synckit'
import { visit } from 'unist-util-visit'

interface Options extends HighlighterOptions {
  highlighter?: Highlighter
  generateMultiCode: boolean
}

const ShikiRemarkPlugin = (options: Options) => {
  const { themes = [], theme = 'nord', generateMultiCode, langs } = options;
  const custHighlighter = options.highlighter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let syncRun: any
  if (!custHighlighter) {
    const require = createRequire(import.meta.url)
    syncRun = createSyncFn(require.resolve('./worker'))
    syncRun('getHighlighter', { langs, themes, theme })
  }

  function highlight(code: string, theme: string, lang: string) {
  
    if (custHighlighter) {
      return custHighlighter.codeToHtml(code, { lang, theme, lineOptions: undefined })
    } else {
      return syncRun('codeToHtml', {
        code,
        theme,
        lang,
      })
    }
  }
  return function (tree: Root) {

    visit(tree, 'code', visitor)
    function visitor(node: Code) {
      let highlightHTML;
      if (generateMultiCode) {
        const allHighlighted = themes.map((theme) => {
          return highlight(node.value, theme as string, node.lang || 'text')
        })
        highlightHTML = `<div class="shiki-container">${allHighlighted.join('')}</div>`
      } else {
        highlightHTML = highlight(node.value, theme as string, node.lang || 'text')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.type = 'html'
      node.value = highlightHTML
    }

  }
}

export default ShikiRemarkPlugin