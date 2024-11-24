export function hexToRgb(hex) {
  const hexLower = hex.toLowerCase().trim();
  const r = parseInt(hexLower.slice(1, 3), 16);
  const g = parseInt(hexLower.slice(3, 5), 16);
  const b = parseInt(hexLower.slice(5, 7), 16);
  return hexLower ? `rgb(${r},${g},${b})` : null;
}

// Parse hex color to RGB
function hexToRgbArray(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse 3-digit hex
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const num = parseInt(hex, 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    ];
}

// Parse any color format to RGB
function parseColor(color) {
    // Handle hex
    if (color.startsWith('#')) {
        return hexToRgbArray(color);
    }
    
    // Handle rgb/rgba
    if (color.startsWith('rgb')) {
        return color.match(/\d+/g).map(Number).slice(0, 3);
    }
    
    // Handle color names - convert to hex first
    const colorMap = {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        // Add more colors as needed
        white: '#ffffff',
        black: '#000000'
    };
    
    return hexToRgbArray(colorMap[color.toLowerCase()] || '#000000');
}

// Convert RGB to HCL color space
function rgbToHcl(r, g, b) {
    // Convert to 0-1 range
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Convert to linear RGB
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    // Convert to XYZ
    const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
    const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
    
    // Convert XYZ to Lab
    const xn = 0.95047;
    const yn = 1.0;
    const zn = 1.08883;
    
    const fx = x / xn > 0.008856 ? Math.pow(x / xn, 1/3) : (903.3 * x / xn + 16) / 116;
    const fy = y / yn > 0.008856 ? Math.pow(y / yn, 1/3) : (903.3 * y / yn + 16) / 116;
    const fz = z / zn > 0.008856 ? Math.pow(z / zn, 1/3) : (903.3 * z / zn + 16) / 116;
    
    const L = Math.max(0, 116 * fy - 16);
    const a = 500 * (fx - fy);
    const b_lab = 200 * (fy - fz);
    
    // Convert Lab to HCL
    const C = Math.sqrt(a * a + b_lab * b_lab);
    let H = Math.atan2(b_lab, a) * (180 / Math.PI);
    if (H < 0) H += 360;
    
    return [H, C, L];
}

// Convert HCL back to RGB
function hclToRgb(h, c, l) {
    // Convert HCL to Lab
    const m = Math.cos(h * Math.PI / 180) * c;
    const n = Math.sin(h * Math.PI / 180) * c;
    
    // Convert Lab to XYZ
    const fy = (l + 16) / 116;
    const fx = m / 500 + fy;
    const fz = fy - n / 200;
    
    const xn = 0.95047;
    const yn = 1.0;
    const zn = 1.08883;
    
    const x = xn * (fx * fx * fx > 0.008856 ? fx * fx * fx : (fx - 16/116) / 7.787);
    const y = yn * (fy * fy * fy > 0.008856 ? fy * fy * fy : (fy - 16/116) / 7.787);
    const z = zn * (fz * fz * fz > 0.008856 ? fz * fz * fz : (fz - 16/116) / 7.787);
    
    // Convert XYZ to RGB
    let r = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    let g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    let b = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
    
    // Convert to sRGB
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1/2.4) - 0.055 : 12.92 * b;
    
    // Convert to 0-255 range and clamp
    return [
        Math.max(0, Math.min(255, Math.round(r * 255))),
        Math.max(0, Math.min(255, Math.round(g * 255))),
        Math.max(0, Math.min(255, Math.round(b * 255)))
    ];
}

// Interpolate between color stops
export function lerpColorHCL(stops, t) {
    // Ensure t is between 0 and 1
    t = Math.max(0, Math.min(1, t));
    
    if (stops.length < 2) return stops[0].color;
    if (t === 0) return stops[0].color;
    if (t === 1) return stops[stops.length - 1].color;
    
    // Find the color stops we're interpolating between
    let startIndex = 0;
    for (let i = 1; i < stops.length; i++) {
        if (t <= stops[i].position) {
            startIndex = i - 1;
            break;
        }
    }
    
    const start = stops[startIndex];
    const end = stops[startIndex + 1];
    
    // Calculate the interpolation factor between these two stops
    const factor = (t - start.position) / (end.position - start.position);
    
    // Convert colors to HCL
    const startRgb = parseColor(start.color);
    const endRgb = parseColor(end.color);
    
    const startHcl = rgbToHcl(...startRgb);
    const endHcl = rgbToHcl(...endRgb);
    
    // Handle hue interpolation (shortest path)
    let h = startHcl[0];
    let hDiff = endHcl[0] - startHcl[0];
    if (Math.abs(hDiff) > 180) {
        if (hDiff > 0) {
            h += 360;
        } else {
            endHcl[0] += 360;
        }
    }
    
    // Interpolate in HCL space
    const interpolatedHcl = [
        h + (endHcl[0] - h) * factor,
        startHcl[1] + (endHcl[1] - startHcl[1]) * factor,
        startHcl[2] + (endHcl[2] - startHcl[2]) * factor
    ];
    
    // Convert back to RGB
    const rgb = hclToRgb(...interpolatedHcl);
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
