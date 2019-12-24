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
	let len = 0;
	for (let i = 1; i < line.length - 1; ++i) {
		if (line[i] === '\\') {
			if (line[i + 1] === 'x') {
				i += 3;
			} else if (line[i + 1] === '\\') {
				i += 1;
			} else if (line[i + 1] === '"') {
				i += 1;
			}
		}
		++len;
	}
	return line.length - len;
}

assert.strictEqual(run(`""
"abc"
"aaa\\"aaa"
"\\x27"`), 12);

console.log(run(input));
