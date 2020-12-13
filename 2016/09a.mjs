import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
const input = fs.readFileSync('09.txt', 'utf-8').trim();
const tests = [
	['ADVENT', 6],
	['A(1x5)BC', 7],
	['(3x3)XYZ', 9],
	['A(2x2)BCD(2x2)EFG', 11],
	['(6x1)(1x3)A', 6],
	['X(8x2)(3x3)ABCY', 18],
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
		
		result += len * times;
		str = str.slice(len);
	}
	return result + str.length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
