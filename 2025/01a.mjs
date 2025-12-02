import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`), 3
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(list) {
	let count = 0;
	let position = 50;

	for (let line of list) {
		const dir = line[0];
		const amount = parseInt(line.slice(1), 10);

		const sign = { L: -1, R: 1 }[dir];
		position = (position + sign * amount) % 100;
		if (position === 0) {
			++count;
		}
	}
	
	return count;
}

function parseInput(str) {
	return L.autoparse(str);
}

