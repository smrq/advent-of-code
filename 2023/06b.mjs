import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Time:      7  15   30
Distance:  9  40  200`), 71503
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ time, distance }) {
	// -held^2 + time*held - distance > 0
	const minHeld = Math.ceil((time - Math.sqrt(time*time - 4*distance)) / 2);
	const maxHeld = Math.floor((time + Math.sqrt(time*time - 4*distance)) / 2);
	return maxHeld - minHeld + 1;
}

function parseInput(str) {
	const [time, distance] = str.trim().split('\n').map(line => line.split(/\s+/).slice(1).join('')).map(x => +x);
	return { time, distance };
}
