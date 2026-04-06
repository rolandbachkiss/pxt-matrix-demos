# pxt-matrix-demos

> **Batteries-included demo scenes and a kids-friendly scene controller for NeoPixel matrix panels on the BBC micro:bit.**

This MakeCode extension bundles three ready-to-run visual demos — a spinning 3-D wireframe cube, a bouncing-sprites show, and an analog clock with scrolling text — together with a scene controller that lets anyone switch between custom scenes using just the A and B buttons.

---

## Dependencies

| Extension | Provides |
|---|---|
| [pxt-matrix-core](https://github.com/rolandbachkiss/pxt-matrix-core) | `clear()`, `updateDisplay()`, `centerX/Y()`, `width/height()`, `rgb()` |
| [pxt-matrix-draw](https://github.com/rolandbachkiss/pxt-matrix-draw) | `circle()`, `fillCircle()`, `line()`, `rect()` |
| [pxt-matrix-text](https://github.com/rolandbachkiss/pxt-matrix-text) | `startScroll()`, `updateScroll()`, `drawText()` |
| [pxt-matrix-font-capital](https://github.com/rolandbachkiss/pxt-matrix-font-capital) | Capital-letter bitmap font (auto-registered) |
| [pxt-matrix-font-digits](https://github.com/rolandbachkiss/pxt-matrix-font-digits) | Digit bitmap font (auto-registered) |
| [pxt-matrix-sprites](https://github.com/rolandbachkiss/pxt-matrix-sprites) | `createSprite()`, `addObject()`, `updateObjects()`, `drawObjects()` |
| [pxt-matrix-3d](https://github.com/rolandbachkiss/pxt-matrix-3d) | `createCube()`, `setRotation()`, `drawMesh()` |

---

## Blocks

### Clock group

#### `draw clock face`
Draws two concentric rim rings and 12 hour-marker dots.  
The 12 o'clock marker is gold, the quarter-hour markers (3, 6, 9) are bright blue, and the remaining markers are medium blue.

```blocks
matrixDemos.drawClockFace(16, 13, 13)
```

#### `draw clock hands`
Draws a white minute hand and a gold hour hand.

```blocks
matrixDemos.drawClockHands(10, 30, 16, 13, 13)
```

---

### Scenes group

#### `run spinning cube demo`
Continuously renders a rotating 3-D wireframe cube (size 10) in cyan.  
Uses `matrix3D` for projection and `matrixDraw` for edge rendering.  
**Blocking** — starts a `basic.forever` loop internally.

```blocks
matrixDemos.demoCube()
```

#### `run bouncing sprites demo`
Places a smiley and a ship sprite on the display and bounces them around the edges.  
**Blocking** — starts a `basic.forever` loop internally.

```blocks
matrixDemos.demoSprites()
```

#### `run clock demo`
Shows an analog clock face derived from `input.runningTime()` plus a scrolling "HELLO WORLD" ticker at the bottom.  
**Blocking** — starts a `basic.forever` loop internally.

```blocks
matrixDemos.demoClock()
```

---

### Controller group

The scene controller is the primary kid-friendly entry point.  
Register any number of scenes, then call `run scene controller` — no further code needed.

#### `add scene`
Register a named scene. The `handler` function is called once per frame while that scene is active.

```blocks
matrixDemos.addScene("CUBE", function () {
    matrix3D.setRotation(0, input.runningTime() / 50, input.runningTime() / 70, input.runningTime() / 100)
    matrix3D.drawMesh(0, matrixCore.rgb(0, 200, 255))
})
```

#### `run scene controller`
Starts the controller loop.

```blocks
matrixDemos.runSceneController()
```

**Button mapping:**

| Button | Action |
|---|---|
| **A** | Switch to the previous scene |
| **B** | Switch to the next scene |
| **A + B** | Toggle play / pause |

**Status screen (paused):**  
When paused the display shows the current scene index (`n/total`) in gold, the first four characters of the scene name in blue, and — on panels 32 pixels tall or taller — the hint `AB=RUN` in dim grey.

---

## Quick-start example

```typescript
matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)

matrixDemos.addScene("CUBE", function () {
    matrix3D.setRotation(0, input.runningTime() / 50, input.runningTime() / 70, input.runningTime() / 100)
    matrix3D.drawMesh(0, matrixCore.rgb(0, 200, 255))
})

matrixDemos.addScene("CLOCK", function () {
    const t = input.runningTime() / 1000
    matrixDemos.drawClockFace(matrixCore.centerX(), matrixCore.centerY() - 3, 13)
    matrixDemos.drawClockHands(
        Math.floor(t / 3600) % 12,
        Math.floor(t / 60) % 60,
        matrixCore.centerX(), matrixCore.centerY() - 3, 13
    )
})

matrixDemos.runSceneController()
```

Press **B** to jump to the clock, **A** to go back to the cube, and **A + B** to pause and read the status screen.

---

## License

MIT © Roland Bach Kiss
