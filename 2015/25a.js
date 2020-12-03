const { getRawInput, runTests, bigIntPowerRemainder } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(run, [
	[1, 1],
	20151125,

	[2, 1],
	31916031,

	[1, 2],
	18749137,

	[6, 6],
	27995004,
]);

console.log(run(input));

function parseInput(str) {
	const [_, row, col] = /row (\d+), column (\d+)\.$/.exec(str);
	return [row, col];
}

function run([row, col]) {
	const power = getPower(row, col);
	const rem = 33554393n;
	return Number(20151125n * bigIntPowerRemainder(252533n, power, rem) % rem);

	function getPower(row, col) {
		row = BigInt(row);
		col = BigInt(col);
		const tNum = col + row - 1n;
		const t = tNum * (tNum+1n) / 2n;
		return t - (row - 1n) - 1n;
	}
}
