import * as lib from '../lib.mjs';

const input = parseInput(lib.getRawInput());

console.log(run(input));

function run(input) {
	let gamma = '';
	let epsilon = '';

	for (let i = 0; i < input[0].length; ++i) {
		gamma += mcv(input, i);
		epsilon += lcv(input, i);
	}

	gamma = parseInt(gamma, 2);
	epsilon = parseInt(epsilon, 2);

	return gamma*epsilon;
}

function count(input, pos) {
	const result = [0, 0];
	for (let line of input) {
		result[line[pos]]++;
	}
	return result;
}

function mcv(input, pos) {
	const c = count(input, pos);
	return (c[0] > c[1]) ? '0' : '1';
}

function lcv(input, pos) {
	const c = count(input, pos);
	return (c[0] > c[1]) ? '1' : '0';
}

function parseInput(str) {
	return lib.autoparse(str);
}
