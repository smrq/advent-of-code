import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`), 30
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function score({a, b}) {
	const winning = new Set(a);
	return b.filter(n => winning.has(n)).length;
}

function run(input) {
	const bonusCopies = [];
	let result = 0;

	for (let card of input) {
		let n = 1;
		if (bonusCopies.length) {
			n += bonusCopies.shift();
		}
		result += n;

		const s = score(card);
		for (let j = 0; j < s; ++j) {
			bonusCopies[j] = (bonusCopies[j] ?? 0) + n;
		}
	}

	return result;
}

function parseInput(str) {
	return L.autoparse(str.trim()).map(line => {
		const match = /Card +(\d+): ([\d ]+) \| ([\d ]+)/.exec(line);
		let [id, a, b] = match.slice(1);
		a = a.split(/\s+/).map(x => +x);
		b = b.split(/\s+/).map(x => +x);
		return { id, a, b };
	});
}
