import './index.css'
import 'dialkit/styles.css'
import '@gerstner/debug/debug.css'
import { initGerstnerDebug } from '@gerstner/debug'
import { initRouter } from './router'
import * as showcase from './pages/showcase'
import * as article from './pages/article'
import * as realEstate from './pages/real-estate'
import * as nyTimes from './pages/ny-times'

const app = document.querySelector<HTMLDivElement>('#app')!

const navHTML = `
  <nav class="bottom-nav" aria-label="Demo pages">
    <a class="bottom-nav__link" data-path="/" href="#/" aria-current="page">
      <span class="bottom-nav__icon" aria-hidden="true">&#9638;</span>
      <span class="g-ui bottom-nav__label">Real Estate</span>
    </a>
    <a class="bottom-nav__link" data-path="/showcase" href="#/showcase" aria-current="false">
      <span class="bottom-nav__icon" aria-hidden="true">&#9632;</span>
      <span class="g-ui bottom-nav__label">Showcase</span>
    </a>
    <a class="bottom-nav__link" data-path="/article" href="#/article" aria-current="false">
      <span class="bottom-nav__icon" aria-hidden="true">&#9641;</span>
      <span class="g-ui bottom-nav__label">Article</span>
    </a>
    <a class="bottom-nav__link" data-path="/ny-times" href="#/ny-times" aria-current="false">
      <span class="bottom-nav__icon" aria-hidden="true">&#9645;</span>
      <span class="g-ui bottom-nav__label">NY Times</span>
    </a>
  </nav>
`

app.innerHTML = `
  <div id="page-mount" class="page-mount"></div>
  ${navHTML}
`

const mount = app.querySelector<HTMLElement>('#page-mount')!
const nav = app.querySelector<HTMLElement>('.bottom-nav')!

initRouter(mount, nav, [
  { path: '/', label: 'Real Estate', render: realEstate.render },
  { path: '/real-estate', label: 'Real Estate', render: realEstate.render },
  { path: '/showcase', label: 'Showcase', render: showcase.render },
  { path: '/article', label: 'Article', render: article.render },
  { path: '/ny-times', label: 'NY Times', render: nyTimes.render },
])

initGerstnerDebug({
  defaultOpen: true,
  initial: {
    layers: {
      cols: true,
      baseline: true,
      rhythm: true,
      zones: true,
    },
  },
})
