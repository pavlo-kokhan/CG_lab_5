// let temp = 0
// const dist = 1.5
// const animate = () => {
//     window.requestAnimationFrame(animate)
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     drawCoordinateAxes(canvas, currentScale, fontSize)
//     drawFigure(canvas, trapeziumPoints)
//
//     if (temp < 100) {
//         for (let i = 0; i < trapeziumPoints.length; i++) {
//             trapeziumPoints[i].x += dist
//             trapeziumPoints[i].y += dist
//         }
//         temp++
//     }
//     if (temp >= 100 && temp < 200) {
//         for (let i = 0; i < trapeziumPoints.length; i++) {
//             trapeziumPoints[i].x -= dist
//             trapeziumPoints[i].y += dist
//         }
//         temp++
//     }
//     if (temp >= 200 && temp < 300) {
//         for (let i = 0; i < trapeziumPoints.length; i++) {
//             trapeziumPoints[i].x -= dist
//             trapeziumPoints[i].y -= dist
//         }
//         temp++
//     }
//     if (temp >= 300 && temp < 400) {
//         for (let i = 0; i < trapeziumPoints.length; i++) {
//             trapeziumPoints[i].x += dist
//             trapeziumPoints[i].y -= dist
//         }
//         temp++
//         if (temp === 399) temp = 0
//     }
// }

const scaleInput = document.querySelector('#scale')
const scaleDisplayValue = document.querySelector('#scaleDisplayValue')
const btnSetDefaultScale = document.querySelector('#btnSetDefaultScale')

const setScale = (newScale) => {
    const oldScale = currentScale
    currentScale = newScale
    trapeziumPoints = rescalePoints(trapeziumPoints, oldScale, currentScale, canvas.width, canvas.height)
    scaleDisplayValue.innerHTML = currentScale
}

const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCoordinateAxes(canvas, currentScale, fontSize)
    drawFigure(canvas, trapeziumPoints)
}

scaleInput.addEventListener('change', () => {
    setScale(parseInt(scaleInput.value))
})

btnSetDefaultScale.addEventListener('click', () => {
    setScale(defaultScale)
})