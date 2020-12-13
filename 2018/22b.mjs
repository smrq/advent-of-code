import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('22.txt', 'utf-8').trim();
const testInput = `depth: 510
target: 10,10`

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

function parseInput(input) {
	const [_, depth, targetX, targetY] = /^depth: (\d+)\ntarget: (\d+),(\d+)$/.exec(input);
	return [+depth, { x: +targetX, y: +targetY }];
}

function run(depth, target) {
	const erosionLevel = memo2((x, y) => {
		if (x === 0 && y === 0) {
			return depth;
		}
		if (x === target.x && y === target.y) {
			return depth;
		}
		if (y === 0) {
			return (depth + (x * 16807)) % 20183;
		}
		if (x === 0) {
			return (depth + (y * 48271)) % 20183;
		}
		return (depth + erosionLevel(x-1, y) * erosionLevel(x, y-1)) % 20183;
	});

	function type(x, y) {
		return erosionLevel(x, y) % 3;
	}

	function neighbors(node) {
		const result = [];

		// switching tools
		switch (type(node.x, node.y)) {
			case 0: // rocky
				result.push({ x: node.x, y: node.y, tool: node.tool === 't' ? 'c' : 't' });
				break;
			case 1: // wet
				result.push({ x: node.x, y: node.y, tool: node.tool === 'n' ? 'c' : 'n' });
				break;
			case 2: // narrow
				result.push({ x: node.x, y: node.y, tool: node.tool === 'n' ? 't' : 'n' });
				break;
		}

		const validTileTypes =
			node.tool === 't' ? [0, 2] :
			node.tool === 'c' ? [0, 1] :
			[1, 2];

		// movement
		if (node.x > 0 && validTileTypes.includes(type(node.x - 1, node.y))) {
			result.push({ x: node.x - 1, y: node.y, tool: node.tool });
		}
		if (validTileTypes.includes(type(node.x + 1, node.y))) {
			result.push({ x: node.x + 1, y: node.y, tool: node.tool });
		}
		if (node.y > 0 && validTileTypes.includes(type(node.x, node.y - 1))) {
			result.push({ x: node.x, y: node.y - 1, tool: node.tool });
		}
		if (validTileTypes.includes(type(node.x, node.y + 1))) {
			result.push({ x: node.x, y: node.y + 1, tool: node.tool });
		}

		return result;
	}

	function cost(n1, n2) {
		if (n1.x !== n2.x) return 1;
		if (n1.y !== n2.y) return 1;
		if (n1.tool !== n2.tool) return 7;
		throw new Error();
	}

	function heuristic(node, goal) {
		return Math.abs(goal.x - node.x) +
			Math.abs(goal.y - node.y) +
			(node.tool === 't' ? 0 : 7);
	}

	function key(node) {
		return `${node.x},${node.y},${node.tool}`;
	} 

	const start = { x: 0, y: 0, tool: 't' };
	const goal = { x: target.x, y: target.y, tool: 't' };
	const path = astar({
		start,
		goal,
		key,
		neighbors,
		cost,
		heuristic
	});

	return {
		cost: path.cost,
		path: path.path
			.map(n => `${'.=|'[type(n.x, n.y)]}  ${n.tool}  ${n.x},${n.y}`)
			.join('\n')
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

function memo2(fn) {
	const cache = new Map();
	return (x, y) => {
		const key = `${x}|${y}`;
		if (!cache.has(key)) {
			cache.set(key, fn(x, y));
		}
		return cache.get(key);
	}
}

assert.strictEqual(45, run(...parseInput(testInput)).cost);
const result = run(...parseInput(input));
console.log(result.path);
console.log(result.cost);
