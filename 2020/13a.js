const { getRawInput, runTests, modulo, minBy } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`939
7,13,x,x,59,x,31,19`),
295
]);

console.log(run(input));

function run(input) {
	const { t, buses } = input;
	const bus = minBy(buses, bus => modulo(-t, bus));
	return bus * modulo(-t, bus);
}

function parseInput(str) {
	const [line1, line2] = str.split('\n');
	const t = +line1;
	const buses = line2.split(',')
		.filter(c => c !== 'x')
		.map(x => +x);
	return { t, buses };
}
