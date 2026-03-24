console.log('boot')

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  if (app) {
    app.innerHTML = '<div class="app"><h1>Hello World</h1></div>'
  }
})
