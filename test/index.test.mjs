import ShikiRemarkPlugin from '../dist/index.mjs'

const root1 = {
  type: 'root',
  children: [
    {
      type: 'code',
      value: '```typescript\nconst aa = 123;\n```',
      lang: 'typescript'
    }
  ]
}

const root2 = {
  type: 'root',
  children: [
    {
      type: 'code',
      value: '```typescript\nconst aa = 123;\n```',
      lang: 'typescript'
    }
  ]
}

const run1 = ShikiRemarkPlugin({
  theme: 'vitesse-light',
  themes: ['vitesse-light', 'vitesse-dark'],
  generateMultiCode: true
})

const run2 = ShikiRemarkPlugin({
  theme: 'vitesse-light',
  themes: ['vitesse-light', 'vitesse-dark'],
  generateMultiCode: false
})

const snapshotSingle = "<pre class=\"shiki vitesse-light\" style=\"background-color: #ffffff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #B5695999\">```</span><span style=\"color: #B56959\">typescript</span></span>\n<span class=\"line\"><span style=\"color: #B56959\">const aa = 123;</span></span>\n<span class=\"line\"><span style=\"color: #B5695999\">```</span></span></code></pre>"
const snapshotMulti = "<div class=\"shiki-container\"><pre class=\"shiki vitesse-light\" style=\"background-color: #ffffff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #B5695999\">```</span><span style=\"color: #B56959\">typescript</span></span>\n<span class=\"line\"><span style=\"color: #B56959\">const aa = 123;</span></span>\n<span class=\"line\"><span style=\"color: #B5695999\">```</span></span></code></pre>,<pre class=\"shiki vitesse-dark\" style=\"background-color: #121212\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #C98A7D99\">```</span><span style=\"color: #C98A7D\">typescript</span></span>\n<span class=\"line\"><span style=\"color: #C98A7D\">const aa = 123;</span></span>\n<span class=\"line\"><span style=\"color: #C98A7D99\">```</span></span></code></pre></div>"

run1(root1)
run2(root2)
if (root1.children[0].value !== snapshotMulti || root2.children[0].value !== snapshotSingle) {
  throw new Error('test failed')
}

console.log('success')