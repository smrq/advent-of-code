import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`), 2028,
	parseInput(`##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`), 10092,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ grid, moves }) {
	let [y, x] = L.findIndex2d(grid, x => x === '@');

	for (let move of moves) {
		let dx, dy;
		switch (move) {
			case '^': dx = 0; dy = -1; break;
			case '>': dx = 1; dy = 0; break;
			case 'v': dx = 0; dy = 1; break;
			case '<': dx = -1; dy = 0; break;
		}
		const firstX = x + dx;
		const firstY = y + dy;
		let nextX = firstX;
		let nextY = firstY;
		while (true) {
			if (!L.inBounds(grid, nextY, nextX)) {
				break;
			}

			if (grid[nextY][nextX] === '#') {
				break;
			}

			if (grid[nextY][nextX] === '.') {
				grid[nextY][nextX] = grid[firstY][firstX];
				grid[firstY][firstX] = '@';
				grid[y][x] = '.';
				x = firstX;
				y = firstY;
				break;
			}

			nextX += dx;
			nextY += dy;
		}
	}

	return score(grid);
}

function score(grid) {
	let result = 0;
	for (let y = 0; y < grid.length; ++y) {
		for (let x = 0; x < grid[y].length; ++x) {
			if (grid[y][x] === 'O') {
				result += 100*y + x;
			}
		}
	}
	return result;
}

function parseInput(str) {
	let [grid, moves] = L.autoparse(str);
	grid = grid.map(line => line.split(''));
	moves = moves.join('').split('');
	return { grid, moves };
}
