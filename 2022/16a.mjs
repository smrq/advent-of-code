import * as L from '../lib.mjs';
import { inspect } from 'util';

L.runTests(args => run(args), [
	parseInput(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`), 1651
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(valves) {
	const totalTime = 30;
	const start = 'AA';
	const distanceMap = generateDistanceMap(valves);

	const path = L.astar({
		start: { elapsed: 0, location: start, unopened: new Set(distanceMap.get(start).keys()) },
		goal: 'end',
		key: (node) => {
			if (typeof node === 'string') return node;
			return `${node.elapsed}|${node.location}|${[...node.unopened].sort().join(',')}`;
		},
		neighbors: (node) => {
			const result = ['end'];
			for (let dest of node.unopened) {
				const distance = distanceMap.get(node.location).get(dest);
				const t = node.elapsed + distance + 1;
				if (t <= totalTime) {
					const newUnopened = new Set(node.unopened);
					newUnopened.delete(dest);
					result.push({ location: dest, elapsed: t, unopened: newUnopened, lastOpened: dest });
				}
			}
			return result;
		},
		cost: (current, neighbor) => {
			if (neighbor === 'end') return 0;
			const remainingTime = totalTime - neighbor.elapsed;
			return -remainingTime * valves.get(neighbor.lastOpened).flow;
		},
		heuristic: (node) => {
			// must be an overestimate in the negative direction
			if (node === 'end') return 0;
			if (node.unopened.size === 0) return 0;

			const unopenedValves = [...node.unopened].sort((a, b) => valves.get(b).flow - valves.get(a).flow);

			let estimate = 0;
			let t = node.elapsed;
			while (t < totalTime && unopenedValves.length) {
				const dest = unopenedValves.shift();
				const distance = Math.min(...distanceMap.get(dest).values());
				const remainingTime = totalTime - t;
				estimate += -remainingTime * valves.get(dest).flow;
				t += distance + 1;
			}
			return estimate;
		},
	});

	// console.error(inspect(path, { depth: Infinity }));

	return -path.cost;
}

function generateDistanceMap(input) {
	const graph = new Map();
	const prunedNodes = [...input.entries()].filter(([name, { flow }]) => flow > 0 || name === 'AA').map(([name]) => name);
	for (let start of prunedNodes) {
		const edges = new Map();

		let distance = 0;
		let open = new Set([start]);

		while (open.size) {
			let nextOpen = new Set();
			for (let name of open) {
				if (edges.has(name)) continue;
				edges.set(name, distance);
				for (let neighbor of input.get(name).tunnels) {
					nextOpen.add(neighbor);
				}
			}
			open = nextOpen;
			++distance;
		}

		const prunedEdges = new Map();
		for (let dest of prunedNodes) {
			if (start !== dest) {
				prunedEdges.set(dest, edges.get(dest));
			}
		}

		graph.set(start, prunedEdges);
	}
	
	return graph;
}

function parseInput(str) {
	return new Map(str.trim().split('\n').map(line => {
		let [_, name, flow, tunnels] = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w, ]+)/.exec(line);
		flow = parseInt(flow, 10);
		tunnels = tunnels.split(', ');
		return [name, { flow, tunnels }];
	}));
}
