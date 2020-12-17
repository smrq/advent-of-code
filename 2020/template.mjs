import {
	D, getRawInput, autoparse, runTests,
	PriorityQueue, memo,
	zip, sum, product, flatten, selectBy, minBy, maxBy, arrayUnion, arrayIntersection, arrayDifference, permutations, range,
	setUnion, setIntersection, setDifference,
	gcd, lcm, modulo, largestPowerOf2Below, powerRemainder, modMulInverse, chineseRemainder,
	astar, orthodiagonalOffsets, cell2d, cell3d,
} from '../lib.mjs';

const input = parseInput(getRawInput());
D('[input]'); D(input);

runTests(args => run(args), [

]);

console.log(run(input));

function run(input) {

}

function parseInput(str) {
	return autoparse(str);
}
