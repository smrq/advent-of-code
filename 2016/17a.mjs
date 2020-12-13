import assert from 'assert';
import chalk from 'chalk';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = getRawInput();
const tests = [
	['ihgpwlah', 'DDRRRD'],
	['kglvqrro', 'DDUDRLRRUDRD'],
	['ulqzkmiv', 'DRURDRUDDLLDLUURRDULRLDUUDDDRR'],
];

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

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

function run(input) {
	const start = {
		path: '',
		x: 0,
		y: 0,
	};
	const goal = { done: true };
	const { path } = astar({ start, goal, key, neighbors, cost, heuristic });
	return path[path.length - 2].path;

	function key(state) {
		if (state.done) return 'done';
		return `${state.x},${state.y},${state.path}`;
	}

	function neighbors(state) {
		if (state.x === 3 && state.y === 3) {
			return [{ done: true }];
		}

		const result = [];
		const doorHash = md5(input + state.path);
		if (state.y > 0) {
			if (/[bcdef]/.test(doorHash[0])) {
				result.push({
					path: state.path + 'U',
					x: state.x,
					y: state.y - 1
				});
			}
		}
		if (state.y < 3) {
			if (/[bcdef]/.test(doorHash[1])) {
				result.push({
					path: state.path + 'D',
					x: state.x,
					y: state.y + 1
				});
			}
		}
		if (state.x > 0) {
			if (/[bcdef]/.test(doorHash[2])) {
				result.push({
					path: state.path + 'L',
					x: state.x - 1,
					y: state.y
				});
			}
		}
		if (state.x < 3) {
			if (/[bcdef]/.test(doorHash[3])) {
				result.push({
					path: state.path + 'R',
					x: state.x + 1,
					y: state.y
				});
			}
		}
		return result;
	}

	function cost(fromState, toState) {
		if (toState.done) {
			return 0;
		}
		return 1;
	}

	function heuristic(state) {
		return 3 - state.x + 3 - state.y;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
