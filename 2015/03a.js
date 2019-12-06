const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('03.txt', 'utf-8').trim();
const tests = [
	['>', 2],
	['^>v<', 4],
	['^v^v^v^v^v', 2]
];

function run(input) {
	let x = 0;
	let y = 0;
	let houses = new Set([`${x},${y}`]);

	for (let c of input) {
		switch (c) {
			case '<': --x; break;
			case '>': ++x; break;
			case '^': --y; break;
			case 'v': ++y; break;
		}
		houses.add(`${x},${y}`);
	}

	return houses.size;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));