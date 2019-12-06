const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('06.txt', 'utf-8').trim();
const tests = [
	[`COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L`, 42]
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

	let result = 0;
	for (let child of parentMap.keys()) {
		result += countOrbits(child);
	}

	return result;

	function countOrbits(node) {
		let result = 0;
		while (parentMap.has(node)) {
			++result;
			node = parentMap.get(node);
		}
		return result;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
