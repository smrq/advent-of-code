const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run(input) {
	return runInstructions(input, 10007).indexOf(2019);
}

function runInstructions(input, deckSize) {
	let deck = Array(deckSize).fill().map((_, i) => i);

	for (let instruction of input.split('\n')) {
		if (match = /cut (-?\d+)/.exec(instruction)) {
			const n = +match[1];
			deck = [
				...deck.slice(n),
				...deck.slice(0, n)
			];
		} else if (match = /deal with increment (\d+)/.exec(instruction)) {
			const n = +match[1];
			let newDeck = [];
			for (let i = 0; i < deck.length; ++i) {
				newDeck[(i * n) % deck.length] = deck[i];
			}
			deck = newDeck;
		} else if (/deal into new stack/.test(instruction)) {
			deck = deck.reverse();
		} else {
			throw new Error('invalid instruction ' + instruction);
		}
	}

	return deck;
}

for (let [input, deckSize, output] of [
[`deal with increment 7
deal into new stack
deal into new stack`, 10, [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]],
[`cut 6
deal with increment 7
deal into new stack`, 10, [3, 0, 7, 4, 1, 8, 5, 2, 9, 6]],
[`deal with increment 7
deal with increment 9
cut -2`, 10, [6, 3, 0, 7, 4, 1, 8, 5, 2, 9]],
[`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`, 10, [9, 2, 5, 8, 1, 4, 7, 0, 3, 6]]]) {
	assert.deepEqual(runInstructions(input, deckSize), output);
}

console.log(run(input));
