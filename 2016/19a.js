const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [
	[5, 3]
];

function iterate(arr) {
	const odd = arr.length % 2 === 1;
	arr = arr.filter((_, i) => i % 2 === 0);
	if (odd) {
		arr.unshift(arr.pop());
	}
	return arr;
}

function run(input) {
	let arr = Array(+input).fill().map((_, i) => i + 1);
	while (arr.length > 1) {
		arr = iterate(arr);
	}
	return arr[0];
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
