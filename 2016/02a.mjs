import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('02.txt', 'utf-8').trim();
const tests = [
	[`ULL\nRRDDD\nLURDL\nUUUUD`, '1985']
];

function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}

const keypad = ['123','456','789'];
function run(input) {
	let x = 1;
	let y = 1;
	return input.split('\n').map(line => {
		for (let c of line) {
			switch (c) {
				case 'L': --x; break;
				case 'R': ++x; break;
				case 'U': --y; break;
				case 'D': ++y; break;
			}
			x = clamp(x, 0, 2);
			y = clamp(y, 0, 2);
		}
		return keypad[y][x];
	}).join('');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
