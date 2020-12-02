const { chalk, getRawInput, runTests, astar, permutations } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

// runTests(run, [

// ]);

console.log(run(input));

function run(input) {
	
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line;
	});
}
