const { getRawInput, iter2 } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let set = new Set(input.slice(0, 25));

	let result = 0;
	for (let item of input.slice(26)) {
		if (!isSum(set, item)) {
			return item;
		}
		set.add(item);
	}
	return result;
}

function isSum(set, n) {
	let arr = [...set];
	for (let [i, j] of iter2(arr)) {
		if (arr[i] + arr[j] === n) return true;
	}
	return false;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}
