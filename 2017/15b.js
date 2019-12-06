const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('15.txt', 'utf-8').trim();
const tests = [
	['Generator A starts with 65\nGenerator B starts with 8921', 309]
];

function run(input) {
	const [aStart, bStart] = input
		.split('\n')
		.map(line => +/(\d+)$/.exec(line)[1]);

	const aGen = makeGenerator(16807, aStart, 4); 
	const bGen = makeGenerator(48271, bStart, 8); 

	let score = 0;
	for (let i = 0; i < 5000000; ++i) {
		const a = aGen.next().value;
		const b = bGen.next().value;
		if ((a & 0xffff) === (b & 0xffff)) {
			++score;
		}
	}
	return score;
}

function makeGenerator(factor, start, multiple) {
	let n = start;
	return (function *() {
		for (;;) {
			n = iterate(n, factor);
			if (n % multiple === 0) {
				yield n;
			}
		}
	})();
}

function iterate(n, factor) {
	return (n * factor) % 0x7fffffff;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
