import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`), 4174379265
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;

	for (let range of input) {
		for (let id = range[0]; id <= range[1]; ++id) {
			if (isInvalid(String(id))) {
				result += parseInt(id, 10);
			}
		}
	}

	return result;
}

function isInvalid(id) {
	for (let length = 1; length <= id.length / 2; ++length) {
		if (id.length % length !== 0) {
			continue;
		}

		const substr = id.slice(0, length);
		if (id === substr.repeat(id.length / length)) {
			return true;
		}
	}

	return false;
}

function parseInput(str) {
	return str.split(',').map(range => range.split('-').map(n => parseInt(n, 10)));
}

