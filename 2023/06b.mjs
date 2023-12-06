import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Time:      7  15   30
Distance:  9  40  200`), 71503
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ time, distance }) {
	let winning = 0;
	for (let held = 1; held < time; ++held) {
		if (held * (time - held) > distance) {
			++winning;
		}
	}
	return winning;
}

function parseInput(str) {
	const [time, distance] = str.trim().split('\n').map(line => line.split(/\s+/).slice(1).join('')).map(x => +x);
	return { time, distance };
}
