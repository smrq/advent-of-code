const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run({ input, endPosition, deckSize, iterations }) {
	let instructions = compressInstructions(parseInput(input), deckSize);
	instructions = duplicateInstructions(instructions, iterations, deckSize);
	return findStartPosition(instructions, endPosition, deckSize);
}

function duplicateInstructions(instructions, iterations, deckSize) {
	const instructionMap = new Map([[1n, instructions]]);
	for (let i = 2n; i <= iterations; i *= 2n) {
		instructions = compressInstructions([
			...instructions,
			...instructions
		], deckSize);
		instructionMap.set(i, instructions);
	}

	instructions = [];
	for (let [k, i] of instructionMap.entries()) {
		if (iterations & k) {
			instructions = compressInstructions(
				[...instructions, ...i],
				deckSize);
		}
	}

	return instructions;
}

function parseInput(input) {
	return input.split('\n').map(instruction => {
		if (match = /cut (-?\d+)/.exec(instruction)) {
			return { type: 'cut', n: BigInt(+match[1]) };
		} else if (match = /deal with increment (\d+)/.exec(instruction)) {
			return { type: 'deal', n: BigInt(+match[1]) };
		} else if (/deal into new stack/.test(instruction)) {
			return { type: 'stack' };
		} else {
			throw new Error('invalid instruction ' + instruction);
		}	
	});
}

function mod(p, q) {
	while (p < q) { p += q; }
	return p % q;
}

function gcd(a, b) {
	while (b != 0) {
		[a, b] = [b, a % b];
	}
	return a;
}

// ax = b (mod m)
function linearCongruence(a, b, m) {
	a = mod(a, m);
	b = mod(b, m);

	assert.strictEqual(gcd(a, m), 1n);

	if (a === 1n) return b;
	const y = linearCongruence(m, -b, a);
	return (m * y + b) / a;
}

function compressInstructions(instructions, deckSize) {
	while (instructions.filter(x => x.type === 'deal').length > 1 ||
		instructions.filter(x => x.type === 'stack').length > 1 ||
		instructions.filter(x => x.type === 'cut').length > 1) {
		let result = [];
		result.push(instructions.shift());
		while (instructions.length) {
			result.push(...combineInstructions(
				result.pop(),
				instructions.shift(),
				deckSize
			));
		}
		instructions = result;
	}

	return instructions;
}

function combineInstructions(a, b, len) {
	// Final order: deal, stack, cut

	if (a.type === 'cut' && b.type === 'stack') {
		// cut A, stack => stack, cut -A
		return [
			b,
			{ type: 'cut', n: -a.n }
		];
	}

	if (a.type === 'cut' && b.type === 'deal') {
		// cut A, deal B => deal B, cut A*B
		return [
			b,
			{ type: 'cut', n: mod(a.n * b.n, len) }
		];
	}

	if (a.type === 'stack' && b.type === 'deal') {
		// stack, deal B => deal B, stack, cut B-1
		return [
			b,
			a,
			{ type: 'cut', n: b.n - 1n }
		];
	}

	if (a.type === 'stack' && b.type === 'stack') {
		// stack, stack => 0
		return [];
	}

	if (a.type === 'cut' && b.type === 'cut') {
		// cut A, cub B => cut A+B
		return [
			{ type: 'cut', n: mod(a.n + b.n, len) }
		];
	}

	if (a.type === 'deal' && b.type === 'deal') {
		// deal A, deal B => deal A*B
		return [
			{ type: 'deal', n: mod(a.n * b.n, len) }
		]
	}

	return [a, b];
}

/*

deal with increment N: X => XN
deal into new stack:   X => -X - 1
cut N:                 X => X - N

stack, stack = 0

stack, deal B = deal B, stack, cut B-1
(-X - 1)B =
-BX - B =
-BX - 1 + 1 - B
(-(BX) - 1) - (B - 1)

deal A, deal B = deal A*B
(XA)B =
X(AB)

cut A, cut B = cut A+B
(X - A) - B =
X - (A + B)

cut A, deal B = deal B, cut A*B
(X - A)B =
XB - AB =
(XB) - AB

cut A, stack = stack, cut -A
-(X - A) - 1 =
A - X - 1 =
(-X - 1) - (-A)

*/

function runInstructions(instructions, deckSize) {
	let deck = Array(deckSize).fill().map((_, i) => i);

	for (let instruction of instructions) {
		if (instruction.type === 'cut') {
			const n = Number(instruction.n);
			deck = [
				...deck.slice(n),
				...deck.slice(0, n)
			];
		} else if (instruction.type === 'deal') {
			const n = Number(instruction.n);
			let newDeck = [];
			for (let i = 0; i < deck.length; ++i) {
				newDeck[(i * n) % deck.length] = deck[i];
			}
			deck = newDeck;
		} else if (instruction.type === 'stack') {
			deck = deck.reverse();
		} else {
			throw new Error('invalid instruction ' + instruction);
		}
	}

	return deck;
}

function findEndPosition(instructions, position, deckSize) {
	for (let instruction of instructions) {
		if (instruction.type === 'cut') {
			position = mod(position - instruction.n, deckSize);
		} else if (instruction.type === 'deal') {
			position = mod(position * instruction.n, deckSize);
		} else if (instruction.type === 'stack') {
			position = deckSize - 1n - position;
		} else {
			throw new Error('invalid instruction ' + instruction);
		}
	}
	return position;
}

function findStartPosition(instructions, position, deckSize) {
	for (let instruction of [...instructions].reverse()) {
		if (instruction.type === 'cut') {
			position = mod(position + instruction.n, deckSize);
		} else if (instruction.type === 'deal') {
			// n * x0 = x1 (mod len)
			position = linearCongruence(instruction.n, position, deckSize);
		} else if (instruction.type === 'stack') {
			position = deckSize - 1n - position;
		}
	}
	return position;
}

test(`deal with increment 7
deal into new stack
deal into new stack`, [0,3,6,9,2,5,8,1,4,7]);

test(`cut 6
deal with increment 7
deal into new stack`, [3,0,7,4,1,8,5,2,9,6]);

test(`deal with increment 7
deal with increment 9
cut -2`, [6,3,0,7,4,1,8,5,2,9]);

test(`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`, [9,2,5,8,1,4,7,0,3,6]);

function test(input, expected) {
	const deckSize = BigInt(expected.length);
	let instructions = parseInput(input);
	instructions = compressInstructions(instructions, deckSize);

	for (let i = 0; i < expected.length; ++i) {
		const startPosition = BigInt(expected[i]);
		const endPosition = BigInt(i);

		assert.strictEqual(
			findEndPosition(instructions, startPosition, deckSize),
			endPosition,
			`findEndPosition(${startPosition})`);
		assert.strictEqual(
			findStartPosition(instructions, endPosition, deckSize),
			startPosition,
			`findStartPosition(${endPosition})`);
	}
}

console.log(run({
	input,
	endPosition: 2020n,
	deckSize: 119315717514047n,
	iterations: 101741582076661n
}));
