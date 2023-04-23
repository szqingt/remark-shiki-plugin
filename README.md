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

const code = "```typescript ins={1,2} del={3}\nconst hello = 'world';\nconst aa = 123\n```"
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
.shiki .del {
  background: #471a2b;
}

.shiki .ins {
  background: #1f3820;
}
.shiki .ins::before {
  content: "+";
  color: #69b072;
}

.shiki .del::before {
  content: "-";
  color: #bb909f;
}


```

Then you can highlight lines in code block.

```typescript ins={1,2} del={3}
const hello = 'world';
const aa = 123;
const bb = 123;
```
## Example customer process 
For example, if you want to display the title of a code block above it, you can customize the processing in a way that suits your needs.

```ts
import fromMarkdown from 'remark-parse'
import { unified } from 'unified'
import ShikiRemarkPlugin from 'remark-shikiplugin'

const code = "```typescript title='hello-world.ts'\nconst hello = 'world';\n```"
import { unified } from 'unified'

unified()
  .use(fromMarkdown)
  .use(ShikiRemarkPlugin, { 
      theme: 'vitesse-light',
      customerHtmlHandle(code, html) {
          const titleReg = /(?:\s|^)title\s*=\s*(["'])(.*?)(?<!\\)\1/
          const match = (code.meta || '').match(titleReg)
          const [_, __, titleValue] = Array.from(match || [])
          return `<figure><figcaption>${titleValue}</figcaption>${html}</figure>`
        }
   })
```
Then the generated output will look like this.
```html
<figure>
  <figcaption>123</figcaption>
  <pre
    class="shiki vitesse-light"
    style="background-color: #ffffff"
    tabindex="0"
  >
    <code>
      <span class="line">
        <span style="color: #AB5959">const </span>
        <span style="color: #B07D48">hello</span>
        <span style="color: #AB5959"> = </span>
        <span style="color: #B5695999">&#39;</span>
        <span style="color: #B56959">world</span>
        <span style="color: #B5695999">&#39;</span>
        <span style="color: #999999">;</span>
      </span>
    </code>
  </pre>
</figure>;
```

## API
The default export is `ShikiRemarkPlugin`.

### `options`
options extends shiki `HighlighterOptions`

#### `options.highlighter`
Provide a custom highlighter

#### `options.generateMultiCode`
这个配置是用来决定你是否启用生成多个Code块  
This configuration item means whether to generate multiple Codes, the type is boolean default value is false., when the value is true, please provide the themes configuration.

#### `options.highlightLines`
这个配置是用来决定你是否启用高亮行的模式  
This configuration is used to determine whether you have enabled the highlighted line mode, the type is boolean default value is false.

#### `options.customerHtmlHandle` 
这个配置用来自定义处理生成出来的 HTML，某些场景可能需要更近一步的方式来处理生成处的内容。可以传递一个方法来自定义的处理函数类型是 `(code: Code, shikiGenHtml: string) => string` 然后返回处理之后的 HTML 

This configuration is used to customize the processing of the generated HTML. In some scenarios, a more advanced approach may be needed to process the generated content. You can pass a method to customize the processing function, type is `(code: Code, shikiGenHtml: string) => string` then return the processed HTML.


## Why do we need this plugin
In the description of shiki,there are two ways to support [dark mode](https://github.com/shikijs/shiki/blob/main/docs/themes.md#dark-mode-support). The second way is to Generate two Shiki code blocks, one for each theme. So this plugin is designed to generate multiple code blocks.

