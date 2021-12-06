import * as L from '../lib.mjs';

// L.runTests(args => run(args), [
// 	parseInput(`3,4,3,1,2`), 26984457539
// ]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const limit = 2**21;
	const simAfterSteps = new Map();

	simAfterSteps.set(1, [
		[0,0,0,0,0,0,1,0,1].map(BigInt),
		[1,0,0,0,0,0,0,0,0].map(BigInt),
		[0,1,0,0,0,0,0,0,0].map(BigInt),
		[0,0,1,0,0,0,0,0,0].map(BigInt),
		[0,0,0,1,0,0,0,0,0].map(BigInt),
		[0,0,0,0,1,0,0,0,0].map(BigInt),
		[0,0,0,0,0,1,0,0,0].map(BigInt),
		[0,0,0,0,0,0,1,0,0].map(BigInt),
		[0,0,0,0,0,0,0,1,0].map(BigInt)
	]);

	for (let steps = 2; steps <= limit; steps *= 2) {
		const prev = simAfterSteps.get(steps / 2);
		const next = prev.map(row =>
			L.arrayAdd(...row.map((x, j) => L.arrayScale(prev[j], x)))
		);
		simAfterSteps.set(steps, next);
	}

	const step = simAfterSteps.get(limit);
	const result = L.sum(L.arrayAdd(...input.map(x => step[x])));

	return String(result).match(/(.{1,128})/g).join('\n');
}

function parseInput(str) {
	return L.autoparse(str);
}
