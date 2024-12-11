import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`), 6
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let count = 0;

	let y = input.findIndex(row => row.includes('^'));
	let x = input[y].indexOf('^');
	let direction = '^';
	const visited = calculateVisited(input, x, y, direction, null);

	for (let position of visited) {
		const obstacle = position.split(',').map(n => parseInt(n, 10));
		if (obstacle[0] === x && obstacle[1] === y) {
			continue;
		}
		if (calculateVisited(input, x, y, direction, obstacle) == null) {
			++count;
		}
	}

	return count;
}

function calculateVisited(grid, x, y, direction, obstacle) {
	const path = new Set();
	const visited = new Set();

	while (true) {
		const key = `${x},${y},${direction}`;
		if (path.has(key)) {
			return null;
		}
		path.add(key);
		visited.add(`${x},${y}`);

		let dy, dx;
		switch (direction) {
			case '^': dy = -1; dx = 0; break;
			case '>': dy = 0; dx = 1; break;
			case 'v': dy = 1; dx = 0; break;
			case '<': dy = 0; dx = -1; break;
		}

		if (!L.inBounds(grid, y + dy, x + dx)) {
			break;
		}

		if (
			grid[y + dy][x + dx] === '#' ||
			(obstacle && obstacle[0] === x + dx && obstacle[1] === y + dy)
		) {
			switch (direction) {
				case '^': direction = '>'; break;
				case '>': direction = 'v'; break;
				case 'v': direction = '<'; break;
				case '<': direction = '^'; break;
			}
		} else {
			y += dy;
			x += dx;
		}
	}

	return visited;

}

function isSafe(report) {
	const asc = report[0] < report[1];
	for (let i = 1; i < report.length; ++i) {
		if ((report[i-1] < report[i]) !== asc) {
			return false;
		}
		const diff = Math.abs(report[i] - report[i-1]);
		if (diff < 1 || diff > 3) {
			return false;
		}
	}
	return true;
}

function parseInput(str) {
	return L.autoparse(str);
}
