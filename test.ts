// pxt-matrix-demos — example test / usage
//
// Wire a NeoPixel matrix (e.g. two 16×16 panels side-by-side → 32×16) to P0,
// then call runSceneController().  Press A/B to switch scenes, A+B to play/pause.

matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)

// ── Scene 1: spinning 3-D cube ──────────────────────────────────────────────
matrixDemos.addScene("CUBE", function () {
    matrix3D.setRotation(
        0,
        input.runningTime() / 50,
        input.runningTime() / 70,
        input.runningTime() / 100
    )
    matrix3D.drawMesh(0, matrixCore.rgb(0, 200, 255))
})

// ── Scene 2: analog clock ────────────────────────────────────────────────────
matrixDemos.addScene("CLOCK", function () {
    const t = input.runningTime() / 1000   // elapsed seconds
    const h = Math.floor(t / 3600) % 12
    const m = Math.floor(t / 60) % 60

    matrixDemos.drawClockFace(
        matrixCore.centerX(),
        matrixCore.centerY() - 3,
        13
    )
    matrixDemos.drawClockHands(
        h, m,
        matrixCore.centerX(),
        matrixCore.centerY() - 3,
        13
    )
})

// ── Launch the controller ────────────────────────────────────────────────────
matrixDemos.runSceneController()
