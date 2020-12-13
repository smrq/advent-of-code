import {
	D, PriorityQueue, astar, bigIntChineseRemainder, bigIntLargestPowerOf2Below,
	bigIntModMulInverse, bigIntPowerRemainder, cell2d, cell3d, flatten, gcd,
	getRawInput, iter1, iter2, iter3, iter4, lcm, maxBy, memo, minBy, modulo,
	orthodiagonalOffsets, permutations, product, runTests, selectBy, setDifference,
	setIntersection, setUnion, sum
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
		// return parseInt(line, 10);
		// return parseInstruction(line);
		// return line.split('').map(x => x);

		// const [_, a, b] = /(\w+) (\d+)/.exec(line);
		// return [a, b];
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