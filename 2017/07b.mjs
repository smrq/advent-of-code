import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	[`pbga (66)\nxhth (57)\nebii (61)\nhavc (66)\nktlj (57)\nfwft (72) -> ktlj, cntj, xhth\nqoyq (66)\npadx (45) -> pbga, havc, qoyq\ntknk (41) -> ugml, padx, fwft\njptl (61)\nugml (68) -> gyxo, ebii, jptl\ngyxo (61)\ncntj (57)`, 60]
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const [_, name, weight, children] = /(\w+) \((\d+)\)(?: -> ([\w, ]+))?/.exec(line);
	return { name, weight: +weight, children: children ? children.split(', ') : [] };
}

function makeTree(input) {
	const nodes = parseInput(input);
	const tree = new Map();

	for (let node of nodes) {
		tree.set(node.name, node);
	}

	for (let [name, node] of [...tree]) {
		node.children = node.children.map(childName => {
			const child = tree.get(childName);
			tree.delete(childName);
			return child;
		});
	}
	return [...tree.values()][0];
}

function calculateTotalWeights(node) {
	for (let child of node.children) {
		calculateTotalWeights(child);
	}
	node.totalWeight = node.weight + node.children.reduce((acc, child) => acc + child.totalWeight, 0);
}

function findErroneousNode(node) {
	const unbalancedChild = node.children.find(child => !isBalanced(child));
	if (unbalancedChild) {
		return findErroneousNode(unbalancedChild);
	}

	if (node.children.length < 3) {
		return [node.children[0], node.children[1].totalWeight];
	}

	if (node.children[0].totalWeight !== node.children[1].totalWeight) {
		return node.children[2].totalWeight === node.children[0].totalWeight ?
			[node.children[1], node.children[0].totalWeight] :
			[node.children[0], node.children[1].totalWeight];
	} else {
		return [
			node.children.find(child => child.totalWeight !== node.children[0].totalWeight),
			node.children[0].totalWeight
		];
	}
}

function isBalanced(node) {
	if (node.children.length === 0) return true;
	if (node.children.length === 1) return isBalanced(node.children[0]);
	const weights = node.children.map(child => child.totalWeight);
	return weights.every(w => w === weights[0]);
}

function run(input) {
	const tree = makeTree(input);
	calculateTotalWeights(tree);
	const [badNode, expectedWeight] = findErroneousNode(tree);
	return badNode.weight + (expectedWeight - badNode.totalWeight);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
