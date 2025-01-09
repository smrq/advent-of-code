import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1
10
100
2024`), 37327623
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	for (let i = 0; i < 2000; ++i) {
		input = input.map(generate);
	}
	return L.sum(input);
}

function generate(n) {
	n = BigInt(n);
	n = mixPrune(n * 64n, n);
	n = mixPrune(n / 32n, n);
	n = mixPrune(n * 2048n, n);
	n = Number(n);
	return n;
}

function mixPrune(a, b) {
	return (a ^ b) % 16777216n;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => parseInt(line, 10));
}
