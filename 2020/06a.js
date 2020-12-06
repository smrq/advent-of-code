const { getRawInput, sum, setUnion } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	return sum(input.map(group => setUnion(...group).size));
}

function parseInput(str) {
	return str.split('\n\n').map(line => {
		return line.split('\n').map(x => new Set(x.split('')));
	});
}
