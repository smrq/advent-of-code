const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('06.txt', 'utf-8').trim();
const tests = [
	[`COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN`, 4]
];

function parseInput(input) {
	return input.split('\n').map(line => line.split(')'));
}

function run(input) {
	const pairs = parseInput(input);

	const parentMap = new Map();
	for (let [parent, child] of pairs) {
		parentMap.set(child, parent);
	}

	const distanceMap = new Map();
	for (let node = parentMap.get('YOU'), n = 0;
		node != null;
		node = parentMap.get(node), ++n) {
		distanceMap.set(node, n);
	}
	for (let node = parentMap.get('SAN'), n = 0;
		node != null;
		node = parentMap.get(node), ++n) {
		if (distanceMap.has(node)) {
			return n + distanceMap.get(node);
		}
	}
	return false;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
