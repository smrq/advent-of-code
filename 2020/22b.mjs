import { getRawInput, autoparse, runTests, sum } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`), 291
]);

console.log(run(input));

function run(input) {
	const [d1, d2] = input;
	const [, deck] = combat(d1, d2);
	return sum(deck.map((x, i) => (deck.length-i)*x));
}

function combat(d1, d2) {
	const seen = new Set();
	while (d1.length && d2.length) {
		const key = d1.join(',') + '|' + d2.join(',');
		if (seen.has(key)) {
			return [1, d1];
		}
		seen.add(key);

		const c1 = d1.shift();
		const c2 = d2.shift();

		let win;
		if (d1.length >= c1 && d2.length >= c2) {
			[win] = combat(d1.slice(0, c1), d2.slice(0, c2));
		} else {
			win = c1 > c2 ? 1 : 2;
		}

		if (win === 1) {
			d1.push(c1);
			d1.push(c2);
		} else {
			d2.push(c2);
			d2.push(c1);
		}
	}

	return d1.length ? [1, d1] : [2, d2];
}

function parseInput(str) {
	return autoparse(str).map(x => x.slice(1).map(y => +y));
}
