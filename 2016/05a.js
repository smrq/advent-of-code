const assert = require('assert');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const input = fs.readFileSync('05.txt', 'utf-8').trim();
const tests = [
	['abc', '18f47a30']
];

function run(input) {
	let result = '';
	const hashBase = crypto.createHash('md5').update(input);
	for (let i = 0; result.length < 8; ++i) {
		const hash = hashBase.copy().update(String(i)).digest('hex');
		if (hash.slice(0, 5) === '00000') {
			result += hash[5];
		}
		if (i % 13579 === 0) {
			process.stdout.write('\r' +
				chalk.yellow(String(i).padStart(10)) + ' ' + 
				chalk.green(result) +
				chalk.red(hash.slice(5, 13 - result.length)));
		}
	}
	process.stdout.write('\r' + ''.padEnd(20, ' ') + '\r');
	return result;
}

// for (let [input, output] of tests) {
// 	assert.strictEqual(run(input), output);
// }
console.log(run(input));
