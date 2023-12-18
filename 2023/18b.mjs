import assert from 'assert';
import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`), 952408144115,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function findGridLines(input) {
	let x = 0;
	let y = 0;

	let xs = new Set([0]);
	let ys = new Set([0]);

	for (let { dir, n } of input) {
		switch (dir) {
			case 'L':
				ys.add(y+1);
				x -= n;
				break;

			case 'R':
				ys.add(y);
				x += n;
				break;

			case 'U':
				xs.add(x);
				y -= n;
				break;

			case 'D':
				xs.add(x+1);
				y += n;
				break;
		}
	}

	xs = [...xs].sort((a, b) => a - b);
	ys = [...ys].sort((a, b) => a - b);	

	return [xs, ys];
}

function createGrid(xs, ys) {
	const grid = [...Array(ys.length+1)].map((_, j) =>
		[...Array(xs.length+1)].map((_, i) => {
			const x0 = xs[i-1] ?? -Infinity;
			const x1 = xs[i] ?? Infinity;
			const y0 = ys[j-1] ?? -Infinity;
			const y1 = ys[j] ?? Infinity;
			const size = (x1-x0) * (y1-y0);
			return {
				xMin: x0,
				xMax: x1-1,
				yMin: y0,
				yMax: y1-1,
				size,
				fill: false,
			};
		})
	);
	return grid;
}

function findGridIndices(grid, x, y) {
	const j = grid.findIndex(row => y >= row[0].yMin && y <= row[0].yMax);
	const i = grid[j].findIndex(cell => x >= cell.xMin && x <= cell.xMax);
	return [i, j];
}

function fillPath(grid, input) {
	let x = 0;
	let y = 0;
	for (let { dir, n } of input) {
		let [i, j] = findGridIndices(grid, x, y);
		switch (dir) {
			case 'L': {
				x -= n;
				let [i2, ] = findGridIndices(grid, x, y);
				for (; i >= i2; --i) {
					grid[j][i].fill = true;
				}
				break;
			}

			case 'R': {
				x += n;
				let [i2, ] = findGridIndices(grid, x, y);
				for (; i <= i2; ++i) {
					grid[j][i].fill = true;
				}
				break;
			}

			case 'U': {
				y -= n;
				let [, j2] = findGridIndices(grid, x, y);
				for (; j >= j2; --j) {
					grid[j][i].fill = true;
				}
				break;
			}

			case 'D': {
				y += n;
				let [, j2] = findGridIndices(grid, x, y);
				for (; j <= j2; ++j) {
					grid[j][i].fill = true;
				}
				break;
			}
		}
	}
}

function floodFill(grid) {
	const outside = new Set();
	const working = new Set([`0,0`]);

	while (working.size) {
		const key = working.values().next().value;
		working.delete(key);
		outside.add(key);
		const [i, j] = key.split(',').map(n => +n);

		for (let [di, dj] of L.orthogonalOffsets(2)) {
			const newKey = `${i+di},${j+dj}`;
			if (j+dj >= 0 &&
				j+dj < grid.length &&
				i+di >= 0 &&
				i+di < grid[j+dj].length &&
				!grid[j+dj][i+di].fill &&
				!outside.has(newKey)
			) {
				working.add(newKey);
			}
		}
	}

	for (let j = 0; j < grid.length; ++j) {
		for (let i = 0; i < grid[j].length; ++i) {
			if (!outside.has(`${i},${j}`)) {
				grid[j][i].fill = true;
			}
		}
	}
}

function run(input) {
	const [xs, ys] = findGridLines(input);
	const grid = createGrid(xs, ys);

	fillPath(grid, input);
	floodFill(grid);

	return L.sum(grid.flatMap(row => row.map(cell => cell.fill ? cell.size : 0)));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const match = /^\w \d+ \(#(\w{5})(\w)\)$/.exec(line);
		let [, n, dir] = match;
		n = parseInt(n, 16);
		dir = 'RDLU'[+dir];
		return { n, dir };
	});
}
