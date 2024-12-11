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
......#...`), 41
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let y = input.findIndex(row => row.includes('^'));
	let x = input[y].indexOf('^');
	let direction = '^';

	const visited = new Set();

	while (true) {
		visited.add(`${x},${y}`);

		let dy, dx;
		switch (direction) {
			case '^': dy = -1; dx = 0; break;
			case '>': dy = 0; dx = 1; break;
			case 'v': dy = 1; dx = 0; break;
			case '<': dy = 0; dx = -1; break;
		}

		if (!L.inBounds(input, y + dy, x + dx)) {
			break;
		}

		if (input[y + dy][x + dx] === '#') {
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

	return visited.size;
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
