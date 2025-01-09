import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1
2
3
2024`), 23
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const map = new Map();
	input = input.map(x => [x]);
	for (let i = 0; i < 2000; ++i) {
		for (let j = 0; j < input.length; ++j) {
			const seq = input[j];
			const n = generate(seq.at(-1));
			const price = n % 10;
			seq.push(n);
			while (seq.length > 5) {
				seq.shift();
			}
			if (seq.length === 5) {
				const changes = seq.slice(1).map((n, i) => (n % 10) - (seq[i] % 10));
				const key = changes.join(',');
				const value = map.get(key) || [];
				if (value[j] == null) {
					value[j] = price;
					map.set(key, value);
				}
			}
		}
	}
	return Math.max(
		...[...map.values()]
			.map(prices => L.sum(
				prices.filter(p => p != null)
			))
	);
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
