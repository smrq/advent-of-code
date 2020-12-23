import { D, getRawInput, autoparse } from '../lib.mjs';

const input = parseInput(getRawInput());

console.log(run(input));

function run(input) {
	const minval = Math.min(...input);

	let maxval = Math.max(...input);
	input = [
		...input,
		...Array(1e6-input.length).fill().map((_,i) => i+maxval+1)
	];
	maxval = input[input.length-1];

	const nodes = input.map(i => ({ n: i }));
	for (let i = 1; i < nodes.length; ++i) {
		nodes[i-1].next = nodes[i];
	}
	nodes[nodes.length-1].next = nodes[0];

	const nodeMap = new Map();
	for (let node of nodes) {
		nodeMap.set(node.n, node);
	}

	let current = nodes[0];
	for (let i = 0; i < 10e6; ++i) {
		const picked = current.next;
		const picked2 = picked.next;
		const picked3 = picked2.next;
		const pickedNext = picked3.next;

		let dest = current.n;
		do {
			--dest;
			if (dest < minval) dest = maxval;
		}
		while ([picked.n, picked2.n, picked3.n].includes(dest));
		
		const destNode = nodeMap.get(dest);
		const destNext = destNode.next;

		current.next = pickedNext;
		destNode.next = picked;
		picked3.next = destNext;

		current = current.next;

		if (i % 1e6 === 0) { D(`${i}...`); }
	}

	return nodeMap.get(1).next.n * nodeMap.get(1).next.next.n;
}

function parseInput(str) {
	return str.split('').map(x => +x)
}
