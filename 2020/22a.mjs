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
10`), 306
]);

console.log(run(input));

function run(input) {
	const [d1, d2] = input;
	while (d1.length && d2.length) {
		const c1 = d1.shift();
		const c2 = d2.shift();

		if (c1 > c2) {
			d1.push(c1);
			d1.push(c2);
		} else {
			d2.push(c2);
			d2.push(c1);
		}
	}

	const winner = d1.length ? d1 : d2;
	return sum(winner.map((x, i) => (winner.length-i)*x));
}

function parseInput(str) {
	return autoparse(str).map(x => x.slice(1).map(y => +y));
}
