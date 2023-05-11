export function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

export function equals(v1, v2, epsilon = Number.EPSILON ) {
    return ((Math.abs(v1.x - v2.x) < epsilon) && (Math.abs(v1.y - v2.y) < epsilon) && (Math.abs(v1.z - v2.z) < epsilon));
}

// Maps the unit range [0,1] to [start,end]
export function mapToUnitRange(val, start, end, method="linear") {
    return clamp((val - start) / (end - start), 0, 1);
}