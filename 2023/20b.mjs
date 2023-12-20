import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	// Structure of graph:
	// broadcaster -> [%..] -> C -> [B..] -> A -> rx
	// Each set of flip flops is a full adder chain.
	// After each chain reaches a specific value, it resets to 0.
	// rx triggers when each chain rolls over simultaneously.
	const graph = new Map(input.map(node => [node.name, node]));
	const periods = graph.get('broadcaster').dest.map(start => {
		let n = 0;
		let i = 0;
		let node = graph.get(start);

		while (node) {
			const dests = node.dest.map(name => graph.get(name));
			if (dests.find(node => node.type === '&')) {
				n |= 1 << i;
			}
			++i;
			node = dests.find(node => node.type === '%');
		}

		return n;
	});
	return L.lcm(...periods);
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [, type, name, dest] = /([%&])?(\w+) -> (.+)/.exec(line);
		dest = dest.split(', ');
		return { type, name, dest };
	});
}
