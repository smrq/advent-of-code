import assert from 'assert';
import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function generateGraph(nodes) {
	const graph = new Map();
	for (let node of nodes) {
		graph.set(node.name, { ...node, src: [] });
	}
	for (let node of nodes) {
		for (let dest of node.dest) {
			if (!graph.has(dest)) {
				graph.set(dest, { type: undefined, name: dest, dest: [], src: [] });
			}
			graph.get(dest).src.push(node.name);
		}
	}
	return graph;
}

function simulate(graph, state, n) {
	const pulses = [['button', false, 'broadcaster']];

	while (pulses.length) {
		const [src, pulse, current] = pulses.shift();

		const node = graph.get(current);
		switch (node.type) {
			case undefined: {
				if (node.name === 'broadcaster') {
					pulses.push(...node.dest.map(dest => [node.name, false, dest]));
				}
				break;
			}

			case '%': {
				if (pulse === false) {
					const value = state.ff.get(node.name);
					state.ff.set(node.name, !value);
					pulses.push(...node.dest.map(dest => [node.name, !value, dest]));
				}
				break;
			}

			case '&': {
				const i = node.src.indexOf(src);
				const memory = state.conj.get(node.name);
				memory.splice(i, 1, pulse);
				const value = !memory.every(x => x);
				pulses.push(...node.dest.map(dest => [node.name, value, dest]));

				if (state.activations[node.name] && value) {
					state.activations[node.name].push(n);
				}
				break;
			}
		}
	}
	return state;
}

function run(input) {
	const graph = generateGraph(input);

	// Structure of graph:
	// broadcaster -> [%..] -> C -> [B..] -> A -> rx
	// Each set of flip flops is a full adder chain
	// After each chain reaches a specific value, it resets to 0
	// rx triggers when each chain rolls over simultaneously
	// This is when each node in B sends a high pulse to A

	const A = graph.get('rx').src;
	assert(A.length === 1);
	const B = graph.get(A[0]).src;

	let state = {
		ff: new Map([...graph.values()].filter(node => node.type === '%').map(node => [node.name, false])),
		conj: new Map([...graph.values()].filter(node => node.type === '&').map(node => [node.name, node.src.map(_ => false)])),
		activations: B.reduce((obj, src) => {
			obj[src] = [];
			return obj;
		}, {}),
	}

	for (let n = 1;
		Object.values(state.activations).some(arr => !arr.length);
		++n
	) {
		state = simulate(graph, state, n);
	}

	return L.lcm(
		...Object.values(state.activations).map(arr => arr[0]),
	);
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [, type, name, dest] = /([%&])?(\w+) -> (.+)/.exec(line);
		dest = dest.split(', ');
		return { type, name, dest };
	});
}
