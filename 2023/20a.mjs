import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`), 32000000,
	parseInput(`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`), 11687500,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function generateGraph(nodes) {
	const graph = new Map(nodes.map(node => [node.name, { ...node, src: [] }]));
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

function simulate(graph, state, debug = false) {
	const pulses = [['button', false, 'broadcaster']];

	while (pulses.length) {
		const [src, pulse, current] = pulses.shift();

		++state[pulse ? 'highCount' : 'lowCount'];

		debug && L.D(`${src} -${pulse ? 'high' : 'low'}-> ${current}`);

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
				break;
			}
		}
	}
	return state;
}

function run(input) {
	const graph = generateGraph(input);

	let state = {
		ff: new Map([...graph.values()].filter(node => node.type === '%').map(node => [node.name, false])),
		conj: new Map([...graph.values()].filter(node => node.type === '&').map(node => [node.name, node.src.map(_ => false)])),
		highCount: 0,
		lowCount: 0,
	}

	for (let i = 0; i < 1000; ++i) {
		state = simulate(graph, state, i === 0);
	}

	return state.highCount * state.lowCount;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [, type, name, dest] = /([%&])?(\w+) -> (.+)/.exec(line);
		dest = dest.split(', ');
		return { type, name, dest };
	});
}
