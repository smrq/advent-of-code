const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [];

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

function findPoints(input) {
	const re = /\d/g;
	const result = [];
	let match;
	while (match = re.exec(input)) {
		result[+match[0]] = match.index;
	}
	return result;
}

function findPaths(input, points) {
	const w = input.indexOf('\n');
	const h = (input.length + 1) / (w + 1);

	const paths = [];
	for (let a = 0; a < points.length; ++a) {
		for (let b = a + 1; b < points.length; ++b) {
			const path = astar({
				start: points[a],
				goal: points[b],
				key: x => x,
				neighbors,
				cost: () => 1,
				heuristic
			});

			if (!paths[a]) paths[a] = [];
			if (!paths[b]) paths[b] = [];

			paths[a][b] = path;
			paths[b][a] = path;
		}
	}
	return paths;

	function neighbors(pos) {
		const x = pos % (w + 1);
		const y = pos / (w + 1) | 0;

		const result = [];
		if (x > 0 && input[y*(w+1) + (x-1)] !== '#') {
			result.push(y*(w+1) + (x-1));
		}
		if (x < w-1 && input[y*(w+1) + (x+1)] !== '#') {
			result.push(y*(w+1) + (x+1));
		}
		if (y > 0 && input[(y-1)*(w+1) + x] !== '#') {
			result.push((y-1)*(w+1) + x);
		}
		if (y < h-1 && input[(y+1)*(w+1) + x] !== '#') {
			result.push((y+1)*(w+1) + x);
		}
		return result;
	}

	function heuristic(pos, goal) {
		const x = pos % (w + 1);
		const y = pos / (w + 1) | 0;

		const tx = goal % (w + 1);
		const ty = goal / (w + 1) | 0;

		return Math.abs(tx - x) + Math.abs(ty - y);
	}
}

function run(input) {
	const points = findPoints(input);
	const paths = findPaths(input, points);

	const routes = [...permutations(Array(points.length - 1).fill().map((_, i) => i + 1))];
	const scored = routes.map(route => ({ route, score: scoreRoute(paths, route) }));
	scored.sort((a, b) => a.score - b.score);
	return scored[0].score;
}

function *permutations(arr) {
	if (arr.length === 1) yield arr;
	for (let k = 0; k < arr.length; ++k) {
		for (let p of permutations([
			...arr.slice(0, k),
			...arr.slice(k+1)
		])) {
			yield [arr[k], ...p];
		}
	}
}

function scoreRoute(paths, route) {
	let current = 0;
	let result = 0;
	for (let goal of route) {
		result += paths[current][goal].cost;
		current = goal;
	}
	result += paths[current][0].cost;
	return result;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
