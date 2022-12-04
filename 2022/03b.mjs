import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`), 70
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let result = 0;
	for (let i = 0; i < input.length; i += 3) {
		result += priority(findDupe(input[i], input[i+1], input[i+2]));
	}
	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}

function findDupe(a, b, c) {
	for (let i = 0; i < a.length; ++i) {
		if (b.indexOf(a[i]) !== -1 && c.indexOf(a[i]) !== -1) {
			return a[i];
		}
	}
}

function priority(item) {
	return /[a-z]/.test(item) ? 1+item.charCodeAt(0)-97 : 27+item.charCodeAt(0)-65;
}
