// Eigene, editierbare SVG-Skizzen. Keine fremden Bilddateien oder Bildrechte nötig.
// Koordinaten beschreiben jeweils zwei Ansichten derselben Übung.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const line = (d, color = '#2456d2', width = 9) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`
const equipment = (d) => line(d, '#8b98ad', 6)
const head = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#e8eefb" stroke="#203455" stroke-width="5"/>`
const body = (x, y, torso, limbs) => head(x, y) + line(torso, '#2456d2', 17) + line(limbs, '#203455', 8)
const dumbbell = (x, y) => line(`M${x - 12} ${y}h24 M${x - 12} ${y - 7}v14 M${x + 12} ${y - 7}v14`, '#2456d2', 6)
const bar = (x, y) => line(`M${x - 40} ${y}h80 M${x - 30} ${y - 13}v26 M${x + 30} ${y - 13}v26`, '#2456d2', 6)
const bench = equipment('M55 228H220 M75 228V285 M200 228V285')
const seat = equipment('M115 100V222H190 M135 222V286 M190 222V286')
const tower = equipment('M65 290V40H250 M65 290H110 M250 40V75')
const mat = equipment('M45 292H285')
const standingLegs = 'M160 190L140 285H122 M160 190L181 285H199'
const standing = (arms, tools = '') => body(160, 79, 'M160 101V190', `${standingLegs} ${arms}`) + tools
const seated = (arms, tools = '') => seat + body(151, 90, 'M151 112L153 210', `M153 210H214L223 284H247 ${arms}`) + tools
const benchPose = (arms, tools = '') => bench + body(77, 206, 'M97 212H183', `M183 212L221 237L225 286H246 ${arms}`) + tools

const diagrams = [
  ['bench-press', benchPose('M110 212L139 229L145 180', bar(145, 180)), benchPose('M110 212L113 158L115 110', bar(115, 110))],
  ['dumbbell-bench-press', benchPose('M110 212L146 231L151 185 M115 207L96 177', dumbbell(151, 185) + dumbbell(96, 177)), benchPose('M110 212L112 110 M115 207L149 116', dumbbell(112, 110) + dumbbell(149, 116))],
  ['chest-press', seated('M151 130L176 173L190 132', tower + equipment('M190 132V185')), seated('M151 130L245 133', tower + equipment('M245 133V185'))],
  ['cable-fly', standing('M160 120L105 133L70 145 M160 120L213 133L250 145', equipment('M40 65V290 M280 65V290 M40 100L70 145 M280 100L250 145')), standing('M160 120L130 154L156 172 M160 120L191 154L164 172', equipment('M40 65V290 M280 65V290 M40 100L156 172 M280 100L164 172'))],
  ['shoulder-press', standing('M160 120L111 133L107 91 M160 120L209 133L213 91', dumbbell(107, 91) + dumbbell(213, 91)), standing('M160 120L119 43 M160 120L201 43', dumbbell(119, 43) + dumbbell(201, 43))],
  ['lateral-raise', standing('M160 120L130 198 M160 120L190 198', dumbbell(130, 198) + dumbbell(190, 198)), standing('M160 120L110 117L72 126 M160 120L210 117L248 126', dumbbell(72, 126) + dumbbell(248, 126))],
  ['pull-up', equipment('M65 50H255') + body(160, 132, 'M160 153V224', 'M160 163L106 50 M160 163L214 50 M160 224L137 278 M160 224L183 278'), equipment('M65 50H255') + body(160, 47, 'M160 69V148', 'M160 81L102 111L106 50 M160 81L218 111L214 50 M160 148L134 229L162 250 M160 148L188 229L216 250')],
  ['lat-pulldown', tower + seated('M151 129L139 59 M151 129L193 59', bar(166, 59) + equipment('M166 59V40 M185 226H220')), tower + seated('M151 129L125 176L136 136 M151 129L218 168L196 136', bar(166, 136) + equipment('M166 136V40 M185 226H220'))],
  ['cable-row', equipment('M45 238H154 M75 238V286 M272 235L289 200 M295 95V287 M295 150L245 163') + body(100, 109, 'M100 131L116 225', 'M116 225L209 246L273 213 M100 149L245 163'), equipment('M45 238H154 M75 238V286 M272 235L289 200 M295 95V287 M295 150L138 183') + body(100, 109, 'M100 131L116 225', 'M116 225L209 246L273 213 M100 149L87 197L138 183')],
  ['biceps-curl', standing('M160 120L133 159L126 208 M160 120L187 159L194 208', dumbbell(126, 208) + dumbbell(194, 208)), standing('M160 120L133 159L112 112 M160 120L187 159L208 112', dumbbell(112, 112) + dumbbell(208, 112))],
  ['triceps-pushdown', tower + standing('M160 120L178 158L221 126', equipment('M250 75L221 126')), tower + standing('M160 120L178 158L201 204', equipment('M250 75L201 204'))],
  ['squat', equipment('M75 285V65 M75 110H100') + standing('M160 119L195 144L197 105', bar(160, 107)), equipment('M75 285V65 M75 110H100') + body(178, 141, 'M169 162L128 224', 'M128 224L203 232L168 285H202 M162 172L197 190L201 166') + bar(169, 163)],
  ['leg-press', equipment('M75 165L126 237H166 M105 207L253 76 M118 223L275 95 M233 54L280 105') + body(88, 155, 'M103 174L135 219', 'M135 219L177 158L245 90 M103 186L113 220'), equipment('M75 165L126 237H166 M105 207L279 49 M118 223L300 68 M259 27L306 78') + body(88, 155, 'M103 174L135 219', 'M135 219L204 145L272 65 M103 186L113 220')],
  ['leg-extension', seated('M151 130L178 196', equipment('M207 268H238')), seat + body(151, 90, 'M151 112L153 210', 'M153 210L214 210L285 187 M151 130L178 196') + equipment('M263 181L277 204')],
  ['leg-curl', seat + body(151, 90, 'M151 112L153 210', 'M153 210L214 210L285 213 M151 130L178 196') + equipment('M266 220H290'), seat + body(151, 90, 'M151 112L153 210', 'M153 210L214 210L184 275H205 M151 130L178 196') + equipment('M174 279H205')],
  ['romanian-deadlift', standing('M160 120L171 208', bar(171, 208)), body(224, 136, 'M205 151L139 190', 'M139 190L153 238L142 285H164 M196 160L211 246') + bar(211, 246)],
  ['calf-raise', standing('M160 120L196 172') + equipment('M135 296H208V306H135Z'), body(160, 64, 'M160 86V175', 'M160 175L150 265L167 284 M160 175L180 265L197 284 M160 105L196 157') + equipment('M135 296H208V306H135Z')],
  ['plank', mat + body(91, 194, 'M108 207L194 232', 'M112 211L110 282H72 M194 232L264 276L265 286'), mat + body(91, 194, 'M108 207L194 232', 'M112 211L110 282H72 M194 232L264 276L265 286')],
  ['crunch', mat + body(64, 265, 'M85 276L165 279', 'M165 279L214 224L256 284H272 M93 273L121 251L150 270'), mat + body(86, 222, 'M104 239L165 279', 'M165 279L214 224L256 284H272 M111 244L135 228L154 253')],
  ['push-up', mat + body(80, 232, 'M97 245L187 258', 'M105 247L132 260L107 285H80 M187 258L262 277L271 286'), mat + body(80, 173, 'M97 191L187 223', 'M105 194L107 285H80 M187 223L262 277L271 286')],
]

const output = new URL('../src/assets/exercises/', import.meta.url)
mkdirSync(output, { recursive: true })
for (const [name, start, end] of diagrams) {
  const arrow = name === 'plank' ? '<circle cx="360" cy="177" r="15" fill="none" stroke="#2456d2" stroke-width="3"/><path d="M355 170v14 M365 170v14" stroke="#2456d2" stroke-width="3"/>' : line('M341 177H379 M370 168L379 177L370 186', '#2456d2', 3)
  writeFileSync(new URL(`${name}.svg`, output), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" width="720" height="360"><rect width="720" height="360" rx="20" fill="#e8eefb"/><rect x="16" y="16" width="310" height="328" rx="16" fill="#fff"/><rect x="394" y="16" width="310" height="328" rx="16" fill="#fff"/><g transform="translate(17 10)">${start}</g><g transform="translate(393 10)">${end}</g>${arrow}</svg>\n`)
}

// Statische Imports lassen Vite alle Bildpfade beim Build prüfen.
const dataFile = new URL('../src/data/exercises.ts', import.meta.url)
let data = readFileSync(dataFile, 'utf8').replace(/^import exerciseImage\d+ from .+\n/gm, '').replace(/    image: exerciseImage\d+,\n/g, '')
const imports = diagrams.map(([name], index) => `import exerciseImage${index + 1} from '@/assets/exercises/${name}.svg'`).join('\n')
data = data.replace(/(    id: (\d+),[^\n]*\n)/g, '$1    image: exerciseImage$2,\n')
writeFileSync(dataFile, `${imports}\n${data}`)
console.log(`Generated ${diagrams.length} exercise diagrams in ${fileURLToPath(output)}`)
