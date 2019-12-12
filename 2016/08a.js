const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = [fs.readFileSync('08.txt', 'utf-8').trim(), 50, 6];
const tests = [
	[['rect 3x2\nrotate column x=1 by 1\nrotate row y=0 by 4\nrotate column x=1 by 1', 7, 3], 6]
];

function run([input, w, h]) {
	const display = Array(w * h).fill(' ');

	for (let instruction of input.split('\n')) {
		let match;
		if (match = /rect (\d+)x(\d+)/.exec(instruction)) {
			rect(display, +match[1], +match[2]);
		}
		else if (match = /rotate row y=(\d+) by (\d+)/.exec(instruction)) {
			rotateRow(display, +match[1], +match[2]);
		}
		else if (match = /rotate column x=(\d+) by (\d+)/.exec(instruction)) {
			rotateCol(display, +match[1], +match[2]);
		}
		else throw new Error(instruction);

		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				process.stdout.write(display[y * w + x]);
			}
			process.stdout.write('\n');
		}
		process.stdout.write('\n');
	}

	return display.filter(c => c === '\u2588').length;

	function rect(display, a, b) {
		for (let y = 0; y < b; ++y) {
			for (let x = 0; x < a; ++x) {
				display[y*w + x] = '\u2588';
			}
		}
	}

	function rotateRow(display, y, amount) {
		const newRow = [];
		for (let x = 0; x < w; ++x) {
			newRow[x] = display[y*w + mod(x - amount, w)];
		}
		for (let x = 0; x < w; ++x) {
			display[y*w + x] = newRow[x];
		}
	}

	function rotateCol(display, x, amount) {
		const newCol = [];
		for (let y = 0; y < h; ++y) {
			newCol[y] = display[mod(y - amount, h)*w + x];
		}
		for (let y = 0; y < h; ++y) {
			display[y*w + x] = newCol[y];
		}
	}
}

function mod(p, q) {
	while (p < 0) { p += q; }
	return p % q;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
