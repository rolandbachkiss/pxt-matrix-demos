// test.ts — pxt-matrix-demos visual hardware test
//
// Tests all demo functions in sequence. The final forever-loop runs the
// scene controller (Button A = prev, Button B = next, A+B = pause/resume).
//
// CP 0 — init
// CP 1 — clock face only (static)
// CP 2 — clock hands at 4 sample times
// CP 3 — 60-frame spinning cube (non-blocking sample)
// CP 4 — 80-frame bouncing sprites (non-blocking sample)
// CP 5 — scene controller (forever loop — never returns)

function cp(n: number): void {
    const cx = n % 5
    const cy = Math.idiv(n, 5)
    led.plot(cx, cy)
}

// ─── CP 0 — init ────────────────────────────────────────────────────────────
cp(0)
matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)
matrixCore.setBrightness(80)
matrixCore.clear()
matrixCore.updateDisplay()

const W = matrixCore.width()
const H = matrixCore.height()
const CX = W >> 1
const CY = (H >> 1) - 3

// ─── CP 1 — static clock face ────────────────────────────────────────────────
cp(1)
matrixCore.clear()
matrixDemos.drawClockFace(CX, CY, 13)
matrixCore.updateDisplay()
basic.pause(1500)

// ─── CP 2 — clock hands at sample times ─────────────────────────────────────
cp(2)
const sampleH = [3, 6, 9, 0]
const sampleM = [0, 30, 45, 0]
for (let i = 0; i < 4; i++) {
    matrixCore.clear()
    matrixDemos.drawClockFace(CX, CY, 13)
    matrixDemos.drawClockHands(sampleH[i], sampleM[i], CX, CY, 13)
    matrixCore.updateDisplay()
    basic.pause(800)
}

// ─── CP 3 — spinning cube (60 frames) ───────────────────────────────────────
cp(3)
const cubeId = matrix3D.createCube(10)
for (let frame = 0; frame < 60; frame++) {
    matrixCore.clear()
    matrix3D.setRotation(cubeId, frame * 2, frame * 3, frame)
    matrix3D.drawMesh(cubeId, matrixCore.rgb(0, 200, 255))
    matrixCore.updateDisplay()
    basic.pause(70)
}

// ─── CP 4 — bouncing sprites (80 frames) ─────────────────────────────────────
cp(4)
const smiley = matrixSprites.createSprite(
    matrixSprites.SMILEY_W, matrixSprites.SMILEY_H, matrixSprites.SMILEY_HEX
)
const ship = matrixSprites.createSprite(
    matrixSprites.SHIP_W, matrixSprites.SHIP_H, matrixSprites.SHIP_HEX
)
const dObj1 = matrixSprites.addObject(smiley, 2, 2, 1, 1)
const dObj2 = matrixSprites.addObject(ship, W - matrixSprites.SHIP_W - 2, H - matrixSprites.SHIP_H - 2, -1, -1)

for (let i = 0; i < 80; i++) {
    matrixCore.clear()
    matrixSprites.updateObjects()
    matrixSprites.drawObjects()
    matrixCore.updateDisplay()
    basic.pause(70)
}
matrixCore.clear()
matrixCore.updateDisplay()

// ─── CP 5 — scene controller (runs forever via button input) ─────────────────
cp(5)

// Scene 1: Spinning cube
let _sceneFrame = 0
matrixDemos.addScene("CUBE", function () {
    matrix3D.setRotation(cubeId, _sceneFrame * 2, _sceneFrame * 3, _sceneFrame)
    matrix3D.drawMesh(cubeId, matrixCore.rgb(0, 200, 255))
    _sceneFrame++
})

// Scene 2: Analog clock
matrixDemos.addScene("CLK ", function () {
    const t = input.runningTime() / 1000
    const h = Math.idiv(Math.idiv(t, 3600), 1) % 12
    const m = Math.idiv(t, 60) % 60
    matrixDemos.drawClockFace(CX, CY, 13)
    matrixDemos.drawClockHands(h, m, CX, CY, 13)
})

// Scene 3: Scrolling text
let _scrollReady = false
matrixDemos.addScene("TXT ", function () {
    if (!_scrollReady) {
        matrixText.startScroll("MATRIX DEMO", 12, matrixCore.rgb(255, 140, 0), 2)
        _scrollReady = true
    }
    matrixText.updateScroll()
})

// Scene 4: Bouncing sprites with trails
matrixDemos.addScene("SPRT", function () {
    matrixSprites.updateObjects()
    matrixSprites.drawObjects()
})

// Start: press A+B to start, A/B to switch scenes
matrixDemos.runSceneController()
