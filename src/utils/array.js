export function getFieldFromArrayOfObjects(array, field) {
	return array.map((item) => item[field]);
}