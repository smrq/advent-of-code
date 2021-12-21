import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	[4, 8], 739785
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([space1, space2]) {
	let score1 = 0;
	let score2 = 0;
	let die = dieGen();
	let rolls = 0;

	for (;;) {
		let s = die.next().value + die.next().value + die.next().value;
		space1 = ((space1 + s - 1) % 10) + 1;
		score1 += space1;
		rolls += 3;
		if (score1 >= 1000) {
			return score2 * rolls;
		}
		[space1, score1, space2, score2] = [space2, score2, space1, score1];
	}
}

function *dieGen() {
	for (;;) {
		for (let i = 1; i <= 100; ++i) {
			yield i;
		}
	}
}

function parseInput(str) {
	return L.autoparse(str).map(line => +/(\d+)$/.exec(line)[1]);
}
