// Integrationstests ohne zusätzliche Packages über das Chrome DevTools Protocol.
// Voraussetzung: laufender Vite-Devserver; Edge oder BROWSER_PATH zu Chromium.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5173'
const port = 9337
const output = resolve('test-results.local')
mkdirSync(output, { recursive: true })
const browserPath = process.env.BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const profile = resolve(tmpdir(), `insight-fitness-browser-test-${process.pid}`)
let browser, socket, counter = 0
const pending = new Map()
const failures = []
const passed = []
const pause = (ms) => new Promise((done) => setTimeout(done, ms))
async function waitFor(fn, label) {
  for (let i = 0; i < 100; i++) {
    try { if (await fn()) return } catch { /* Navigation kann den JS-Kontext kurz ersetzen. */ }
    await pause(100)
  }
  throw new Error(`Timeout: ${label}`)
}
function send(method, params = {}) {
  return new Promise((done, reject) => {
    const id = ++counter
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 15000)
    pending.set(id, { done: (value) => { clearTimeout(timeout); done(value) }, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
  return result.result.value
}
async function startBrowser() {
  browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' })
  let spawnError
  browser.on('error', (error) => { spawnError = error })
  await waitFor(async () => {
    if (spawnError) throw spawnError
    return (await fetch(`http://127.0.0.1:${port}/json/version`)).ok
  }, `Browserstart ${spawnError?.message || ''}`)
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, reject) => { socket.onopen = done; socket.onerror = reject })
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (message.id) {
      const request = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) request?.reject(new Error(message.error.message))
      else request?.done(message.result)
    } else if (message.method === 'Runtime.exceptionThrown') failures.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
    else if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) {
      failures.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '))
    }
  }
  await send('Runtime.enable')
  await send('Page.enable')
}
async function closeBrowser() {
  const closed = new Promise((done) => browser.once('exit', done))
  await send('Browser.close').catch(() => {})
  socket.close()
  await Promise.race([closed, pause(5000)])
}
async function navigate(path, text) {
  await send('Page.navigate', { url: origin + path })
  await waitFor(() => evaluate(`location.pathname === ${JSON.stringify(path)} && document.querySelector('h1') && document.body.innerText.toLocaleLowerCase().includes(${JSON.stringify(text.toLocaleLowerCase())})`), path)
}
async function click(text, selector = 'button, a') {
  await evaluate(`(() => { const node = [...document.querySelectorAll(${JSON.stringify(selector)})].find(node => node.textContent.trim() === ${JSON.stringify(text)}); if (!node) throw new Error('Element fehlt: ' + ${JSON.stringify(text)}); node.click() })()`)
  await pause(100)
}
async function set(selector, value) {
  await evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)}); if (!node) throw new Error('Feld fehlt: ' + ${JSON.stringify(selector)}); node.value = ${JSON.stringify(value)}; node.dispatchEvent(new Event('input', { bubbles: true })); node.dispatchEvent(new Event('change', { bubbles: true })) })()`)
  await pause(50)
}
async function addExercise(id) { await set('.exercise-selector select', String(id)); await click('Übung hinzufügen') }
async function check(label, expression) { await waitFor(() => evaluate(expression), label); assert.equal(await evaluate(expression), true, label); passed.push(label); console.log(`PASS ${label}`) }
const key = 'insight-fitness.trainings.v1'

try {
  await startBrowser()
  await navigate('/trainings', 'Meine Trainings')
  await evaluate('localStorage.clear()')
  await navigate('/trainings', 'Meine Trainings')
  await check('12 synthetische Trainings', `document.querySelectorAll('.card').length === 12`)
  await click('Neues Training')
  await check('Named Route und aktive Navigation', `location.pathname === '/trainings/new' && document.querySelector('nav a.router-link-active').textContent === 'Trainingseinheiten'`)
  await click('Training speichern')
  await check('Pflichtfelder und leere Übungsliste', `document.querySelectorAll('[aria-invalid="true"]').length === 2 && document.body.innerText.includes('mindestens eine Übung')`)
  await set('input[type=date]', '2026-09-22')
  await set('.form-grid select', 'Push')
  await set('.form-grid input[type=number]', '60')
  await addExercise(1)
  await check('Leerer Startsatz und Duplikatsperre', `document.querySelectorAll('.set-row').length === 1 && document.querySelector('.set-row input').value === '' && ![...document.querySelectorAll('.exercise-selector option')].some(o => o.value === '1')`)
  await click('Satz hinzufügen'); await click('Satz hinzufügen')
  for (const [index, weight, reps] of [[0, 80, 10], [1, 85, 8], [2, 85, 7]]) {
    await set(`#exercise-1-set-${index}-weight`, String(weight))
    await set(`#exercise-1-set-${index}-reps`, String(reps))
  }
  await addExercise(5)
  await evaluate(`document.querySelectorAll('.exercise-editor')[1].querySelectorAll('button')[2].click()`)
  await pause(100)
  await addExercise(5)
  await evaluate(`document.querySelectorAll('.exercise-editor')[1].querySelector('.set-row button').click()`)
  await click('Training speichern')
  await check('Letzten Satz entfernen blockiert Speichern', `location.pathname === '/trainings/new' && document.body.innerText.includes('mindestens einen gültigen Satz')`)
  await evaluate(`document.querySelectorAll('.exercise-editor')[1].querySelector(':scope > button').click()`)
  await pause(100)
  await set('#exercise-5-set-0-weight', '16'); await set('#exercise-5-set-0-reps', '10')
  await evaluate(`document.querySelectorAll('.exercise-editor')[1].querySelector('button').click()`)
  await pause(100)
  await check('Übungen entfernen, erneut hinzufügen und umsortieren', `document.querySelector('.exercise-editor h3').textContent.includes('Schulterdrücken')`)
  await set('#exercise-5-set-0-weight', '-1'); await set('#exercise-5-set-0-reps', '1.5')
  await click('Training speichern')
  await check('Negative Gewichte und gebrochene Wiederholungen blockiert', `location.pathname === '/trainings/new' && document.querySelectorAll('.set-row [aria-invalid="true"]').length === 2`)
  await set('#exercise-5-set-0-weight', '16'); await set('#exercise-5-set-0-reps', '10')
  await evaluate(`window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Quota', 'QuotaExceededError') }`)
  await click('Training speichern')
  await check('Speicherfehler erhält Formular', `document.body.innerText.includes('Speichern fehlgeschlagen') && document.querySelector('#exercise-1-set-0-weight').value === '80'`)
  await evaluate(`Storage.prototype.setItem = window.originalSetItem`)
  await click('Training speichern')
  await waitFor(() => evaluate(`location.pathname === '/trainings/13'`), 'Weiterleitung nach Speichern')
  await check('Detailseite zeigt Reihenfolge, Sets und Werte', `document.body.innerText.includes('85 kg × 7') && document.body.innerText.includes('16 kg × 10') && document.querySelector('.exercise-card h3').textContent === 'Schulterdrücken'`)
  await click('Zurück zu Trainings')
  await check('Neues Training in Übersicht', `document.querySelectorAll('.card').length === 13`)
  await navigate('/trainings/13', '85 kg × 7')
  await check('Direkter Detail-Reload', `document.body.innerText.includes('60 Minuten')`)
  await closeBrowser(); await startBrowser()
  await navigate('/trainings/13', '85 kg × 7')
  passed.push('Persistenz nach echtem Browser-Neustart'); console.log('PASS Persistenz nach echtem Browser-Neustart')
  await click('Übung ansehen →')
  await check('Training zu Übungsdetail', `location.pathname === '/exercises/5'`)
  await evaluate(`window.previousExerciseImage = document.querySelector('figure img').src`)
  await click('Details')
  await check('Alternative mit reaktiv gewechseltem Bild', `location.pathname === '/exercises/6' && document.querySelector('figure img').alt.startsWith('Seitheben:') && document.querySelector('figure img').src !== window.previousExerciseImage`)
  await evaluate('history.back()'); await pause(200)
  await check('Browser zurück', `location.pathname === '/exercises/5'`)
  await evaluate('history.forward()'); await pause(200)
  await check('Browser vorwärts', `location.pathname === '/exercises/6'`)
  for (const [path, text] of [['/trainings/99999', 'Training nicht gefunden.'], ['/trainings/test', 'Training nicht gefunden.'], ['/exercises/99999', 'Übung nicht gefunden.'], ['/exercises/test', 'Übung nicht gefunden.'], ['/unknown', '404'], ['/trainings/1', 'Training Detail'], ['/exercises/1', 'Bankdrücken']]) {
    await navigate(path, text); passed.push(`Direkte URL ${path}`)
  }
  await send('Page.navigate', { url: origin + '/' })
  await waitFor(() => evaluate(`location.pathname === '/trainings'`), 'Root-Redirect')
  passed.push('Root-Redirect')
  await navigate('/exercises', 'Übungsübersicht')
  await set('#exercise-search', 'Bankdrücken')
  await check('Übungssuche', `document.querySelectorAll('.card').length === 2`)
  await click('Filter zurücksetzen')
  await check('Filter zurücksetzen', `document.querySelectorAll('.card').length === 20`)

  // Datenmodell, Referenzen und Fehlerfälle mit den echten, von Vite geladenen Modulen.
  const dataChecks = await evaluate(`(async () => {
    const { exercises } = await import('/src/data/exercises.ts')
    const { trainings } = await import('/src/data/trainings.ts')
    const { validateTraining, isTraining } = await import('/src/utils/trainingValidation.ts')
    const { useTrainingsStore } = await import('/src/stores/trainings.ts')
    const { getTrainingById, getExerciseById, getExerciseAlternatives } = await import('/src/utils/data.ts')
    const store = useTrainingsStore()
    const ensure = (condition, label) => { if (!condition) throw new Error(label) }
    ensure(new Set(exercises.map(e => e.id)).size === exercises.length, 'Exercise-IDs')
    ensure(new Set(trainings.map(t => t.id)).size === trainings.length, 'Training-IDs')
    ensure(exercises.every(e => e.alternatives.every(id => id !== e.id && getExerciseById(id))), 'Alternativen')
    ensure(trainings.every(isTraining), 'Synthetische Daten und Sets')
    ensure(getTrainingById('test') === undefined && getExerciseById(99999) === undefined, 'Utility-IDs')
    ensure(getExerciseAlternatives({ ...exercises[0], alternatives: [1, 2, 2, 99999] }).length === 1, 'Robuste Alternativen')
    const original = localStorage.getItem('${key}')
    for (const raw of ['{broken', '{}', 'null', '[null, 7, {}]']) {
      localStorage.setItem('${key}', raw); store.loadTrainings(); ensure(store.trainings.length === 12, 'Beschädigte Daten')
    }
    const valid = { ...trainings[0], id: 30 }
    localStorage.setItem('${key}', JSON.stringify([valid, valid, trainings[0], { ...valid, id: 31, exercises: [{ exerciseId: 99999, sets: [{ weight: 1, reps: 1 }] }] }]))
    store.loadTrainings(); ensure(store.trainings.length === 13, 'Doppelte IDs und ungültige Referenzen')
    for (const changed of [{ date: '2026-02-30' }, { duration: 0 }, { duration: Infinity }, { type: 'invalid' }, { exercises: [] }, { exercises: [trainings[0].exercises[0], trainings[0].exercises[0]] }, { exercises: [{ exerciseId: 1, sets: [] }] }, { exercises: [{ exerciseId: 1, sets: [{ weight: '', reps: 0 }] }] }]) {
      ensure(Object.keys(validateTraining({ ...valid, ...changed })).length > 0, 'Validierung ' + JSON.stringify(changed))
    }
    const [a, b] = await Promise.all([store.createTraining(trainings[0]), store.createTraining(trainings[0])])
    ensure(a.id === 31 && b.id === 32 && getTrainingById(32), 'Fortlaufende IDs und paralleles Speichern')
    localStorage.setItem('${key}', original); store.loadTrainings()
    const images = await Promise.all(exercises.map(e => new Promise(resolve => { const image = new Image(); image.onload = () => resolve(image.naturalWidth > 0); image.onerror = () => resolve(false); image.src = e.image })))
    ensure(images.every(Boolean), 'Alle 20 Bilder laden')
    return true
  })()`)
  assert.equal(dataChecks, true)
  passed.push('Datenintegrität, Storage-Fehlerfälle, Validierung, IDs und alle 20 Bilder'); console.log('PASS Datenintegrität, Storage-Fehlerfälle, Validierung, IDs und alle 20 Bilder')

  await navigate('/exercises/1', 'Bankdrücken')
  await evaluate(`document.querySelector('figure img').src = '/missing-exercise-image.svg'`)
  await waitFor(() => evaluate(`!!document.querySelector('.exercise-image__fallback')`), 'Falscher Bildpfad')
  await check('Bild-Ladefehler zeigt Fallback', `!!document.querySelector('.exercise-image__fallback') && !document.querySelector('figure img')`)
  await evaluate(`(async () => { const { exercises } = await import('/src/data/exercises.ts'); window.originalImage = exercises[0].image; exercises[0].image = undefined; })()`)
  await click('Zurück zu Übungen'); await click('Details')
  await check('Fehlendes Bild zeigt Fallback', `!!document.querySelector('.exercise-image__fallback')`)
  await evaluate(`(async () => { const { exercises } = await import('/src/data/exercises.ts'); exercises[0].image = window.originalImage; })()`)

  for (const width of [360, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 500 })
    for (const [path, text] of [['/trainings', 'Meine Trainings'], ['/trainings/new', 'Neues Training'], ['/trainings/13', 'Training Detail'], ['/exercises', 'Übungsübersicht'], ['/exercises/1', 'Bankdrücken']]) {
      await navigate(path, text)
      if (path === '/trainings/new') { await addExercise(1); await click('Satz hinzufügen') }
      await check(`Kein horizontaler Overflow: ${width}px ${path}`, `document.documentElement.scrollWidth <= innerWidth`)
      {
        // Für Ganzseiten-Screenshots auch Bilder unterhalb des sichtbaren Bereichs laden.
        await evaluate(`document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager' })`)
        await waitFor(() => evaluate(`[...document.images].every(image => image.complete)`), 'Screenshot-Bilder')
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        writeFileSync(resolve(output, `${width}-${path.replaceAll('/', '_')}.png`), Buffer.from(screenshot.data, 'base64'))
      }
    }
  }
  assert.deepEqual(failures, [], 'Keine Vue-Warnings oder JavaScript-Console-Errors')
  passed.push('Keine Vue-Warnings oder JavaScript-Console-Errors')
  writeFileSync(resolve(output, 'results.json'), JSON.stringify({ passed, failures }, null, 2))
  console.log(`\n${passed.length} Prüfungen erfolgreich. Screenshots: ${output}`)
} catch (error) {
  console.error('Browser diagnostics:', failures, await evaluate('document.body.innerText').catch(() => 'Kein JS-Kontext'))
  throw error
} finally {
  if (socket?.readyState === WebSocket.OPEN) await closeBrowser()
  else browser?.kill()
}
