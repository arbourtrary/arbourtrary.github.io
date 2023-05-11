export function hexToRgb(hex) {
  const hexLower = hex.toLowerCase().trim();
  const r = parseInt(hexLower.slice(1, 3), 16);
  const g = parseInt(hexLower.slice(3, 5), 16);
  const b = parseInt(hexLower.slice(5, 7), 16);
  return hexLower ? `rgb(${r},${g},${b})` : null;
}