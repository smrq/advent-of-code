const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('15.txt', 'utf-8').trim();
const tests = [
	['Generator A starts with 65\nGenerator B starts with 8921', 588]
];

function run(input) {
	let [a, b] = input.split('\n').map(line => +/(\d+)$/.exec(line)[1]);
	let score = 0;
	for (let i = 0; i < 40000000; ++i) {
		if ((a & 0xffff) === (b & 0xffff)) {
			++score;
		}
		a = iterate(a, 16807);
		b = iterate(b, 48271);
	}
	return score;
}

function iterate(n, factor) {
	return (n * factor) % 0x7fffffff;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
