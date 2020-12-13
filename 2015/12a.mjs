import { getRawInput } from '../lib.mjs';
const rawInput = getRawInput();
const input = JSON.parse(rawInput);

function walk(node) {
	if (Array.isArray(node)) {
		return node.reduce((acc, x) => acc + walk(x), 0);
	}
	if (typeof node === 'object') {
		return walk(Object.values(node));
	}
	if (typeof node === 'number') {
		return node;
	}
	return 0;
}

console.log(walk(input));

