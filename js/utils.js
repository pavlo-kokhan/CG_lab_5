export const draw = () => {
    const drawXAxe = (canvas) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.beginPath()
        ctx.moveTo(0, center.x)
        ctx.lineTo(canvas.width, center.y)
        ctx.stroke()
        setStrokeStyles(ctx)
    }

    const drawYAxe = (canvas) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.beginPath()
        ctx.moveTo(center.x, 0)
        ctx.lineTo(center.x, canvas.height)
        ctx.stroke()
        setStrokeStyles(ctx)
    }

    const drawArrows = (canvas, offset) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.beginPath()
        ctx.moveTo(center.x, 0)
        ctx.lineTo(center.x - offset.x, offset.y)
        ctx.moveTo(center.x, 0)
        ctx.lineTo(center.x + offset.x, offset.y)
        ctx.moveTo(canvas.width, center.y)
        ctx.lineTo(canvas.width - offset.y, center.y - offset.x)
        ctx.moveTo(canvas.width, center.y)
        ctx.lineTo(canvas.width - offset.y, center.y + offset.x)
        ctx.stroke()
        setStrokeStyles(ctx)
    }

    const drawLabels = (canvas, scale, fontSize) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.font = `${ fontSize }px Arial`
        ctx.fillStyle = 'black'
        ctx.fillText('1', center.x + scale, center.y + fontSize + fontSize / 2)
        ctx.fillText('-1', center.x - scale - fontSize, center.y + fontSize + fontSize / 2)
        ctx.fillText('X', canvas.width - fontSize, center.y - fontSize)
        ctx.fillText('Y', center.x + fontSize, fontSize)
        setStrokeStyles(ctx)
    }

    const drawUnitDividerSegment = (canvas, scale) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.beginPath()
        for (let y = center.y; y > 0; y -= scale) {
            ctx.moveTo(center.x - 5, y)
            ctx.lineTo(center.x + 5, y)
        }

        for (let y = center.y; y < canvas.height; y += scale) {
            ctx.moveTo(center.x - 5, y)
            ctx.lineTo(center.x + 5, y)
        }

        for (let x = center.x; x > 0; x -= scale) {
            ctx.moveTo(x, center.y - 5)
            ctx.lineTo(x, center.y + 5)
        }


        for (let x = center.x; x < canvas.width; x += scale) {
            ctx.moveTo(x, center.y - 5)
            ctx.lineTo(x, center.y + 5)
        }

        ctx.stroke()
        setStrokeStyles(ctx)
    }

    const drawGrid = (canvas, scale) => {
        const ctx = canvas.getContext('2d')
        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        ctx.beginPath()
        for (let y = center.y; y > 0; y -= scale) {
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
        }

        for (let y = center.y; y < canvas.height; y += scale) {
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
        }

        for (let x = center.x; x > 0; x -= scale) {
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
        }


        for (let x = center.x; x < canvas.width; x += scale) {
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
        }

        setStrokeStyles(ctx, 'black', 'black', 0.1)
        ctx.stroke()
        setStrokeStyles(ctx)
    }

    const setStrokeStyles = (ctx, stroke = 'black', fill = 'black',  lineWidth = 1) => {
        ctx.strokeStyle = stroke
        ctx.fillStyle = fill
        ctx.lineWidth = lineWidth
    }

    const drawCoordinateAxes = (canvas, scale, fontSize) => {
        drawXAxe(canvas)
        drawYAxe(canvas)
        drawArrows(canvas, { x: 10, y: 15})
        drawLabels(canvas, scale, fontSize)
        drawUnitDividerSegment(canvas, scale)
        drawGrid(canvas, scale)
    }

    const drawFigure = (canvas, points) => {
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }

        ctx.lineTo(points[0].x, points[0].y)
        setStrokeStyles(ctx, 'red', 'blue', 1)
        ctx.fill()
        ctx.stroke()
        setStrokeStyles(ctx)
    }

    return { drawCoordinateAxes, drawFigure }
}

export const pointsTransformation = () => {
    const transformPointToCanvasSystem = (point, scale, width, height) => {
        return {
            x: point.x * scale + width / 2,
            y: point.y * scale * (-1) + height / 2
        }
    }

    const transformPointsToCanvasSystem = (points, scale, width, height) => {
        const result = []

        for (let i = 0; i < points.length; i++) {
            result.push(transformPointToCanvasSystem(points[i], scale, width, height))
        }

        return result
    }

    const transformPointToUserSystem = (point, scale, width, height) => {
        return {
            x: (point.x - width / 2) / scale,
            y: (point.y - height / 2) / scale * (-1)
        }
    }

    const transformPointsToUserSystem = (points, scale, width, height) => {
        const result = []

        for (let i = 0; i < points.length; i++) {
            result.push(transformPointToUserSystem(points[i], scale, width, height))
        }

        return result
    }

    const rescalePoint = (point, oldScale, newScale, width, height) => {
        const rawPoint = transformPointToUserSystem(point, oldScale, width, height)
        return transformPointToCanvasSystem(rawPoint, newScale, width, height)
    }

    const rescalePoints = (points, oldScale, newScale, width, height) => {
        const rawPoints = transformPointsToUserSystem(points, oldScale, width, height)
        return transformPointsToCanvasSystem(rawPoints, newScale, width, height)
    }

    return {
        transformPointToCanvasSystem,
        transformPointsToCanvasSystem,
        transformPointToUserSystem,
        transformPointsToUserSystem,
        rescalePoint,
        rescalePoints
    }
}

export const trapezium = () => {
    const isTrapezium = (points) => {
        const topSlope = (points[1].y - points[0].y) / (points[1].x - points[0].x)
        const bottomSlope = (points[3].y - points[2].y) / (points[3].x - points[2].x)
        const leftSlope = (points[3].y - points[0].y) / (points[3].x - points[0].x)
        const rightSlope = (points[2].y - points[1].y) / (points[2].x - points[1].x)

        return (Math.abs(topSlope - bottomSlope) < 0.0001 && Math.abs(leftSlope - rightSlope) > 0.0001) ||
            (Math.abs(topSlope - bottomSlope) > 0.0001 && Math.abs(leftSlope - rightSlope) < 0.0001)
    }

    return {
        isTrapezium
    }
}

export const affine = () => {
    const multiplyMatrix = (first, second) => {
        const result = []

        for (let i = 0; i < first.length; i++) {
            result[i] = []

            for (let j = 0; j < second[0].length; j++) {
                let sum = 0

                for (let k = 0; k < first[0].length; k++) {
                    sum += first[i][k] * second[k][j]
                }

                result[i][j] = sum
            }
        }

        return result
    }

    const shift = (points, shiftValue) => {
        const affineMatrix = [
            [1, 0, shiftValue.x],
            [0, 1, shiftValue.y],
            [0, 0, 1]
        ]

        return points.map(point => {
            const pointMatrix = [
                [point.x],
                [point.y],
                [1]
            ]

            const shiftedPoint = multiplyMatrix(affineMatrix, pointMatrix)

            return {
                x: shiftedPoint[0][0],
                y: shiftedPoint[1][0]
            }
        })
    }

    const scale = (points, scaleValue) => {
        // Find the centroid (average x and y coordinates) of the trapezium
        const centroid = {
            x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
            y: points.reduce((sum, point) => sum + point.y, 0) / points.length
        }

        // Translate the trapezium points so that the centroid is at the origin (0, 0)
        const translatedPoints = points.map(point => ({
            x: point.x - centroid.x,
            y: point.y - centroid.y
        }))

        // Apply the scaling transformation to the translated points
        const scaledPoints = translatedPoints.map(point => {
            const pointMatrix = [
                [point.x],
                [point.y],
                [1]
            ]

            const affineMatrix = [
                [scaleValue.x, 0, 0],
                [0, scaleValue.y, 0],
                [0, 0, 1]
            ]

            const scaledPoint = multiplyMatrix(affineMatrix, pointMatrix)

            return {
                x: scaledPoint[0][0],
                y: scaledPoint[1][0]
            }
        })

        // Translate the scaled points back to their original position
        return scaledPoints.map(point => ({
            x: point.x + centroid.x,
            y: point.y + centroid.y
        }))
    }

    return {
        shift,
        scale,
    }
}