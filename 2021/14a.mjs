import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`), 1588
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([tmp, rules]) {
	for (let step = 0; step < 10; ++step) {
		let result = tmp[0];
		for (let i = 1; i < tmp.length; ++i) {
			const pair = tmp.slice(i-1, i+1);
			const insertion = rules.get(pair);
			if (insertion) {
				result += insertion;
			}
			result += tmp[i];
		}
		tmp = result;
	}

	let freq = new Map();
	for (let i = 0; i < tmp.length; ++i) {
		L.mapIncrement(freq, tmp[i]);
	}

	const max = Math.max(...freq.values());
	const min = Math.min(...freq.values());
	return max - min;
}

function parseInput(str) {
	let [tmp, rules] = L.autoparse(str);

	tmp = tmp[0];

	rules = rules.map(r => r.split(' -> '));
	let rulesMap = new Map();
	for (let [a, b] of rules) {
		rulesMap.set(a, b);
	}
	
	return [tmp, rulesMap];
}
