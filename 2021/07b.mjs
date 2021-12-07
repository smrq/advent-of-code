import * as L from '../lib.mjs';
const D = L.D;

L.runTests(args => run(args), [
	parseInput(`16,1,2,0,4,2,7,1,2,14`), 168
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let best = Infinity;
	for (let i = 0; i < Math.max(...input); ++i) {
		const score = L.sum(input.map(x => 0.5 * Math.abs(x - i) * (Math.abs(x - i)+1)))
		if (score < best) {
			best = score;
		}
	}
	return best;
}

function parseInput(str) {
	return L.autoparse(str);
}
