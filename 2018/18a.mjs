import fs from 'fs';
const input = fs.readFileSync('18.txt', 'utf-8').trim();

const testInput = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

function parseInput(input) {
	return input.split('\n').map(line => line.split(''));
}

function iterate(world) {
	return world.map((line, y) => line.map((tile, x) => {
		switch (tile) {
			case '.':
				if (countNeighborsOfType(world, x, y, '|') >= 3) return '|';
				return '.';
			case '|':
				if (countNeighborsOfType(world, x, y, '#') >= 3) return '#';
				return '|';
			case '#':
				if (countNeighborsOfType(world, x, y, '|') >= 1 &&
					countNeighborsOfType(world, x, y, '#') >= 1) return '#';
				return '.';
		}
	}));
}

function countNeighborsOfType(world, x, y, type) {
	const xMax = world[0].length - 1;
	const yMax = world.length - 1;
	let result = 0;
	if (x >= 1 && world[y][x-1] === type) ++result;
	if (x <= xMax - 1 && world[y][x+1] === type) ++result;
	if (y >= 1 && world[y-1][x] === type) ++result;
	if (y <= yMax - 1 && world[y+1][x] === type) ++result;
	if (x >= 1 && y >= 1 && world[y-1][x-1] === type) ++result;
	if (x >= 1 && y <= yMax - 1 && world[y+1][x-1] === type) ++result;
	if (x <= xMax - 1 && y >= 1 && world[y-1][x+1] === type) ++result;
	if (x <= xMax - 1 && y <= yMax - 1 && world[y+1][x+1] === type) ++result;
	return result;
}

function score(world) {
	const tiles = world.map(line => line.join('')).join('');
	const woods = tiles.split('|').length - 1;
	const lumberyards = tiles.split('#').length - 1;
	return woods * lumberyards;
}

function showWorld(world) {
	console.log(world.map(line => line.join('')).join('\n'));
}

function run(input, turns, showProgress) {
	let world = parseInput(input);
	if (showProgress) {
		console.log(`Turn 0:`);
		showWorld(world);
		console.log('');
	}
	for (let n = 1; n <= turns; ++n) {
		world = iterate(world);
		if (showProgress) {
			console.log(`Turn ${n}:`);
			showWorld(world);
			console.log('');
		}
	}
	if (!showProgress) {
		showWorld(world);
	}
	return score(world);
}

console.log(run(input, 10));