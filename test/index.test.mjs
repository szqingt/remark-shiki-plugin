import ShikiRemarkPlugin from '../dist/index.mjs'
import { visit } from 'unist-util-visit'

const root1 = {
  type: 'root',
  children: [
    {
      type: 'code',
      value: 'const aa = 123;',
      lang: 'typescript',
      snapshot: "<pre class=\"shiki vitesse-light\" style=\"background-color: #ffffff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #AB5959\">const </span><span style=\"color: #B07D48\">aa</span><span style=\"color: #AB5959\"> = </span><span style=\"color: #2F798A\">123</span><span style=\"color: #999999\">;</span></span></code></pre>"
    }
  ]
}

const root2 = {
  type: 'root',
  children: [
    {
      type: 'code',
      value: `const aa = 123;
        const bb = 456;
        const cc = 789;
        const dd = "hello world";`,
      lang: 'typescript',
      snapshot: `<div class="shiki-container"><pre class="shiki vitesse-light" style="background-color: #ffffff" tabindex="0"><code><span class="line"><span style="color: #AB5959">const </span><span style="color: #B07D48">aa</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">123</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">bb</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">456</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">cc</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">789</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">dd</span><span style="color: #AB5959"> = </span><span style="color: #B5695999">&quot;</span><span style="color: #B56959">hello world</span><span style="color: #B5695999">&quot;</span><span style="color: #999999">;</span></span></code></pre><pre class="shiki vitesse-dark" style="background-color: #121212" tabindex="0"><code><span class="line"><span style="color: #CB7676">const </span><span style="color: #BD976A">aa</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">123</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">bb</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">456</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">cc</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">789</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">dd</span><span style="color: #CB7676"> = </span><span style="color: #C98A7D99">&quot;</span><span style="color: #C98A7D">hello world</span><span style="color: #C98A7D99">&quot;</span><span style="color: #666666">;</span></span></code></pre></div>`
    }
  ]
}

const root3 = {
  type: 'root',
  children: [
    {
      type: 'code',
      value: `
        const aa = 123;
        const bb = 456;
        const cc = 789;
        const dd = "hello world";
      `,
      lang: 'typescript',
      meta: 'aaa={1} bbb={2,3}',
      snapshot: `<div class="shiki-container"><pre class="shiki vitesse-light" style="background-color: #ffffff" tabindex="0"><code><span class="line aaa"></span>\n<span class="line bbb"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">aa</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">123</span><span style="color: #999999">;</span></span>\n<span class="line bbb"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">bb</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">456</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">cc</span><span style="color: #AB5959"> = </span><span style="color: #2F798A">789</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">        </span><span style="color: #AB5959">const </span><span style="color: #B07D48">dd</span><span style="color: #AB5959"> = </span><span style="color: #B5695999">&quot;</span><span style="color: #B56959">hello world</span><span style="color: #B5695999">&quot;</span><span style="color: #999999">;</span></span>\n<span class="line"><span style="color: #393A34">      </span></span></code></pre><pre class="shiki vitesse-dark" style="background-color: #121212" tabindex="0"><code><span class="line aaa"></span>\n<span class="line bbb"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">aa</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">123</span><span style="color: #666666">;</span></span>\n<span class="line bbb"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">bb</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">456</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">cc</span><span style="color: #CB7676"> = </span><span style="color: #4C9A91">789</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">        </span><span style="color: #CB7676">const </span><span style="color: #BD976A">dd</span><span style="color: #CB7676"> = </span><span style="color: #C98A7D99">&quot;</span><span style="color: #C98A7D">hello world</span><span style="color: #C98A7D99">&quot;</span><span style="color: #666666">;</span></span>\n<span class="line"><span style="color: #DBD7CAEE">      </span></span></code></pre></div>`
    }
  ]
}

// const run1 = ShikiRemarkPlugin({
//   theme: 'vitesse-light',
//   themes: ['vitesse-light', 'vitesse-dark'],
//   generateMultiCode: false
// })

// const run2 = ShikiRemarkPlugin({
//   theme: 'vitesse-light',
//   themes: ['vitesse-light', 'vitesse-dark'],
//   generateMultiCode: true
// })

// const run3 = ShikiRemarkPlugin({
//   theme: 'vitesse-light',
//   themes: ['vitesse-light', 'vitesse-dark'],
//   generateMultiCode: true
// })


function test(root, options = {}) {
  (ShikiRemarkPlugin({
    theme: 'vitesse-light',
    themes: ['vitesse-light', 'vitesse-dark'],
    ...options
  }))(root);
  let pass = true;
  visit(root, 'html', (code) => {
    if (!pass) return
    pass = code.value === code.snapshot
  })
  return pass
}


function runAll() {
  const testDataList = [
    // {data: root1},
    // {data: root2, options: {generateMultiCode: true}},
    {data: root3, options: {generateMultiCode: true, highlightLines: true}},
  ]
  const failed = testDataList.some(({data, options}) => !test(data, options))
  
  if (failed) {
    throw new Error('test failed')
  }
}

runAll()

console.log('test success')