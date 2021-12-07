import * as L from '../lib.mjs';
const D = L.D;

L.runTests(args => run(args), [
	parseInput(`16,1,2,0,4,2,7,1,2,14`), 37
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let best = Infinity;
	for (let i = 0; i < Math.max(...input); ++i) {
		const score = L.sum(input.map(x => Math.abs(x - i)));
		if (score < best) {
			best = score;
		}
	}
	return best;
}

function parseInput(str) {
	return L.autoparse(str);
}
