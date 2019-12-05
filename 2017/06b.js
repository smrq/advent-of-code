const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('06.txt', 'utf-8').trim();
const tests = [['0 2 7 0', 4]];

function run(input) {
	const seenStates = new Map();
	const banks = input.split(/\s+/).map(x => +x);
	seenStates.set(banks.join(','), 0);

	let cycles = 0;
	for (;;) {
		let blocks = Math.max(...banks);
		const selected = banks.indexOf(blocks);
		banks[selected] = 0;

		for (let i = 0; i < banks.length; ++i) {
			banks[i] += (blocks / banks.length) | 0;
		}
		blocks = blocks % banks.length;
		for (let i = (selected + 1) % banks.length; blocks > 0; i = (i + 1) % banks.length) {
			++banks[i];
			--blocks;
		}

		++cycles;

		const hash = banks.join(',');
		if (seenStates.has(hash)) {
			return cycles - seenStates.get(hash);
		} else {
			seenStates.set(hash, cycles);
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
