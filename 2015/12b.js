const { getRawInput } = require('../lib');
const rawInput = getRawInput();
const input = JSON.parse(rawInput);

function walk(node) {
	if (Array.isArray(node)) {
		return node.reduce((acc, x) => acc + walk(x), 0);
	}
	if (typeof node === 'object') {
		const values = Object.values(node);
		if (values.includes('red')) {
			return 0;
		} else {
			return walk(values);
		}
	}
	if (typeof node === 'number') {
		return node;
	}
	return 0;
}

console.log(walk(input));

