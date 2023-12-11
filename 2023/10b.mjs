import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`.....
.S-7.
.|.|.
.L-J.
.....`), 1,
	parseInput(`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`), 4,
	parseInput(`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`), 8,
	parseInput(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`), 10,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function findConnections(map, y, x) {
	switch (map[y][x]) {
		case '|':
			return [[y-1, x], [y+1, x]];
		case '-':
			return [[y, x-1], [y, x+1]];
		case '7':
			return [[y+1, x], [y, x-1]];
		case 'F':
			return [[y+1, x], [y, x+1]];
		case 'J':
			return [[y-1, x], [y, x-1]];
		case 'L':
			return [[y-1, x], [y, x+1]];
		default:
			throw new Error('unexpected map symbol');
	}
}

function key([y, x]) {
	return `${y},${x}`;
}

function replaceStart(map) {
	const [y, x] = L.findIndex2d(map, value => value === 'S');
	const connections = [
		(x > 0 && /[-LF]/.test(map[y][x-1])) && 'L',
		(x < map[y].length-1 && /[-7J]/.test(map[y][x+1])) && 'R',
		(y > 0 && /[|7F]/.test(map[y-1][x])) && 'U',
		(y < map.length-1 && /[|JL]/.test(map[y+1][x])) && 'D',
	].filter(Boolean).join('');
	const symbol = (() => {
		if (/[LR]{2}/.test(connections)) return '-';
		if (/[UD]{2}/.test(connections)) return '|';
		if (/[LU]{2}/.test(connections)) return 'J';
		if (/[RU]{2}/.test(connections)) return 'L';
		if (/[LD]{2}/.test(connections)) return '7';
		if (/[RD]{2}/.test(connections)) return 'F';
		throw new Error();
	})();

	map[y][x] = symbol;

	return [y, x];
}

function generateDistanceMap(input, start) {
	const distances = new Map();
	let working = [start];
	let n = 0;
	while (working.length) {
		let next = [];
		for (let coords of working) {
			distances.set(key(coords), n);
			for (let connection of findConnections(input, ...coords)) {
				if (!distances.has(key(connection))) {
					next.push(connection);
				}
			}
		}
		working = next;
		++n;
	}
	return distances;
}

function replaceJunk(input, map) {
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			if (!map.has(key([y, x]))) {
				input[y][x] = '.';
			}
		}
	}
}

function run(input) {
	const start = replaceStart(input);
	const distanceMap = generateDistanceMap(input, start);
	replaceJunk(input, distanceMap);

	let result = 0;
	for (let y = 0; y < input.length; ++y) {
		let inside = false;
		let lastCorner = null;
		for (let x = 0; x < input[y].length; ++x) {
			switch (input[y][x]) {
				case '.':
					if (inside) {
						++result;
					}
					break;
				case '-':
					// do nothing
					break;
				case '|':
					inside = !inside;
					break;
				case 'F':
				case 'L':
					lastCorner = input[y][x];
					break;
				case '7':
					if (lastCorner === 'L') {
						inside = !inside;
					}
					lastCorner = null;
					break;
				case 'J':
					if (lastCorner === 'F') {
						inside = !inside;
					}
					lastCorner = null;
					break;
			}
		}
	}
	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}
