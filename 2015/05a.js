const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run(input) {
	return input.split('\n').filter(line => isNice(line)).length;
}

function isNice(line) {
	return line.split(/[aeiou]/).length > 3 &&
		/(.)\1/.test(line) &&
		!/ab|cd|pq|xy/.test(line);
}

console.log(run(input));