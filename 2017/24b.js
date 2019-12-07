const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('24.txt', 'utf-8').trim();
const tests = [
	[`0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10`, 19]
];

function parseInput(input) {
	const components = input.split('\n').map(id => {
		const values = id.split('/').map(n => +n);
		return {
			id,
			values,
			weight: values[0] + values[1]
		};
	});
	return partitionComponentsByPortCount(components);
}

function partitionComponentsByPortCount(components) {
	const result = new Map();
	for (let component of components) {
		addComponent(result, component);
	}
	return result;
}

function otherValue(values, n) {
	return (values[0] === n) ? values[1] : values[0];
}

function removeComponent(components, c) {
	components.get(c.values[0]).delete(c);
	components.get(c.values[1]).delete(c);
}

function addComponent(components, c) {
	for (let value of c.values) {
		if (!components.has(value)) {
			components.set(value, new Set());
		}
		components.get(value).add(c);
	}
}

function run(input) {
	const components = parseInput(input);
	const [path, weight] = search(components);
	console.log(path.map(c => c.id));
	return weight;
}

function search(components) {
	return _search(components, 0, [], 0);

	function _search(components, position, visited, weight) {
		const set = components.get(position);
		if (!set) return [visited, weight];

		const unvisited = [...set].filter(c => !visited.includes(c));
		if (!unvisited.length) return [visited, weight];

		const results = unvisited.map(u => _search(
			components,
			otherValue(u.values, position),
			[...visited, u],
			weight + u.weight));

		results.sort((a, b) =>
			(b[0].length - a[0].length) ||
			(b[1] - a[1]));

		return results[0];
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
