import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`), 6032
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ map, instructions }) {
	let y = 0;
	let x = map[y].findIndex(c => c !== ' ');
	let dir = 'east';

	for (let inst of instructions) {
		if (typeof inst === 'number') {
			const [dx, dy] = {
				east: [1, 0],
				south: [0, 1],
				west: [-1, 0],
				north: [0, -1],
			}[dir];

			for (let i = 0; i < inst; ++i) {
				let newX = x + dx;
				let newY = y + dy;

				let next = readMap(map, newX, newY);
				if (next === ' ') {
					do {
						newX -= dx;
						newY -= dy;
					} while (readMap(map, newX, newY) != ' ');
					newX += dx;
					newY += dy;
					next = readMap(map, newX, newY);
				}

				if (next === '#') {
					break;
				}
				
				x = newX;
				y = newY;
			}
		} else {
			dir = {
				east: { L: 'north', R: 'south' },
				south: { L: 'east', R: 'west' },
				west: { L: 'south', R: 'north' },
				north: { L: 'west', R: 'east' },
			}[dir][inst];
		}
	}

	return 1000*(y+1) + 4*(x+1) + { east: 0, south: 1, west: 2, north: 3 }[dir];
}

function readMap(map, x, y) {
	if (y >= 0 && y < map.length && x >= 0 && x < map[y].length) return map[y][x];
	return ' ';
}

function parseInput(str) {
	let [map, [instStr]] = L.autoparse(str);
	map = map.map(line => line.split(''));
	const instructions = instStr.match(/(\d+)|([A-Z]+)/gi).map(inst => /\d+/.test(inst) ? parseInt(inst, 10) : inst);
	return { map, instructions };
}
