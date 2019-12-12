const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	['abba[mnop]qrst\nabcd[bddb]xyyx\naaaa[qwer]tyui\nioxxoj[asdfgh]zxcvbn', 2]
];

function run(input) {
	return input.split('\n')
		.filter(line => /(\w)(?!\1)(\w)\2\1/.test(line) &&
			!/\[[^\]]*(\w)(?!\1)(\w)\2\1[^\]]*\]/.test(line))
		.length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
