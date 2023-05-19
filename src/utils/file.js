export async function loadJSON(filename) {
    const res = await fetch(filename);
    const json = await res.json();
    return json;
}
