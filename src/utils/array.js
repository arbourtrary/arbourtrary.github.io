export function getFieldFromArrayOfObjects(array, field) {
	return array.map((item) => item[field]);
}

export function sortByDateString(array, dateField, ascending = false) {
	return array.sort((a, b) => {
		const dateA = new Date(a[dateField]);
		const dateB = new Date(b[dateField]);
		return ascending ? dateA - dateB : dateB - dateA;
	});
}