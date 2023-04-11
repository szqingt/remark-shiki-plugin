# remark-shiki-plugin

[remark](https://github.com/remarkjs/remark) is a tool that transforms Markdown with plugins。
This plugin is used to highlight syntax using [Shiki](https://github.com/shikijs/shiki) in remark.

## Install 

```bash
npm i -D remark-shiki-plugin
```

## Example Dark
```ts
import fromMarkdown from 'remark-parse'
import { unified } from 'unified'
import ShikiRemarkPlugin from 'remark-shikiplugin'

const code = "```typescript\nconst hello = 'world';\n```"
import { unified } from 'unified'

unified()
  .use(fromMarkdown)
  .use(ShikiRemarkPlugin, { 
      theme: 'vitesse-light',
      themes: ['vitesse-light', 'vitesse-dark'],
      generateMultiCode: true
   })
```
```css
/* example use vitesse-ligh vitesse-dark */
/* query css */
@media (prefers-color-scheme: light) {
  .shiki.vitesse-light {
    display: none;
  }
}
@media (prefers-color-scheme: dark) {
  .shiki.vitesse-dark {
    display: none;
  }
}

/* or class */
html.dark .vitesse-light {
  display: none;
}

html:not(.dark) .vitesse-dark {
  display: none;
}
```

## Example Highlight lines

```ts
import fromMarkdown from 'remark-parse'
import { unified } from 'unified'
import ShikiRemarkPlugin from 'remark-shikiplugin'

const code = "```typescript test-highlight{1,2}\nconst hello = 'world';\nconst aa = 123\n```"
import { unified } from 'unified'

unified()
  .use(fromMarkdown)
  .use(ShikiRemarkPlugin, { 
      theme: 'vitesse-light',
      themes: ['vitesse-light', 'vitesse-dark'],
      generateMultiCode: true,
      highlightLines: true
   })
```

Add these to your CSS

```css
.shiki .test-highlight {
  background: #192e66;
}
```

Then you can highlight lines in code block.

```typescript test-highlight{1,2}
const hello = 'world';
const aa = 123
```

## API
The default export is `ShikiRemarkPlugin`.

### `options`
options extends shiki `HighlighterOptions`

#### `options.highlighter`
Provide a custom highlighter

#### `options.generateMultiCode`
This configuration item means whether to generate multiple Codes, the type is boolean default value is false., when the value is true, please provide the themes configuration.

#### `options.highlightLines`
这个配置是用来决定你是否启用高亮行的模式
This configuration is used to determine whether you have enabled the highlighted line mode, the type is boolean default value is false.

## Why do we need this plugin
In the description of shiki,there are two ways to support [dark mode](https://github.com/shikijs/shiki/blob/main/docs/themes.md#dark-mode-support). The second way is to Generate two Shiki code blocks, one for each theme. So this plugin is designed to generate multiple code blocks.

