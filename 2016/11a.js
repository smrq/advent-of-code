const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = fs.readFileSync('11.txt', 'utf-8').trim();
const tests = [
	[`The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.\nThe second floor contains a hydrogen generator.\nThe third floor contains a lithium generator.\nThe fourth floor contains nothing relevant.`, 11]
];

class PriorityQueue {
	constructor() {
		this.data = [];
		this.priorities = [];
		this.length = this.data.length;
	}

	push(item, priority) {
		const index = this.priorities.findIndex(p => p > priority);
		this.data.splice(index, 0, item);
		this.priorities.splice(index, 0, priority);
		this.length = this.data.length;
	}

	pop() {
		const result = this.data.shift();
		this.priorities.shift();
		this.length = this.data.length;
		return result;
	}
}

function astar({ start, goal, key, neighbors, cost, heuristic }) {
	const parents = new Map();

	const gScores = new Map();
	gScores.set(key(start), 0);
	
	const fScores = new Map();
	fScores.set(key(start), heuristic(start, goal));

	const keyGoal = key(goal);

	const openSet = new PriorityQueue();
	openSet.push(start, heuristic(start, goal));

	while (openSet.length) {
		const current = openSet.pop();
		const keyCurrent = key(current);

		if (keyCurrent === keyGoal) {
			return getPath(parents, current);
		}

		for (let neighbor of neighbors(current)) {
			const keyNeighbor = key(neighbor);

			const gScore = gScores.get(keyCurrent) + cost(current, neighbor);
			if (!gScores.has(keyNeighbor) ||
				gScores.get(keyNeighbor) > gScore
			) {
				const hScore = heuristic(neighbor, goal);
				parents.set(keyNeighbor, current);
				gScores.set(keyNeighbor, gScore);
				fScores.set(keyNeighbor, gScore + hScore);
				openSet.push(neighbor, gScore + hScore);
			}
		}
	}

	return false;

	function getPath(parents, current) {
		const path = [current];
		let totalCost = 0;
		while (parents.has(key(current))) {
			const parent = parents.get(key(current));
			totalCost += cost(parent, current);
			path.unshift(parent);
			current = parent;
		}
		return { path, cost: totalCost };
	}
}

function parseInput(input) {
	let items = {};
	input.split('\n').forEach((line, floor) => {
		line.replace(/^The \w+ floor contains /, '')
			.replace(/,? and a/, ', a')
			.replace(/^a /, '')
			.replace(/\.$/, '')
			.split(/, a /)
			.filter(x => x !== 'noitem relevant')
			.forEach(item => {
				let match;
				if (match = /(\w+) generator/.exec(item)) {
					items[match[1]] = items[match[1]] || { element: match[1] };
					items[match[1]].generator = floor;
				} else if (match = /(\w+)-compatible microchip/.exec(item)) {
					items[match[1]] = items[match[1]] || { element: match[1] };
					items[match[1]].microchip = floor;
				}
			});
	});
	items = Object.values(items);
	return { current: 0, items };
}

function moveItems(state, moves, toFloor) {
	const items = [...state.items];
	for (let move of moves) {
		const i = items.findIndex(item => item.element === move.element);
		items.splice(i, 1, { ...items[i], [move.type]: toFloor });
	}
	return {
		current: toFloor,
		items
	};
}

function run(input) {
	const start = parseInput(input);
	const goal = {
		current: 3,
		items: start.items.map(item => ({ element: item.element, generator: 3, microchip: 3 }))
	};

	const path = astar({ start, goal, key, neighbors, cost, heuristic });
	return path.cost;
}

function key(state) {
	return state.current + '|' +
		state.items.map(item => `${item.generator},${item.microchip}`)
			.sort((a, b) => a.localeCompare(b))
			.join('|')
}

function isValidState(state) {
	for (let item of state.items) {
		if (item.generator === item.microchip) {
			continue;
		}
		if (state.items.some(other => other.generator === item.microchip)) {
			return false;
		}
	}
	return true;
}

function neighbors(state) {
	const result = [];
	const targetFloors = [];
	if (state.current > 0) targetFloors.push(state.current - 1);
	if (state.current < 3) targetFloors.push(state.current + 1);

	const itemsOnFloor = [
		...state.items.filter(item => item.generator === state.current)
			.map(item => ({ type: 'generator', element: item.element })),
		...state.items.filter(item => item.microchip === state.current)
			.map(item => ({ type: 'microchip', element: item.element }))
	];

	for (let item1 of itemsOnFloor) {
		for (let targetFloor of targetFloors) {
			const neighbor = moveItems(state, [item1], targetFloor);
			if (isValidState(neighbor)) {
				result.push(neighbor);
			}		
		}

		for (let item2 of itemsOnFloor) {
			if (item1 === item2) continue;
			for (let targetFloor of targetFloors) {
				const neighbor = moveItems(state, [item1, item2], targetFloor);
				if (isValidState(neighbor)) {
					result.push(neighbor);
				}		
			}
		}
	}
	return result;
}

function cost(state) {
	return 1;
}

function heuristic(state) {
	return 0;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
