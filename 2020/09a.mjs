import { getRawInput, range } from '../lib.mjs';

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
	for (let i of range(0, arr.length)) {
		for (let j of range(i+1, arr.length)) {
			if (arr[i] + arr[j] === n) return true;
		}
	}
	return false;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return +line;
	});
}
