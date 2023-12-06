import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Time:      7  15   30
Distance:  9  40  200`), 288
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ time, distance }) {
	let result = 1;

	for (let race = 0; race < time.length; ++race) {
		const t = time[race];
		const record = distance[race];

		let winning = 0;
		for (let held = 1; held < t; ++held) {
			if (held * (t - held) > record) {
				++winning;
			}
		}

		result *= winning;
	}

	return result;
}

function parseInput(str) {
	const [time, distance] = str.trim().split('\n').map(line => line.split(/\s+/).slice(1).map(x => +x));
	return { time, distance };
}
