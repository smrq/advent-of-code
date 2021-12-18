import * as L from '../lib.mjs';

class Node {
	constructor(v) {
		if (Array.isArray(v)) {
			this.value = v.map(x => x instanceof Node ? x : new Node(x));
		} else {
			this.value = v;
		}
	}
	isPair() { return Array.isArray(this.value); }
	toJSON() { return this.value; }
	toString() { return JSON.stringify(this); }
}

L.runTests(magnitude, [
	new Node([[1,2],[[3,4],5]]), 143,
	new Node([[[[0,7],4],[[7,8],[6,0]]],[8,1]]), 1384,
	new Node([[[[1,1],[2,2]],[3,3]],[4,4]]), 445,
	new Node([[[[3,0],[5,3]],[4,4]],[5,5]]), 791,
	new Node([[[[5,0],[7,4]],[5,5]],[6,6]]), 1137,
	new Node([[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]), 3488,
]);

L.runTests(args => run(args), [
	parseInput(`[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`), 4140
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let sum = input
		.map(line => new Node(line))
		.reduce((a, b) => add(a, b));
	return magnitude(sum);
}

function add(a, b) {
	let n = new Node([a, b]);
	for (;;) {
		if (explode(n, n, [])) {
			continue;
		}
		if (split(n)) {
			continue;
		}
		break;
	}
	return n;
}

function explode(root, node, path) {
	if (!node.isPair()) {
		return false;
	}
	if (path.length === 4) {
		incrementLeft(root, path, node.value[0].value);
		incrementRight(root, path, node.value[1].value);
		node.value = 0;
		return true;
	}
	return explode(root, node.value[0], [...path, 0]) ||
		explode(root, node.value[1], [...path, 1]);
}

function incrementLeft(root, path, amount) {
	if (path.every(n => n === 0)) return;
	
	path = path.slice(0, path.lastIndexOf(1));
	path.push(0);

	let node = root;
	for (let p of path) {
		node = node.value[p];
	}
	while (node.isPair()) {
		node = node.value[1];
	}
	node.value += amount;
}

function incrementRight(root, path, amount) {
	if (path.every(n => n === 1)) return;

	path = path.slice(0, path.lastIndexOf(0));
	path.push(1);

	let node = root;
	for (let p of path) {
		node = node.value[p];
	}
	while (node.isPair()) {
		node = node.value[0];
	}
	node.value += amount;
}

function split(node) {
	if (node.isPair()) {
		return split(node.value[0]) || split(node.value[1]);
	} else if (node.value >= 10) {
		node.value = [
			new Node(Math.floor(node.value / 2)),
			new Node(Math.ceil(node.value / 2)),
		];
		return true;
	}
	return false;
}

function magnitude(node) {
	if (node.isPair()) {
		return 3*magnitude(node.value[0]) + 2*magnitude(node.value[1]);
	} else {
		return node.value;
	}
}

function parseInput(str) {
	return L.autoparse(str)
		.map(line => eval(line));
}
