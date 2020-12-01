const path = require('path');
const fs = require('fs');

function getRawInput() {
	const inputFilename = path.resolve(__dirname,
		path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
	const input = fs.readFileSync(inputFilename, 'utf-8').trim();
	return input;
}

function astar({ start, goal, key, neighbors, cost, heuristic }) {
	const parents = new Map();

	const gScores = new Map();
	gScores.set(key(start), 0);
	
	// const fScores = new Map();
	// fScores.set(key(start), heuristic(start, goal));

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
				// fScores.set(keyNeighbor, gScore + hScore);
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

module.exports = {
	getRawInput,
	astar,
};
