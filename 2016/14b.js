const assert = require('assert');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const input = fs.readFileSync('14.txt', 'utf-8').trim();
const tests = [
	// ['abc', 22859]
];

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

function memo(fn) {
	const cache = new Map();
	return (...args) => {
		const key = args.join('|');
		if (!cache.has(key)) {
			cache.set(key, fn(...args));
		}
		return cache.get(key);
	}
}

const stretchedMd5 = memo(function stretchedMd5(string) {
	for (let i = 0; i < 2017; ++i) {
		string = md5(string);
	}
	return string;
});

function run(input) {
	const lastMatch = {};
	for (let i = 0; i < 16; ++i) {
		lastMatch[i.toString(16)] = null;
	}

	const keys = [];
	for (let i = -1000; keys.length < 64; ++i) {
		const hash1000 = stretchedMd5(input + String(i + 1000));
		const re = /([0-9a-f])\1\1\1\1/g;
		while (match = re.exec(hash1000)) {
			lastMatch[match[1]] = i + 1000;
		}

		if (i >= 0) {
			const hash = stretchedMd5(input + String(i));
			let match = /([0-9a-f])\1\1/.exec(hash);
			if (match) {
				if (lastMatch[match[1]] != null && lastMatch[match[1]] > i) {
					process.stdout.write('.');
					keys.push({ i, hash });
				}
			}
		}
	}

	process.stdout.write('\n');

	return keys[63].i;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
