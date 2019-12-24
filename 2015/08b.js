const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname,
	path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run(input) {
	return input.split('\n').map(score).reduce((a, b) => a + b);
}

function score(line) {
	let len = 2;
	for (let i = 0; i < line.length; ++i) {
		if (line[i] === '\\' || line[i] === '"') {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len - line.length;
}

assert.strictEqual(run(`""
"abc"
"aaa\\"aaa"
"\\x27"`), 19);

console.log(run(input));
