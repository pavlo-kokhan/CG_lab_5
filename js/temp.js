const getTestPoints = () => {
    return transformPointsToCanvasSystem([
        { x: -12, y: 10 },
        { x: -9, y: 10 },
        { x: -6, y: 7 },
        { x: -15, y: 7 }
    ], currentScale, canvas.width, canvas.height)
}

const getTestVector = () => {
    return transformPointToCanvasSystem({ x: 10, y: 15 }, currentScale, canvas.width, canvas.height)
}