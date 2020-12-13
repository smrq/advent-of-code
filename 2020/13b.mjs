import { getRawInput, runTests } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`939
7,13,x,x,59,x,31,19`),
1068781
]);

console.log(run(input));

function run(buses) {
	let step = 1;
	let n = 1;
	for (let [bus, offset] of buses) {
		while ((n + offset) % bus !== 0) {
			n += step;
		}
		step *= bus;
	}
	return n;
}

function parseInput(str) {
	const [line1, line2] = str.split('\n');
	const buses = line2.split(',')
		.map((x,i) => [x,i])
		.filter(([x,i]) => x !== 'x')
		.map(([x,i]) => [+x,i]);
	return buses;
}
