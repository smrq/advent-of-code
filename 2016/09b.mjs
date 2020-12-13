import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
const input = fs.readFileSync('09.txt', 'utf-8').trim();
const tests = [
	['(3x3)XYZ', 9],
	['X(8x2)(3x3)ABCY', 20],
	['(27x12)(20x12)(13x14)(7x10)(1x12)A', 241920],
	['(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', 445],
];

function run(input) {
	return decompressedLength(input);
}

function decompressedLength(str) {
	let result = 0;
	let match;
	while (match = /\((\d+)x(\d+)\)/.exec(str)) {
		const len = +match[1];
		const times = +match[2];

		result += match.index;
		str = str.slice(match.index + match[0].length);
		
		const repeatedStr = str.slice(0, len);
		result += decompressedLength(repeatedStr) * times;
		str = str.slice(len);
	}
	return result + str.length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
