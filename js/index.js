// • відображення координатної площини зі всіма відповідними позначеннями та підписами; +
// • зручне введення координат фігури (чи її конструктивних елементів) користувачем згідно варіанту; +
// • повідомлення про неправильно введені дані для фігури; +
// • синтез рухомого зображення згідно варіанту з обов’язковим використанням матричних виразів для реалізації комбінації афінних перетворень; +
// • можливість зупинити, продовжити рух фігури; +
// • динамічну зміну одиничного відрізку координатної площини; +
// • todo: збереження у файлі матриці-результату, що відповідає комбінації афінних перетворень згідно індивідуального варіанту;
// • збереження початкового зображення фігури у файл. +

// 6) Ввести трапецію через координати вершин. Реалізувати рух на основі переміщення фігури на вектор (a, b)
// з одночасним збільшенням у k рази та повернення у початковий стан.

import { draw, pointsTransformation, trapezium, affine } from "./utils.js"

const {
    drawCoordinateAxes,
    drawFigure
} = draw()

const {
    transformPointToCanvasSystem,
    transformPointsToCanvasSystem,
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
const btnSaveImage = document.querySelector('#btnSaveImage')
const btnSaveMatrix = document.querySelector('#btnSaveMatrix')

const defaultScale = 20
let currentScale = defaultScale
let fontSize = 16

let trapeziumPoints = null
let moveVector = null
let scaleFactor = null

const steps = 100
let iteration = 0
let isMoving = false
let isForward = true

const saveCanvasImageAsFile = (canvas) => {
    let link = document.createElement('a')
    link.download = `image${ String(Math.floor(100000 + Math.random() * 900000)) }.png`
    link.href = canvas.toDataURL()
    link.click()
}

const setScale = (newScale) => {
    const oldScale = currentScale
    currentScale = newScale

    if (moveVector) {
        moveVector = rescalePoint(moveVector, oldScale, currentScale, canvas.width, canvas.height)
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
    }

    return { x: 1 + stepSize.x * iteration, y: 1 + stepSize.y * iteration }
}

const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinateAxes(canvas, currentScale, fontSize)

    if (trapeziumPoints) {
        if (moveVector && scaleFactor) {
            const shiftingValue = calculateIterationShifting(iteration, steps, moveVector, trapeziumPoints[0])
            const shiftedPoints = shift(trapeziumPoints, shiftingValue)

            const scalingValue = calculateIterationScaling(iteration, steps, scaleFactor)
            const scaledPoints = scale(shiftedPoints, scalingValue)

            drawFigure(canvas, scaledPoints)

            if (isMoving) {
                isForward ? iteration++ : iteration--
                if (iteration >= steps) {
                    isMoving = false
                    iteration = steps
                } else if (iteration <= 0) {
                    isMoving = false
                    iteration = 0
                }
            }
        } else {
            drawFigure(canvas, trapeziumPoints)
        }
    }
}

scaleInput.addEventListener('change', () => {
    setScale(parseInt(scaleInput.value))
})

btnSetDefaultScale.addEventListener('click', () => {
    setScale(defaultScale)
})

btnApplyPoints.addEventListener('click', () => {
    // trapeziumPoints = getTestPoints()
    trapeziumPoints = transformPointsToCanvasSystem([
        {
            x: parseInt(document.querySelector('#topLeftX').value),
            y: parseInt(document.querySelector('#topLeftY').value)
        },
        {
            x: parseInt(document.querySelector('#topRightX').value),
            y: parseInt(document.querySelector('#topRightY').value)
        },
        {
            x: parseInt(document.querySelector('#bottomRightX').value),
            y: parseInt(document.querySelector('#bottomRightY').value)
        },
        {
            x: parseInt(document.querySelector('#bottomLeftX').value),
            y: parseInt(document.querySelector('#bottomLeftY').value)
        }
    ], currentScale, canvas.width, canvas.height)

    if (!isTrapezium(trapeziumPoints)) {
        alert('These points are not trapezium. Try again!')
        trapeziumPoints = null
        return
    }

    iteration = 0
    drawFigure(canvas, trapeziumPoints)
})

btnResetPoints.addEventListener('click', () => {
    trapeziumPoints = null
    iteration = 0

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinateAxes(canvas, currentScale, fontSize)
})

btnMoveForward.addEventListener('click', () => {
    // moveVector = getTestVector()
    moveVector = transformPointToCanvasSystem({
        x: parseInt(document.querySelector('#movementVectorX').value),
        y: parseInt(document.querySelector('#movementVectorY').value)
    }, currentScale, canvas.width, canvas.height)

    scaleFactor = {
        x: parseFloat(document.querySelector('#increaseWidth').value),
        y: parseFloat(document.querySelector('#increaseHeight').value)
    }

    isMoving = true
    isForward = true
})

btnMoveBackwards.addEventListener('click', () => {
    if (moveVector) {
        isMoving = true
        isForward = false
    }
})

btnStopMovement.addEventListener('click', () => {
    isMoving = false
})

btnContinueMovement.addEventListener('click', () => {
    isMoving = true
})

btnSaveImage.addEventListener('click', () => {
    saveCanvasImageAsFile(canvas)
})

btnSaveMatrix.addEventListener('click', () => {
    // todo
})

animate()