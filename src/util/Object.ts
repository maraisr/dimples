export function has(object: Object, key: any) {
	return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
}
