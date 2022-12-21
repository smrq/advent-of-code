import * as L from '../lib.mjs';

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

	let states = [{ t: 0, resources: [0, 0, 0, 0], robots: [1, 0, 0, 0] }];
	const mostGeodesByTurns = [...Array(maxT+1)].map(_ => 0);

	while (states.length) {
		const nextStates = [];

		L.D(`States: ${states.length}`);

		for (let state of states) {
			for (let type = 0; type < costs.length; ++type) {
				const ttc = calculateTimeToConstruct(costs[type], state.resources, state.robots);
				const nextT = state.t + ttc;
				if (nextT >= maxT) continue;

				const nextRobots = [...state.robots];
				nextRobots[type] += 1;

				const nextResources = L.zip(
					generateResources(ttc, state.resources, state.robots),
					costs[type]
				).map(([x, cost]) => x - cost);

				for (let i = 0; nextT + i <= maxT; ++i) {
					if (mostGeodesByTurns[nextT+i] < nextResources[3] + i*nextRobots[3]) {
						mostGeodesByTurns[nextT+i] = nextResources[3] + i*nextRobots[3];
					}
				}

				const nextState = {
					t: nextT,
					resources: nextResources,
					robots: nextRobots,
				};
				nextStates.push(nextState);
			}
		}

		states = nextStates.filter(state => state.resources[3] >= mostGeodesByTurns[state.t]);
	}

	L.D(`Geode count: ${mostGeodesByTurns[maxT]}`);

	return mostGeodesByTurns[maxT];
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
