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
CN -> C`), 2188189693529
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([tmp, rules]) {
	let pairs = new Map();
	for (let i = 1; i < tmp.length; ++i) {
		L.mapIncrement(pairs, tmp.slice(i-1, i+1));
	}

	for (let step = 0; step < 40; ++step) {
		const newPairs = new Map();
		for (let [pair, ct] of pairs.entries()) {
			const rule = rules.get(pair);
			if (rule) {
				L.mapIncrement(newPairs, rule[0], ct);
				L.mapIncrement(newPairs, rule[1], ct);
			} else {
				L.mapIncrement(newPairs, pair, ct);
			}
		}
		pairs = newPairs;
	}

	let freq = new Map();
	L.mapIncrement(freq, tmp[0]);
	L.mapIncrement(freq, tmp[tmp.length-1]);
	for (let [pair, ct] of pairs.entries()) {
		L.mapIncrement(freq, pair[0], ct);
		L.mapIncrement(freq, pair[1], ct);
	}

	const max = Math.max(...freq.values()) / 2;
	const min = Math.min(...freq.values()) / 2;
	return max - min;
}

function parseInput(str) {
	let [tmp, rules] = L.autoparse(str);

	tmp = tmp[0];

	rules = rules.map(r => r.split(' -> '));
	let rulesMap = new Map();
	for (let [a, b] of rules) {
		rulesMap.set(a, [a[0] + b, b + a[1]]);
	}
	
	return [tmp, rulesMap];
}
