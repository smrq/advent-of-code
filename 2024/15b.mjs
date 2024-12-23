import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`), 618,
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
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`), 9021,
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

		if (dx !== 0) {
			if (pushHorizontal(grid, y, x + dx, dx, false)) {
				pushHorizontal(grid, y, x + dx, dx, true);
				grid[y][x] = '.';
				grid[y][x + dx] = '@';
				x += dx;
			}
		}
		else if (dy !== 0) {
			if (pushVertical(grid, y + dy, x, dy, false)) {
				pushVertical(grid, y + dy, x, dy, true);
				grid[y][x] = '.';
				grid[y + dy][x] = '@';
				y += dy;
			}
		}
	}

	return score(grid);
}

function pushVertical(grid, y, x, direction, commit) {
	if (!L.inBounds(grid, y, x)) return false;
	if (grid[y][x] === '.') return true;
	if (grid[y][x] === '#') return false;
	if (grid[y][x] === '[') {
		if (!pushVertical(grid, y + direction, x, direction, false)) return false;
		if (!pushVertical(grid, y + direction, x+1, direction, false)) return false;
		if (commit) {
			pushVertical(grid, y + direction, x, direction, true);
			pushVertical(grid, y + direction, x+1, direction, true);
			grid[y][x] = '.';
			grid[y][x+1] = '.';
			grid[y + direction][x] = '[';
			grid[y + direction][x+1] = ']';
		}
		return true;
	}
	if (grid[y][x] === ']') {
		if (!pushVertical(grid, y + direction, x-1, direction, false)) return false;
		if (!pushVertical(grid, y + direction, x, direction, false)) return false;
		if (commit) {
			pushVertical(grid, y + direction, x-1, direction, true);
			pushVertical(grid, y + direction, x, direction, true);
			grid[y][x-1] = '.';
			grid[y][x] = '.';
			grid[y + direction][x-1] = '[';
			grid[y + direction][x] = ']';
		}
		return true;
	}
}

function pushHorizontal(grid, y, x, direction, commit) {
	if (!L.inBounds(grid, y, x)) return false;
	if (grid[y][x] === '.') return true;
	if (grid[y][x] === '#') return false;
	if (grid[y][x] === '[' || grid[y][x] === ']') {
		if (!pushHorizontal(grid, y, x + 2*direction, direction, false)) return false;
		if (commit) {
			pushHorizontal(grid, y, x + 2*direction, direction, true);
			grid[y][x] = '.';
			grid[y][x + direction] = direction > 0 ? '[' : ']';
			grid[y][x + 2*direction] = direction > 0 ? ']' : '[';
		}
		return true;
	}
}

function score(grid) {
	let result = 0;
	for (let y = 0; y < grid.length; ++y) {
		for (let x = 0; x < grid[y].length; ++x) {
			if (grid[y][x] === '[') {
				result += 100*y + x;
			}
		}
	}
	return result;
}

function parseInput(str) {
	let [grid, moves] = L.autoparse(str);
	grid = grid.map(line =>
		line.replaceAll(/./g, c => {
			switch (c) {
				case '#': return '##';
				case 'O': return '[]';
				case '.': return '..';
				case '@': return '@.';
			}
		}).split('')
	);
	moves = moves.join('').split('');
	return { grid, moves };
}
