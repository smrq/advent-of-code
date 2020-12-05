const { chalk, getRawInput, runTests, PriorityQueue, astar, permutations, sum, product, bigIntPowerRemainder, bigIntLargestPowerOf2Below } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [

]);

console.log(run(input));

function run(input) {
	
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line.split('').map(x => x);
	});
}
