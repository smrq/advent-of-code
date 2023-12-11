import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`), 2,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function differentiate(values) {
	let result = [];
	for (let i = 1; i < values.length; ++i) {
		result.push(values[i] - values[i-1]);
	}
	return result;
}

function run(input) {
	const next = input.map(line => {
		let n = 0, nthDerivatives = [line];
		while (nthDerivatives[n].some(x => x !== 0)) {
			++n;
			nthDerivatives[n] = differentiate(nthDerivatives[n-1]);
		}

		let x = 0;
		while (n > 0) {
			--n;
			x = nthDerivatives[n][0] - x;
		}

		return x;
	});
	return L.sum(next);
}

function parseInput(str) {
	return L.autoparse(str);
}
