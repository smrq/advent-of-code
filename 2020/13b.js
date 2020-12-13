const { getRawInput, runTests, modulo, bigIntChineseRemainder } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`939
7,13,x,x,59,x,31,19`),
1068781
]);

console.log(run(input));

function run(buses) {
	const N = buses.map(([bus, offset]) => BigInt(bus));
	const A = buses.map(([bus, offset]) => BigInt(modulo(-offset, bus)));
	return Number(bigIntChineseRemainder(A, N));
}

function parseInput(str) {
	const [line1, line2] = str.split('\n');
	const buses = line2.split(',')
		.map((x,i) => [x,i])
		.filter(([x,i]) => x !== 'x')
		.map(([x,i]) => [+x,i]);
	return buses;
}
