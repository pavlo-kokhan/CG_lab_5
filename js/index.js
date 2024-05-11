// • відображення координатної площини зі всіма відповідними позначеннями та підписами; +
// • зручне введення координат фігури (чи її конструктивних елементів) користувачем згідно варіанту; +
// • повідомлення про неправильно введені дані для фігури; +-
// • синтез рухомого зображення згідно варіанту з обов’язковим використанням матричних виразів для реалізації комбінації афінних перетворень;
// • можливість зупинити, продовжити рух фігури;
// • динамічну зміну одиничного відрізку координатної площини; +
// • збереження у файлі матриці-результату, що відповідає комбінації афінних перетворень згідно індивідуального варіанту;
// • збереження початкового зображення фігури у файл.

// 6) Ввести трапецію через координати вершин. Реалізувати рух на основі переміщення фігури на вектор (a, b)
// з одночасним збільшенням у k рази та повернення у початковий стан.

// почати - зупинити - продовжити рух нахуй

import { draw, pointsTransformation, trapezium, affine } from "./utils.js"

const {
    drawCoordinateAxes,
    drawFigure
} = draw()

const {
    transformPointToCanvasSystem,
    transformPointsToCanvasSystem,
    transformPointToUserSystem,
    transformPointsToUserSystem,
    rescalePoint,
    rescalePoints
} = pointsTransformation()

const {
    isTrapezium
} = trapezium()

const {
    shift,
    scale,
} = affine()

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const scaleInput = document.querySelector('#scale')
const scaleDisplayValue = document.querySelector('#scaleDisplayValue')
const btnSetDefaultScale = document.querySelector('#btnSetDefaultScale')

const btnApplyPoints = document.querySelector('#btnApplyPoints')
const btnResetPoints = document.querySelector('#btnResetPoints')
const btnMoveForward = document.querySelector('#btnMoveForward')
const btnMoveBackwards = document.querySelector('#btnMoveBackwards')
const btnStopMovement = document.querySelector('#btnStopMovement')
const btnContinueMovement = document.querySelector('#btnContinueMovement')

const defaultScale = 20
let currentScale = defaultScale
let fontSize = 16

let trapeziumPoints = null
let moveVector = null

const steps = 200
let iteration = 0
let isMoving = false
let isForward = true

const setScale = (newScale) => {
    const oldScale = currentScale
    currentScale = newScale

    if (moveVector) {
        moveVector = transformPointToCanvasSystem({ x: 10, y: 15 }, currentScale, canvas.width, canvas.height)
    }

    if (trapeziumPoints) {
        trapeziumPoints = rescalePoints(trapeziumPoints, oldScale, currentScale, canvas.width, canvas.height)
    }

    scaleDisplayValue.innerHTML = currentScale
}

const calculateIterationShifting = (iteration, steps, vector, point) => {
    return { x: (vector.x - point.x) / steps * iteration, y: (vector.y - point.y) / steps * iteration }
}

const calculateIterationScaling = (iteration, steps, scaleFactor) => {
    const stepSize = {
        x: (scaleFactor.x - 1) / steps,
        y: (scaleFactor.y - 1) / steps
    };
    return { x: 1 + stepSize.x * iteration, y: 1 + stepSize.y * iteration };
}

const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinateAxes(canvas, currentScale, fontSize)

    if (trapeziumPoints && moveVector && isMoving) {
        const shiftingValue = calculateIterationShifting(iteration, steps, moveVector, trapeziumPoints[0])
        const shiftedPoints = shift(trapeziumPoints, shiftingValue)

        const scalingValue = calculateIterationScaling(iteration, steps, { x: 1.5, y: 1.5 })
        const scaledPoints = scale(shiftedPoints, scalingValue)

        drawFigure(canvas, scaledPoints)

        isForward ? iteration++ : iteration--
        iteration >= steps ? (iteration = 0) : null
        iteration <= 0 ? (iteration = steps) : null
    }
}

scaleInput.addEventListener('change', () => {
    setScale(parseInt(scaleInput.value))
})

btnSetDefaultScale.addEventListener('click', () => {
    setScale(defaultScale)
})

btnApplyPoints.addEventListener('click', () => {
    trapeziumPoints = transformPointsToCanvasSystem([
        { x: -12, y: 10 },
        { x: -9, y: 10 },
        { x: -6, y: 7 },
        { x: -15, y: 7 }
    ], currentScale, canvas.width, canvas.height)

    drawFigure(canvas, trapeziumPoints)
})

btnResetPoints.addEventListener('click', () => {
    trapeziumPoints = null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinateAxes(canvas, currentScale, fontSize)
})

btnMoveForward.addEventListener('click', () => {
    moveVector = transformPointToCanvasSystem({ x: 10, y: 15 }, currentScale, canvas.width, canvas.height)
    isMoving = true
    isForward = true
})

btnMoveBackwards.addEventListener('click', () => {
    // stop on the position it is now and move backwards to the start position
    if (moveVector) {
        isMoving = true
        isForward = false
    }
})

btnStopMovement.addEventListener('click', () => {
    // just stop movement and figure must stay on the current position
    isMoving = false
})

btnContinueMovement.addEventListener('click', () => {
    // if movement is stopped - continue movement to the end position
    isMoving = true
})

drawCoordinateAxes(canvas, currentScale, fontSize)

animate()