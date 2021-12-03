import * as lib from '../lib.mjs';

const input = parseInput(lib.getRawInput());

console.log(run(input));

function run(input) {
	let oxy = input.slice();
	for (let i = 0; i < input[0].length; ++i) {
		const m = mcv(oxy, i);
		oxy = oxy.filter(x => x[i] === m);
		if (oxy.length === 1) break;
	}

	let co = input.slice();
	for (let i = 0; i < input[0].length; ++i) {
		const l = lcv(co, i);
		co = co.filter(x => x[i] === l);
		if (co.length === 1) break;
	}

	oxy = parseInt(oxy[0], 2);
	co = parseInt(co[0], 2);

	return oxy*co;
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
