import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput(false);
const tests = [];

class PriorityQueue {
	constructor() {
		this.data = [];
		this.priorities = [];
		this.length = this.data.length;
	}

	push(item, priority) {
		let index = this.priorities.findIndex(p => p > priority);
		if (index === -1) {
			this.data.push(item);
			this.priorities.push(priority);
		} else {
			this.data.splice(index, 0, item);
			this.priorities.splice(index, 0, priority);
		}
		this.length = this.data.length;
	}

	pop() {
		const result = this.data.shift();
		this.priorities.shift();
		this.length = this.data.length;
		return result;
	}
}

function astar({ start, goal, key, neighbors, cost, heuristic, debug }) {
	let record = 0;

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
		if (debug) {
			debug(current, openSet);	
		}

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
	const map = input.split('\n');

	const points = {};

	for (let x = 0; x < map[0].length; ++x) {
		const y = 2;
		if (/[A-Z]/.test(map[y-2][x])) {
			const label = map[y-2][x] + map[y-1][x];
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}
	}

	for (let x = 0; x < map[0].length; ++x) {
		const y = 36;
		if (/[A-Z]/.test(map[y+1][x])) {
			const label = map[y+1][x] + map[y+2][x];
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}
	}

	for (let x = 0; x < map[0].length; ++x) {
		const y = 98;
		if (/[A-Z]/.test(map[y-2][x])) {
			const label = map[y-2][x] + map[y-1][x];
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}
	}

	for (let x = 0; x < map[0].length; ++x) {
		const y = 132;
		if (/[A-Z]/.test(map[y+1][x])) {
			const label = map[y+1][x] + map[y+2][x];
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}
	}

	for (let y = 0; y < map.length; ++y) {
		const re1 = /([A-Z][A-Z])\./g;
		const re2 = /\.([A-Z][A-Z])/g;

		let match;
		while (match = re1.exec(map[y])) {
			const label = match[1];
			const x = match.index + 2;
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}

		while (match = re2.exec(map[y])) {
			const label = match[1];
			const x = match.index;
			points[label] = points[label] || [];
			points[label].push([x, y]);
		}
	}

	const teleports = {};
	for (let arr of Object.values(points)) {
		if (arr.length !== 2) continue;
		const [a, b] = arr;
		teleports[a.join(',')] = b;
		teleports[b.join(',')] = a;
	}

	return { map, points, teleports };
}

async function run(input) {
	const { map, points, teleports } = parseInput(input);

	const start = points.AA[0];
	const goal = points.ZZ[0];

	return astar({
		start,
		goal,
		key: state => state.join(','),
		neighbors: ([x, y]) => {
			const result = [];
			if (map[y][x-1] === '.') {
				result.push([x-1, y]);
			}
			if (map[y][x+1] === '.') {
				result.push([x+1, y]);
			}	
			if (map[y-1][x] === '.') {
				result.push([x, y-1]);
			}
			if (map[y+1][x] === '.') {
				result.push([x, y+1]);
			}
			if (teleports[`${x},${y}`]) {
				result.push(teleports[`${x},${y}`]);
			}
			return result;
		},
		heuristic: () => 0,
		cost: () => 1
	})
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));
})();
