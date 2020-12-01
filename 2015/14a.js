const { runTests, getRawInput } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(...args), [
	[[{ speed: 14, onTime: 10, offTime: 127 }, { speed: 16, onTime: 11, offTime: 162 }], 1000],
	1120,
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

function f(t, speed, onTime, offTime) {
	return speed * (
		onTime * Math.floor(t / (onTime + offTime)) +
		Math.min(onTime, t % (onTime + offTime))
	);
}

function run(deer, t) {
	return Math.max(...deer.map(d => f(t, d.speed, d.onTime, d.offTime)));
}
