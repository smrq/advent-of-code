const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	['aba[bab]xyz', 1],
	['xyx[xyx]xyx', 0],
	['aaa[kek]eke', 1],
	['zazbz[bzb]cdb', 1],
	['aba[aaa]bab', 0],
	['aba[aaa]x[bab]', 1],
	['aba[aaa]bab[aaa]', 0],
	['aaa[aba]aaa[bab]', 0],
];

function run(input) {
	return input.split('\n')
		.filter(line => /(?:\[[^\]]*(\w)(?!\1)(\w)\1[^\]]*\](?:[^\[]|\[[^\]]*\])*\2\1\2|^(?:[^\[]|\[[^\]]*\])*(\w)(?!\3)(\w)\3(?:[^\[]|\[[^\]]*\])*\[[^\]]*\4\3\4[^\]]*\])/.test(line))
		.length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
