/**
 * matrix-demos — Pre-built demo scenes and scene controller for NeoPixel matrix panels.
 *
 * Depends on: matrixCore, matrixDraw, matrixText, matrixSprites, matrix3D
 */

//% color="#e03030" icon="\uf005" weight=70
//% groups='["Clock", "Scenes", "Controller"]'
namespace matrixDemos {

    // -------------------------------------------------------------------------
    // Internal state — cube
    // -------------------------------------------------------------------------
    let _cubeId = -1

    // -------------------------------------------------------------------------
    // Internal state — sprites demo
    // -------------------------------------------------------------------------
    let _spritesReady = false

    // -------------------------------------------------------------------------
    // Internal state — scene controller
    // -------------------------------------------------------------------------
    let _scenes: (() => void)[] = []
    let _sceneNames: string[] = []
    let _currentScene = 0
    let _running = false
    let _sceneCount = 0

    // =========================================================================
    // CLOCK
    // =========================================================================

    /**
     * Draw a clock face with hour markers at the given position and radius.
     * @param cx center x, eg: 16
     * @param cy center y, eg: 13
     * @param r  radius,   eg: 13
     */
    //% blockId=matrix_demos_clock_face
    //% block="draw clock face center x $cx y $cy radius $r"
    //% cx.defl=16 cy.defl=13 r.defl=13
    //% group="Clock" weight=100
    export function drawClockFace(cx: number, cy: number, r: number): void {
        // Outer and inner rim
        const rimColor = matrixCore.rgb(0, 0, 40)
        matrixDraw.circle(cx, cy, r, rimColor)
        matrixDraw.circle(cx, cy, r - 1, rimColor)

        // 12 hour-marker dots
        for (let hour = 0; hour < 12; hour++) {
            const angle = hour * 30 - 90   // 12 o'clock at top

            const mx = cx + (matrix3D.cosDeg1000(angle) * (r - 2)) / 1000
            const my = cy + (matrix3D.sinDeg1000(angle) * (r - 2)) / 1000

            let markerColor: number
            if (hour === 0) {
                markerColor = matrixCore.rgb(220, 180, 0)   // 12 o'clock — gold
            } else if (hour === 3 || hour === 6 || hour === 9) {
                markerColor = matrixCore.rgb(0, 0, 180)     // quarter hours — bright blue
            } else {
                markerColor = matrixCore.rgb(0, 0, 120)     // regular hours — medium blue
            }

            matrixDraw.fillCircle(Math.round(mx), Math.round(my), 1, markerColor)
        }
    }

    /**
     * Draw hour and minute hands on the clock face.
     * @param h  hour   (0–23)
     * @param m  minute (0–59)
     * @param cx center x
     * @param cy center y
     * @param r  radius
     */
    //% blockId=matrix_demos_clock_hands
    //% block="draw clock hands hour $h minute $m center x $cx y $cy radius $r"
    //% group="Clock" weight=90
    export function drawClockHands(h: number, m: number, cx: number, cy: number, r: number): void {
        // --- Minute hand ---
        const minuteAngle = m * 6 - 90
        const mx = cx + (matrix3D.cosDeg1000(minuteAngle) * (r - 2)) / 1000
        const my = cy + (matrix3D.sinDeg1000(minuteAngle) * (r - 2)) / 1000
        matrixDraw.line(cx, cy, Math.round(mx), Math.round(my), matrixCore.rgb(200, 200, 200))

        // --- Hour hand ---
        const hourAngle = (h % 12) * 30 + m / 2 - 90
        const hx = cx + (matrix3D.cosDeg1000(hourAngle) * (r - 4)) / 1000
        const hy = cy + (matrix3D.sinDeg1000(hourAngle) * (r - 4)) / 1000
        matrixDraw.line(cx, cy, Math.round(hx), Math.round(hy), matrixCore.rgb(255, 220, 0))
    }

    // =========================================================================
    // SCENES
    // =========================================================================

    // -------------------------------------------------------------------------
    // Internal: draw a single cube animation frame
    // -------------------------------------------------------------------------
    function _drawCubeFrame(frame: number): void {
        if (_cubeId < 0) {
            _cubeId = matrix3D.createCube(10)
        }
        matrixCore.clear()
        matrix3D.setRotation(_cubeId, frame * 2, frame * 3, frame)
        matrix3D.drawMesh(_cubeId, matrixCore.rgb(0, 200, 255))
    }

    /**
     * Run the spinning 3-D cube demo (blocking loop).
     */
    //% blockId=matrix_demos_cube
    //% block="run spinning cube demo"
    //% group="Scenes" weight=100
    export function demoCube(): void {
        if (_cubeId < 0) {
            _cubeId = matrix3D.createCube(10)
        }
        let frame = 0
        basic.forever(function () {
            _drawCubeFrame(frame)
            matrixCore.updateDisplay()
            basic.pause(70)
            frame++
        })
    }

    /**
     * Run the bouncing sprites demo (blocking loop).
     */
    //% blockId=matrix_demos_sprites
    //% block="run bouncing sprites demo"
    //% group="Scenes" weight=90
    export function demoSprites(): void {
        if (!_spritesReady) {
            const smiley = matrixSprites.createSprite(
                matrixSprites.SMILEY_HEX,
                matrixSprites.SMILEY_W,
                matrixSprites.SMILEY_H
            )
            const ship = matrixSprites.createSprite(
                matrixSprites.SHIP_HEX,
                matrixSprites.SHIP_W,
                matrixSprites.SHIP_H
            )
            matrixSprites.addObject(smiley, 2, 2, 1, 1)
            matrixSprites.addObject(ship, matrixCore.width() - matrixSprites.SHIP_W - 2, matrixCore.height() - matrixSprites.SHIP_H - 2, -1, -1)
            _spritesReady = true
        }
        basic.forever(function () {
            matrixCore.clear()
            matrixSprites.updateObjects()
            matrixSprites.drawObjects()
            matrixCore.updateDisplay()
            basic.pause(70)
        })
    }

    /**
     * Run the analog clock demo with scrolling text (blocking loop).
     */
    //% blockId=matrix_demos_clock
    //% block="run clock demo"
    //% group="Scenes" weight=89
    export function demoClock(): void {
        const cx = matrixCore.centerX()
        const cy = matrixCore.centerY() - 3
        const r = 13
        matrixText.startScroll("HELLO WORLD", matrixCore.width(), matrixCore.height() - 6, matrixCore.rgb(0, 200, 100))

        basic.forever(function () {
            const t = input.runningTime() / 1000   // seconds
            const totalMinutes = Math.floor(t / 60)
            const h = Math.floor(totalMinutes / 60) % 12
            const m = totalMinutes % 60

            matrixCore.clear()
            drawClockFace(cx, cy, r)
            drawClockHands(h, m, cx, cy, r)
            matrixText.updateScroll()
            matrixCore.updateDisplay()
            basic.pause(70)
        })
    }

    // =========================================================================
    // SCENE CONTROLLER
    // =========================================================================

    /**
     * Register a named scene with a per-frame draw handler.
     * @param name    short display name (4 chars shown on status screen)
     * @param handler function called once per frame while this scene is active
     */
    //% blockId=matrix_demos_add_scene
    //% block="add scene named $name draw $handler"
    //% draggableParameters="reporter"
    //% group="Controller" weight=100
    export function addScene(name: string, handler: () => void): void {
        _scenes.push(handler)
        _sceneNames.push(name)
        _sceneCount++
    }

    /**
     * Start the scene controller.
     * - Button A: previous scene
     * - Button B: next scene
     * - A + B:    pause / resume
     * When paused a status screen shows the current scene index and name.
     */
    //% blockId=matrix_demos_run_controller
    //% block="run scene controller"
    //% group="Controller" weight=90
    export function runSceneController(): void {
        if (_sceneCount === 0) {
            return
        }

        // --- Button handlers ---
        input.onButtonPressed(Button.A, function () {
            _currentScene = (_currentScene - 1 + _sceneCount) % _sceneCount
        })

        input.onButtonPressed(Button.B, function () {
            _currentScene = (_currentScene + 1) % _sceneCount
        })

        input.onButtonPressed(Button.AB, function () {
            _running = !_running
        })

        // --- Main loop ---
        basic.forever(function () {
            if (!_running) {
                _showStatusScreen()
            } else {
                matrixCore.clear()
                _scenes[_currentScene]()
                matrixCore.updateDisplay()
                basic.pause(70)
            }
        })
    }

    // -------------------------------------------------------------------------
    // Internal: render the pause / status screen
    // -------------------------------------------------------------------------
    function _showStatusScreen(): void {
        matrixCore.clear()
        matrixDraw.rect(0, 0, matrixCore.width(), matrixCore.height(), matrixCore.rgb(30, 30, 30))

        // Scene index "n/total"
        matrixText.drawText(
            "" + (_currentScene + 1) + "/" + _sceneCount,
            2, 2,
            matrixCore.rgb(255, 200, 0)
        )

        // Scene name (first 4 chars)
        matrixText.drawText(
            _sceneNames[_currentScene].substr(0, 4),
            2, 12,
            matrixCore.rgb(100, 100, 255)
        )

        // Hint — only spacious enough on 32×32 panels
        if (matrixCore.height() >= 32) {
            matrixText.drawText(
                "AB=RUN",
                2, 22,
                matrixCore.rgb(60, 60, 60)
            )
        }

        matrixCore.updateDisplay()
        basic.pause(100)
    }

}   // end namespace matrixDemos
