import {
	D, getRawInput, runTests,
	PriorityQueue, memo,
	zip, sum, product, flatten, selectBy, minBy, maxBy, arrayUnion, arrayIntersection, arrayDifference, permutations,
	setUnion, setIntersection, setDifference,
	gcd, lcm, modulo, largestPowerOf2Below, powerRemainder, modMulInverse, chineseRemainder,
	iter1, iter2, iter3, iter4,
	astar, orthodiagonalOffsets, cell2d, cell3d,
} from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

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

function parseInput(str) {
	return str.split('\n').map(line => {
		return line;
		// return line.split('').map(x => x);
	});
}



// INTCODE

function interpret(program) {
	let acc = 0;
	let pc = 0;
	// let visited = new Set();
	while (pc < program.length && pc >= 0) {
		// if (visited.has(pc)) break;
		// visited.add(pc);

		const { op, value } = program[pc];
		switch (op) {
			case 'nop':
				++pc;
				break;
			case 'acc':
				acc += value;
				++pc;
				break;
			case 'jmp':
				pc += value;
				break;
		}
	}
	return acc;
}

function parseInstruction(str) {
	const [op, value] = str.split(' ');
	return { op, value: +value };
}