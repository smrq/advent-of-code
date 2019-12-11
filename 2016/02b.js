const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('02.txt', 'utf-8').trim();
const tests = [
	[`ULL\nRRDDD\nLURDL\nUUUUD`, '5DB3']
];

function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}

const keypad = [
	[null, null, null, null, null, null, null],
	[null, null, null, 1, null, null, null],
	[null, null, '2', '3', '4', null, null],
	[null, '5', '6', '7', '8', '9', null],
	[null, null, 'A', 'B', 'C', null, null],
	[null, null, null, 'D', null, null, null],
	[null, null, null, null, null, null, null]
];
function run(input) {
	let x = 1;
	let y = 3;
	return input.split('\n').map(line => {
		for (let c of line) {
			switch (c) {
				case 'L': if (keypad[y][x-1]) { --x; } break;
				case 'R': if (keypad[y][x+1]) { ++x; } break;
				case 'U': if (keypad[y-1][x]) { --y; } break;
				case 'D': if (keypad[y+1][x]) { ++y; } break;
			}
		}
		return keypad[y][x];
	}).join('');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
