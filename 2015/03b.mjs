import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('03.txt', 'utf-8').trim();
const tests = [
	['^v', 3],
	['^>v<', 3],
	['^v^v^v^v^v', 11]
];

function run(input) {
	let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
	let houses = new Set([`0,0`]);

	let i = 0;
	for (;;) {
		switch (input[i++]) {
			case '<': --x1; break;
			case '>': ++x1; break;
			case '^': --y1; break;
			case 'v': ++y1; break;
		}
		houses.add(`${x1},${y1}`);
		if (i >= input.length) break;

		switch (input[i++]) {
			case '<': --x2; break;
			case '>': ++x2; break;
			case '^': --y2; break;
			case 'v': ++y2; break;
		}
		houses.add(`${x2},${y2}`);
		if (i >= input.length) break;
	}

	return houses.size;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));