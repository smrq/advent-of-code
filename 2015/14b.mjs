import { runTests, getRawInput } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
	[[{ speed: 14, onTime: 10, offTime: 127 }, { speed: 16, onTime: 11, offTime: 162 }], 1000],
	689,
]);

console.log(run(input, 2503));


function parseInput(str) {
	const re = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;
	return str.split('\n')
		.map(str => re.exec(str))
		.map(([_, name, speed, onTime, offTime]) => ({
			name: name,
			speed: +speed,
			onTime: +onTime,
			offTime: +offTime,
		}));
}

function run(deer, t) {
	for (let d of deer) {
		d.position = 0;
		d.points = 0;
	}

	for (let n = 0; n < t; ++n) {
		for (let d of deer) {
			if (n % (d.onTime + d.offTime) < d.onTime) {
				d.position += d.speed;
			}
		}
		for (let d of deer) {
			const leadingPosition = Math.max(...deer.map(d => d.position));
			if (d.position === leadingPosition) {
				++d.points;
			}
		}
	}

	return Math.max(...deer.map(d => d.points));
}
