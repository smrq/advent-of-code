const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [
];

function nextRow(row) {
	return row.map((c, i) => {
		const l = i > 0 ? row[i - 1] : '.';
		const r = i < row.length - 1 ? row[i + 1] : '.';
		return ((l === '^' && c === '^' && r === '.') ||
			(l === '.' && c === '^' && r === '^') ||
			(l === '^' && c === '.' && r === '.') ||
			(l === '.' && c === '.' && r === '^')) ? '^' : '.';
	});
}

function run(input) {
	const map = [input.split('')];
	while (map.length < 40) {
		map.push(nextRow(map[map.length - 1]));
	}

	return map.map(line => line.join('')).join('').split('.').length - 1;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
