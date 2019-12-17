const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [
	[`Disc #1 has 5 positions; at time=0, it is at position 4.\nDisc #2 has 2 positions; at time=0, it is at position 1.`, 5]
];

function parseInput(input) {
	return input.split('\n').map((line, i) => {
		const match = /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./.exec(line);
		assert.strictEqual(+match[1], i + 1);
		return {
			index: +match[1],
			positions: +match[2],
			phase: +match[3]
		};
	});
}

function makeGenerator({ positions, phase, index }) {
	return function *() {
		let n = (2 * positions - phase - index) % positions;
		for (;;) {
			yield n;
			n += positions;
		}
	}
}

function run(input) {
	const discs = parseInput(input);
	const generators = discs.map(d => makeGenerator(d)());

	let n = generators[0].next().value;
	let g_n = 0;

	outer: for (;;) {
		for (let g = (g_n + 1) % generators.length; g !== g_n; g = (g + 1) % generators.length) {
			let n2;
			while ((n2 = generators[g].next().value) < n);
			if (n2 > n) {
				n = n2;
				g_n = g;
				continue outer;
			}
		}
		return n;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
