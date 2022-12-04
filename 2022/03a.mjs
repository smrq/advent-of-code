import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`), 157
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(sacks => findDupe(...sacks)).map(priority));
}

function parseInput(str) {
	return L.autoparse(str).map(splitSack);
}

function findDupe(a, b) {
	for (let i = 0; i < a.length; ++i) {
		if (b.indexOf(a[i]) !== -1) {
			return a[i];
		}
	}
}

function splitSack(str) {
	return [str.slice(0, str.length / 2), str.slice(str.length / 2)];
}

function priority(item) {
	return /[a-z]/.test(item) ? 1+item.charCodeAt(0)-97 : 27+item.charCodeAt(0)-65;
}
