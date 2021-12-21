import * as L from '../lib.mjs';

let probabilities = new Map();
for (let i = 1; i <= 3; ++i) {
	for (let j = 1; j <= 3; ++j) {
		for (let k = 1; k <= 3; ++k) {
			L.mapIncrement(probabilities, i+j+k);
		}
	}
}

L.runTests(args => run(args), [
	[4, 8], 444356092776315
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([space1, space2]) {
	let wins = [0, 0];
	calculate(wins, 1, space1, space2, 0, 0, 1);
	return Math.max(...wins);
}

function calculate(wins, copies, space1, space2, score1, score2, player) {
	if (score1 >= 21) {
		wins[0] += copies;
		return;
	}

	if (score2 >= 21) {
		wins[1] += copies;
		return;
	}
	
	for (let [s, n] of probabilities.entries()) {
		if (player === 1) {
			let next = ((space1 + s - 1) % 10) + 1;
			calculate(wins, n * copies, next, space2, score1 + next, score2, 2);
		} else {
			let next = ((space2 + s - 1) % 10) + 1;
			calculate(wins, n * copies, space1, next, score1, score2 + next, 1);
		}
	}
}

function parseInput(str) {
	return L.autoparse(str).map(line => +/(\d+)$/.exec(line)[1]);
}
