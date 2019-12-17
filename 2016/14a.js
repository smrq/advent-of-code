const assert = require('assert');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const input = fs.readFileSync('14.txt', 'utf-8').trim();
const tests = [
	['abc', 22728]
];

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

function run(input) {
	const lastMatch = {};
	for (let i = 0; i < 16; ++i) {
		lastMatch[i.toString(16)] = null;
	}

	const keys = [];
	for (let i = -1000; keys.length < 64; ++i) {
		const hash1000 = md5(input + String(i + 1000));
		const re = /([0-9a-f])\1\1\1\1/g;
		while (match = re.exec(hash1000)) {
			lastMatch[match[1]] = i + 1000;
		}

		if (i >= 0) {
			const hash = md5(input + String(i));
			let match = /([0-9a-f])\1\1/.exec(hash);
			if (match) {
				if (lastMatch[match[1]] != null && lastMatch[match[1]] > i) {
					keys.push({ i, hash });
				}
			}
		}

	}

	return keys[63].i;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
