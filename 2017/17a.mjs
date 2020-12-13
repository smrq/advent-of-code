import assert from 'assert';
import fs from 'fs';
const input = +fs.readFileSync('17.txt', 'utf-8').trim();
const tests = [
	[3, 638]
];

function run(input) {
	const arr = [0];
	let position = 0;

	for (let i = 1; i <= 2017; ++i) {
		position = (position + input) % arr.length + 1;
		arr.splice(position, 0, i);
	}

	return arr[(position + 1) % arr.length];
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
