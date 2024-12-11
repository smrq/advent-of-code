import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`125 17`), 55312
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	for (let i = 0; i < 25; ++i) {
		step(input);
	}
	return input.length;
}

function step(list) {
	for (let i = list.length - 1; i >= 0; --i) {
		if (list[i] === 0) {
			list[i] = 1;
		} else {
			const str = String(list[i]);
			if (str.length % 2 === 0) {
				const a = parseInt(str.slice(0, str.length / 2), 10);
				const b = parseInt(str.slice(str.length / 2), 10);
				list.splice(i, 1, a, b);
			} else {
				list[i] *= 2024;
			}
		}

	}
}

function parseInput(str) {
	return L.autoparse(str);
}
