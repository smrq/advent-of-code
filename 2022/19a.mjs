import * as L from '../lib.mjs';
import { inspect } from 'util';

L.runTests(args => runBlueprint(args), [
	parseInput(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.`)[0], 9,
	parseInput(`Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`)[0], 12,
	parseInput(`Blueprint 1: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 3 ore and 8 obsidian.`)[0], 1,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(blueprints) {
	return L.sum(blueprints.map(blueprint => {
		L.D(`Simulating blueprint id #${blueprint.id}`);
		const geodes = runBlueprint(blueprint);
		return blueprint.id * geodes;
	}));
}

function runBlueprint({ costs }) {
	const maxT = 24;

	const maxBots = [
		Math.max(costs[1][0], costs[2][0], costs[3][0]),
		costs[2][1],
		costs[3][2],
		Infinity
	];

	const path = L.astar({
		start: { t: 0, resources: [0, 0, 0, 0], robots: [1, 0, 0, 0] },
		goal: 'end',
		key: node => node === 'end' ? 'end' : `${node.t}|${node.resources.join(',')}|${node.robots.join(',')}`,
		neighbors: node => {
			const results = ['end'];
			for (let type = 0; type < costs.length; ++type) {
				if (node.robots[type] >= maxBots[type]) continue;

				const ttc = calculateTimeToConstruct(costs[type], node.resources, node.robots);
				const nextT = node.t + ttc;
				if (nextT >= maxT) continue;

				const nextRobots = [...node.robots];
				nextRobots[type] += 1;

				const nextResources = payResources(
					generateResources(ttc, node.resources, node.robots),
					costs[type]);

				results.push({
					t: nextT,
					resources: nextResources,
					robots: nextRobots,
				});
			}
			return results;
		},
		cost: (current, neighbor) => {
			const neighborResources = neighbor === 'end' ?
				generateResources(maxT - current.t, current.resources, current.robots) :
				neighbor.resources;
			return -(neighborResources[3] - current.resources[3]);
		},
		heuristic: node => {
			if (node === 'end') return 0;

			const robots = [...node.robots];
			let resourcePools = [...Array(costs.length)].map(_ => [...node.resources]);

			for (let t = node.t; t < maxT; ++t) {
				for (let type = 0; type < resourcePools.length; ++type) {
					const rs = resourcePools[type];

					if (calculateTimeToConstruct(costs[type], resourcePools[type], robots) === 1) {
						resourcePools[type] = payResources(
							generateResources(1, resourcePools[type], robots),
							costs[type]);
						robots[type] += 1;
					} else {
						resourcePools[type] = generateResources(1, resourcePools[type], robots);
					}
				}
			}

			return -(resourcePools[3][3]);
		},
	});

	L.D(inspect(path, { depth: Infinity }));
	return -path.cost;
}

function calculateTimeToConstruct(costs, resources, robots) {
	return Math.max(
		...L.zip(costs, resources, robots).map(([cost, x, dx]) => (
			cost === 0 ? 0 : Math.ceil((cost - x) / dx)
		))
	) + 1;
}

function generateResources(turns, resources, robots) {
	return L.zip(resources, robots).map(([x, dx]) => x + turns*dx);
}

function payResources(resources, costs) {
	return L.zip(resources, costs).map(([x, cost]) => x - cost);
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const match = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./.exec(line);
		const [id, oreCostOre, clayCostOre, obsidianCostOre, obsidianCostClay, geodeCostOre, geodeCostObsidian] = match.slice(1).map(n => parseInt(n, 10));
		return {
			id,
			costs: [
				[oreCostOre, 0, 0, 0],
				[clayCostOre, 0, 0, 0],
				[obsidianCostOre, obsidianCostClay, 0, 0],
				[geodeCostOre, 0, geodeCostObsidian, 0],
			]
		};
	});
}
