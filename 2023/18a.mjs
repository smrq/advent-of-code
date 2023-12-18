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
`), 62,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function fillPath(grid, input) {
	let x = 0;
	let y = 0;
	for (let { dir, n } of input) {
		const dx = dir === 'L' ? -1 :
			dir === 'R' ? 1 :
			0;
		const dy = dir === 'U' ? -1 :
			dir === 'D' ? 1 :
			0;
		for (let i = 0; i < n; ++i) {
			x += dx;
			y += dy;
			grid.set([x, y], '#');
		}
	}
}

function floodFill(grid) {
	const dimensions = grid.dimensions();
	const outside = new Set();
	const working = new Set([`${dimensions[0][0]-1},${dimensions[1][0]-1}`]);

	while (working.size) {
		const key = working.values().next().value;
		working.delete(key);
		outside.add(key);
		const [x, y] = key.split(',').map(n => +n);

		for (let [dx, dy] of L.orthogonalOffsets(2)) {
			const newKey = `${x+dx},${y+dy}`;
			if (x+dx >= dimensions[0][0]-1 &&
				x+dx <= dimensions[0][1]+1 &&
				y+dy >= dimensions[1][0]-1 &&
				y+dy <= dimensions[1][1]+1 &&
				grid.get([x+dx, y+dy]) == null &&
				!outside.has(newKey)
			) {
				working.add(newKey);
			}
		}
	}

	for (let y = dimensions[1][0] - 1; y <= dimensions[1][1] + 1; ++y) {
		const row = [];
		for (let x = dimensions[0][0] - 1; x <= dimensions[0][1] + 1; ++x) {
			if (!outside.has(`${x},${y}`)) {
				grid.set([x, y], '#');
			}
		}
	}
}

function run(input) {
	const grid = new L.InfiniteGrid(2);

	fillPath(grid, input);
	floodFill(grid);

	return grid._data.size;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const match = /^(\w) (\d+) \(#\w{6}\)$/.exec(line);
		let [, dir, n] = match;
		n = +n;
		return { n, dir };
	});
}
