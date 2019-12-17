const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = [fs.readFileSync(inputFilename, 'utf-8').trim(), 272];
const tests = [
	[['10000', 20], '01100']
];

function run([input, size]) {
	while (input.length < size) {
		input = dragon(input);
	}
	input = input.slice(0, size);
	do {
		input = checksum(input);
	} while (input.length % 2 === 0);
	return input;
}

function dragon(str) {
	return str + '0' + str.split('').reverse().map(c => c === '0' ? '1' : '0').join('');
}

function checksum(str) {
	let result = '';
	for (let i = 0; i < str.length; i += 2) {
		if (str[i] === str[i + 1]) {
			result += '1';
		} else {
			result += '0';
		}
	}
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
