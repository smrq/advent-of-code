const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('11.txt', 'utf-8').trim();
const tests = [
	['ne,ne,ne', 3],
	['ne,ne,sw,sw', 0],
	['ne,ne,s,s', 2],
	['se,sw,se,sw,sw', 3],
];

function run(input) {
	let position = { x: 0, y: 0, z: 0 };
	for (let direction of input.split(',')) {
		switch (direction) {
			case 'nw': --position.x; ++position.y; break;
			case 'se': ++position.x; --position.y; break;
			case 's': --position.y; ++position.z; break;
			case 'n': ++position.y; --position.z; break;
			case 'ne': --position.z; ++position.x; break;
			case 'sw': ++position.z; --position.x; break;
		}
	}
	return distance({ x: 0, y: 0, z: 0 }, position);
}

function distance(a, b) {
	return (Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z)) / 2;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));