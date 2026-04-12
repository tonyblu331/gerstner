export type Route = {
  path: string
  label: string
  render: () => string
}

let routes: Route[] = []
let mountEl: HTMLElement | null = null
let navEl: HTMLElement | null = null

export function initRouter(el: HTMLElement, nav: HTMLElement, routeList: Route[]) {
  mountEl = el
  navEl = nav
  routes = routeList

  window.addEventListener('hashchange', handleRoute)
  handleRoute()
}

function currentPath(): string {
  const hash = window.location.hash
  return hash.startsWith('#/') ? hash.slice(1) : '/'
}

function handleRoute() {
  const path = currentPath()
  const route = routes.find((r) => r.path === path) ?? routes[0]

  if (!route) return

  if (mountEl) mountEl.innerHTML = route.render()
  window.scrollTo({ top: 0, behavior: 'instant' })
  updateNav(route.path)
}

function updateNav(activePath: string) {
  if (!navEl) return
  navEl.querySelectorAll<HTMLAnchorElement>('.bottom-nav__link').forEach((a) => {
    const isCurrent = a.dataset.path === activePath
    a.setAttribute('aria-current', isCurrent ? 'page' : 'false')
  })
}
