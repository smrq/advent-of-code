import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [
	['1122', 3],
	['1111', 4],
	['1234', 0],
	['91212129', 9],
];

function run(input) {
	let result = 0;
	for (let i = 0; i < input.length; ++i) {
		if (input[i] === input[(i + 1) % input.length]) {
			result += +input[i];
		}
	}
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));