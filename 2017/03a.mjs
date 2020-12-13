import assert from 'assert';
import fs from 'fs';
const input = +fs.readFileSync('03.txt', 'utf-8').trim();
const tests = [
	[1, 0],
	[12, 3],
	[23, 2],
	[1024, 31]
];

function run(input) {
	if (input === 1) return 0;
	const ring = Math.ceil((Math.sqrt(input) + 1) / 2) - 1;
	const corner = (2*ring+1)*(2*ring+1);
	const lateralDistance = Math.abs((corner - input) % (ring * 2) - ring);
	return ring + lateralDistance;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));