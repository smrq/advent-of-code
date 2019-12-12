const assert = require('assert');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const input = fs.readFileSync('05.txt', 'utf-8').trim();
const tests = [
	['abc', '05ace8e3']
];

function run(input) {
	let result = [null, null, null, null, null, null, null, null];
	let found = 0;
	const hashBase = crypto.createHash('md5').update(input);
	for (let i = 0; found < 8; ++i) {
		const hash = hashBase.copy().update(String(i)).digest('hex');
		if (hash.slice(0, 5) === '00000') {
			if (/[01234567]/.test(hash[5]) && result[+hash[5]] == null) {
				result[+hash[5]] = hash[6];
				++found;
			}
		}
		if (i % 13579 === 0) {
			process.stdout.write('\r' +
				chalk.yellow(String(i).padStart(10)) + ' ' + 
				result.map((c, i) => c === null ?
					chalk.red(hash[i]) :
					chalk.green(c)).join(''));
		}
	}
	process.stdout.write('\r' + ''.padEnd(20, ' ') + '\r');
	return result.join('');
}

// for (let [input, output] of tests) {
// 	assert.strictEqual(run(input), output);
// }
console.log(run(input));
