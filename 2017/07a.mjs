import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	[`pbga (66)\nxhth (57)\nebii (61)\nhavc (66)\nktlj (57)\nfwft (72) -> ktlj, cntj, xhth\nqoyq (66)\npadx (45) -> pbga, havc, qoyq\ntknk (41) -> ugml, padx, fwft\njptl (61)\nugml (68) -> gyxo, ebii, jptl\ngyxo (61)\ncntj (57)`, 'tknk']
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const [_, name, weight, children] = /(\w+) \((\d+)\)(?: -> ([\w, ]+))?/.exec(line);
	return { name, weight: +weight, children: children ? children.split(', ') : [] };
}

function run(input) {
	const nodes = parseInput(input);
	const tree = new Map();

	for (let node of nodes) {
		tree.set(node.name, node);
	}

	for (let node of nodes) {
		for (let child of node.children) {
			tree.get(child).parent = node.name;
		}
	}

	return [...tree.values()].find(node => !node.parent).name;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
