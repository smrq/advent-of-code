const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const input = [fs.readFileSync('13.txt', 'utf-8').trim(), 31, 39];
const tests = [
	[['10', 7, 4], 11]
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

function run([input, ...goal]) {
	input = +input;
	const start = [1, 1];
	const path = astar({
		start,
		goal,
		key,
		neighbors: ([x, y]) => neighbors(input, x, y),
		cost,
		heuristic
	});
	return path.cost;
}

function isWall(input, x, y) {
	const n = x*x + 3*x + 2*x*y + y + y*y + input;
	return popcount(n) % 2 === 1;
}

function popcount(n) {
	let result = 0;
	while (n) {
		if (n & 1) ++result;
		n = n >> 1;
	}
	return result;
}

function key(state) {
	return state.join(',');
}

function neighbors(input, x, y) {
	const result = [];
	if (x > 0 && !isWall(input, x-1, y)) {
		result.push([x-1, y]);
	}
	if (y > 0 && !isWall(input, x, y-1)) {
		result.push([x, y-1]);
	}
	if (!isWall(input, x+1, y)) {
		result.push([x+1, y]);
	}
	if (!isWall(input, x, y+1)) {
		result.push([x, y+1]);
	}
	return result;
}

function cost(state) {
	return 1;
}

function heuristic(state, goal) {
	return Math.abs(goal[0] - state[0]) +
		Math.abs(goal[1] - state[1]);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
