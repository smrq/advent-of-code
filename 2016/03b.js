const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('03.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	const re = /\s*(\d+)\s+(\d+)\s+(\d+)\s*\n\s*(\d+)\s+(\d+)\s+(\d+)\s*\n\s*(\d+)\s+(\d+)\s+(\d+)/g;
	let match;
	let result = 0;
	while (match = re.exec(input)) {
		const [a1, b1, c1, a2, b2, c2, a3, b3, c3] = match.slice(1).map(x => +x);

		const a = [a1, a2, a3].sort((a, b) => a - b);
		const b = [b1, b2, b3].sort((a, b) => a - b);
		const c = [c1, c2, c3].sort((a, b) => a - b);

		if (a[0] + a[1] > a[2]) { ++result; }
		if (b[0] + b[1] > b[2]) { ++result; }
		if (c[0] + c[1] > c[2]) { ++result; }
	}
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
