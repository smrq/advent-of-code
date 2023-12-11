import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`.....
.S-7.
.|.|.
.L-J.
.....`), 4,
	parseInput(`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`), 8,
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

function run(input) {
	const start = replaceStart(input);
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
	return n-1;
}

function parseInput(str) {
	return L.autoparse(str);
}
