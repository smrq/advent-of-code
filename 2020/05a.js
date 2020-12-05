const { getRawInput, runTests } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => getId(args), [
	'FBFBBFFRLR', 357,
	'BFFFBBFRRR', 567,
	'FFFBBBFRRR', 119,
	'BBFFBBFRLL', 820,
]);

console.log(run(input));

function run(input) {
	return Math.max(...input.map(getId));
}

function getId(pass) {
	const row = parseInt(pass.slice(0, 7).split('').map(x => x === 'F' ? 0 : 1).join(''), 2);
	const col = parseInt(pass.slice(7, 10).split('').map(x => x === 'L' ? 0 : 1).join(''), 2);
	return row * 8 + col;
}

function parseInput(str) {
	return str.split('\n');
}
