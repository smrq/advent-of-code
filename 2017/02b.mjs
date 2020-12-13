import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('02.txt', 'utf-8').trim();
const tests = [
	[`5 9 2 8\n9 4 7 3\n3 8 6 5`, 9]
];

function run(input) {
	return input.split('\n').map(line => {
		const values = line.split(/\s+/).map(x => +x);
		for (let i = 0; i < values.length; ++i) {
			for (let j = i + 1; j < values.length; ++j) {
				if (values[i] % values[j] === 0) { return values[i] / values[j]; }
				if (values[j] % values[i] === 0) { return values[j] / values[i]; }
			}
		}
	}).reduce((a, b) => a + b);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));