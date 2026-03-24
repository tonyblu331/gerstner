import { debug, createDebugLogger } from '@gerstner/debug'
import { GerstnerCLI } from '@gerstner/cli'

// Test debug library
debug('Playground app started')
const logger = createDebugLogger('playground')
logger('Testing debug functionality')

// Test CLI library
const cli = new GerstnerCLI({ verbose: true })
cli.run('init', 'my-project')

// Test Gerstner CSS system
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')
  if (app) {
    app.innerHTML = `
      <section class="g-shell">
        <div class="g-content">
          <h1 class="g-display g-rhythm-bottom">Gerstner Playground</h1>
          <p class="g-prose g-rhythm">
            Testing the Gerstner layout system with Stride engine.
            Check the console for debug output from the CLI and debug libraries.
          </p>
          <div class="g-stack-loose">
            <button class="g-rhythm">Test Debug</button>
            <button class="g-rhythm">Test CLI</button>
          </div>
        </div>
        <figure class="g-breakout-r">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
            Breakout Content
          </div>
        </figure>
      </section>
    `

    // Add event listeners
    const buttons = app.querySelectorAll('button')
    buttons[0]?.addEventListener('click', () => {
      debug('Debug button clicked!')
      logger('Debug functionality working')
    })

    buttons[1]?.addEventListener('click', () => {
      cli.run('build', '--watch')
    })
  }
})

console.log('Gerstner Playground is running!')
