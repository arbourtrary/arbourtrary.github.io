/**
 * Calculate the angle between two vectors
 * @param {Object} v1 First vector {x, y}
 * @param {Object} v2 Second vector {x, y}
 * @returns {number} Angle in radians
 */
function calculateAngleBetweenVectors(v1, v2) {    
    // Check for invalid vectors
    if (!v1 || !v2 || 
        typeof v1.x !== 'number' || typeof v1.y !== 'number' ||
        typeof v2.x !== 'number' || typeof v2.y !== 'number') {
        return 0;
    }
    
    // Calculate dot product
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    
    // Calculate magnitudes
    const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    // Prevent division by zero
    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0;
    }
    
    // Calculate cosine and then angle
    const cosTheta = dotProduct / (magnitude1 * magnitude2);
    
    // Clamp to handle floating point imprecision
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
    
    const angle = Math.acos(clampedCosTheta);
    return angle;
}

/**
 * Extract points from an SVG path string, including Bézier curve points
 * @param {string} pathString SVG path data string
 * @returns {Array} Array of point objects
 */
function extractPointsFromPath(pathString) {    
    const points = [];
    let currentX = 0, currentY = 0;
    
    // More robust regex to handle various number formats
    const pathCommands = pathString.match(/[MLCQZ][-+.0-9\s,]*/gi) || [];
    
    pathCommands.forEach(command => {
        const type = command[0].toUpperCase();
        // More robust number parsing
        const coords = command.slice(1).trim().split(/[\s,]+/)
            .map(coord => parseFloat(coord))
            .filter(n => !isNaN(n));
                
        switch (type) {
            case 'M': // Move to
                if (coords.length >= 2) {
                    currentX = coords[0];
                    currentY = coords[1];
                    points.push({ x: currentX, y: currentY });
                }
                break;
            
            case 'L': // Line to
                if (coords.length >= 2) {
                    currentX = coords[0];
                    currentY = coords[1];
                    points.push({ x: currentX, y: currentY });
                }
                break;
            
            case 'C': // Cubic Bézier
                if (coords.length >= 6) {
                    points.push(
                        { x: coords[0], y: coords[1] }, // First control point
                        { x: coords[2], y: coords[3] }, // Second control point
                        { x: coords[4], y: coords[5] }  // End point
                    );
                    currentX = coords[4];
                    currentY = coords[5];
                }
                break;
            
            case 'Q': // Quadratic Bézier
                if (coords.length >= 4) {
                    points.push(
                        { x: coords[0], y: coords[1] }, // Control point
                        { x: coords[2], y: coords[3] }  // End point
                    );
                    currentX = coords[2];
                    currentY = coords[3];
                }
                break;
            
            case 'Z': // Close path
                // Typically would return to the first point
                break;
        }
    });
    return points;
}

/**
 * Calculate average angle between consecutive points in an SVG path
 * @param {string} pathString SVG path data string
 * @returns {Object} Angle calculation results
 */
export function calculatePathAngles(pathString) {
    const points = extractPointsFromPath(pathString);
    
    if (points.length < 3) {
        return {
            averageAngle: 0,
            angles: [],
            pointCount: points.length
        };
    }
    
    const angles = [];
    
    // Calculate angles between consecutive point vectors
    for (let i = 0; i < points.length - 2; i++) {
        const v1 = {
            x: points[i+1].x - points[i].x,
            y: points[i+1].y - points[i].y
        };
        
        const v2 = {
            x: points[i+2].x - points[i+1].x,
            y: points[i+2].y - points[i+1].y
        };
        
        const angle = calculateAngleBetweenVectors(v1, v2);
        if (!isNaN(angle)) {
            angles.push(angle);
        }
    }
    
    // Calculate average angle
    const averageAngle = angles.length > 0 
        ? angles.reduce((sum, angle) => sum + angle, 0) / angles.length 
        : 0;
    
    return {
        averageAngle: averageAngle * (180 / Math.PI), // Convert to degrees
        angles: angles.map(a => a * (180 / Math.PI)), // Angles in degrees
        pointCount: points.length
    };
}
