import {
	D, getRawInput, autoparse, runTests,
	PriorityQueue, memo,
	zip, sum, product, flatten, selectBy, minBy, maxBy, arrayUnion, arrayIntersection, arrayDifference, permutations, range,
	setUnion, setIntersection, setDifference,
	gcd, lcm, modulo, largestPowerOf2Below, powerRemainder, modMulInverse, chineseRemainder,
	astar, orthodiagonalOffsets, cell2d, cell3d,
} from '../lib.mjs';

const rawInput = getRawInput();
let input;
try { input = autoparse(rawInput); }
catch (e) {
	D(e);
	input = rawInput;
}

runTests(args => run(args), [

]);

console.log(run(input));

function run(input) {
	D(input);

	let result = 0;
	for (let item of input) {

	}
	return result;
}
