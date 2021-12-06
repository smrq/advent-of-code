import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3,4,3,1,2`), 26984457539
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const simAfterSteps = new Map();

	simAfterSteps.set(1, [
		[0,0,0,0,0,0,1,0,1],
		[1,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0],
		[0,0,1,0,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,1,0]
	]);

	for (let steps = 2; steps <= 256; steps *= 2) {
		const prev = simAfterSteps.get(steps / 2);
		const next = prev.map(row =>
			L.arrayAdd(...row.map((x, j) => L.arrayScale(prev[j], x)))
		);
		simAfterSteps.set(steps, next);
	}

	const step = simAfterSteps.get(256);

	return L.sum(L.arrayAdd(...input.map(x => step[x])));
}

function parseInput(str) {
	return L.autoparse(str);
}
