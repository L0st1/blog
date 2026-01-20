import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const {
    public: { mathjaxMode, mathjaxOutput }
  } = useRuntimeConfig()

  if (mathjaxMode !== 'client') return

  const win = window as any
  const output = (mathjaxOutput || 'svg').toLowerCase()

  const ensureLoader = () => new Promise<void>((resolve) => {
    if (win.MathJax && win.MathJax.typesetPromise) return resolve()

    const baseConfig: any = {
      startup: { typeset: false },
      tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']]
      },
      options: {
        // 只处理 .math-tex 容器内的公式
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        processHtmlClass: 'math-tex'
      }
    }

    if (output === 'chtml') {
      baseConfig.chtml = {
        displayAlign: 'center',
        displayIndent: '0'
      }
    } else {
      baseConfig.svg = {
        scale: 1,
        minScale: 1,
        exFactor: 0.5,
        fontCache: 'local',
        displayAlign: 'center',
        displayIndent: '0'
      }
    }

    win.MathJax = baseConfig

    const script = document.createElement('script')
    script.src = output === 'chtml'
      ? 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'
      : 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })

  const typeset = async () => {
    document.body.classList.add('mathjax-loading')
    document.body.classList.remove('mathjax-ready')

    await ensureLoader()
    const MathJax = win.MathJax
    
    // 找到所有 .math-tex 容器进行排版
    const elements = document.querySelectorAll('.math-tex')
    if (elements.length > 0) {
      await MathJax.typesetPromise(Array.from(elements))
    }

    document.body.classList.remove('mathjax-loading')
    document.body.classList.add('mathjax-ready')
  }

  nuxtApp.hook('app:mounted', () => {
    requestAnimationFrame(() => { void typeset() })
  })

  const router = useRouter()
  router.afterEach(() => {
    // 等待 DOM 更新后再排版
    setTimeout(() => { void typeset() }, 100)
  })
})
