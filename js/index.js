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
    scale
} = affine()

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const defaultScale = 20
let currentScale = defaultScale
let fontSize = 16

let trapeziumPoints = transformPointsToCanvasSystem([
    { x: -12, y: 10 },
    { x: -9, y: 10 },
    { x: -6, y: 7 },
    { x: -15, y: 7 }
], currentScale, canvas.width, canvas.height)

const moveVector = transformPointToCanvasSystem({ x: 10, y: 15 }, currentScale, canvas.width, canvas.height)

const steps = 100
let iteration = 0
const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const shiftValue = { x: (moveVector.x - trapeziumPoints[0].x) / steps * iteration, y: (moveVector.y - trapeziumPoints[0].y) / steps * iteration }
    const scaleFactor = { x: 1 + 2 / steps * iteration, y: 1 + 2 / steps * iteration }
    const shiftedPoints = shift(trapeziumPoints, shiftValue)
    const scaledPoints = scale(shiftedPoints, scaleFactor)
    drawCoordinateAxes(canvas, currentScale, fontSize)
    drawFigure(canvas, scaledPoints)
    iteration < 100 ? iteration++ : iteration = 0
}

animate()