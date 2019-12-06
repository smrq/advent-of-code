const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('12.txt', 'utf-8').trim();
const tests = [
	['0 <-> 2\n1 <-> 1\n2 <-> 0, 3, 4\n3 <-> 2, 4\n4 <-> 2, 3, 6\n5 <-> 6\n6 <-> 4, 5', 2],
];

function parseInput(input) {
	const result = new Map();
	for (let [node, connected] of input.split('\n').map(parseLine)) {
		result.set(node, { connected });
	}
	return result;
}

function parseLine(line) {
	let [node, connected] = line.split(' <-> ');
	node = +node;
	connected = connected.split(', ').map(x => +x);
	return [node, connected];
}

function run(input) {
	const nodes = parseInput(input);

	let groupCount = 0;
	while (nodes.size) {
		++groupCount;
		let openSet = [nodes.keys().next().value];
		while (openSet.length) {
			const key = openSet.pop();
			const current = nodes.get(key);
			if (current) {
				openSet = openSet.concat(current.connected);
				nodes.delete(key);
			}
		}
	}

	return groupCount;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
