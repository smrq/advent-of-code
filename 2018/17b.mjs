import fs from 'fs';
const input = fs.readFileSync('17.txt', 'utf-8').trim();

function parseScanString(str) {
	const lines = str.split('\n').map(line => {
		let [mainAxis, a, b, c] = /([xy])=(\d+), [xy]=(\d+)..(\d+)/.exec(line).slice(1);
		a = +a;
		b = +b;
		c = +c;
		return { mainAxis, a, b, c };
	});
	const xs = flatten(lines.map(line => line.mainAxis === 'x' ? line.a : [line.b, line.c]));
	const ys = flatten(lines.map(line => line.mainAxis === 'y' ? line.a : [line.b, line.c]));
	const xMin = Math.min(...xs);
	const xMax = Math.max(...xs);
	const yMin = Math.min(...ys);
	const yMax = Math.max(...ys);

	const world = createWorld(xMin, xMax, yMin, yMax);
	writeWorld(world, 500, yMin, '+');
	lines.forEach(({ mainAxis, a, b, c }) => {
		for (let n = b; n <= c; ++n) {
			if (mainAxis === 'x') {
				writeWorld(world, a, n, '#');
			} else {
				writeWorld(world, n, a, '#');
			}
		}
	});
	return world;
}

function flatten(arrs) {
	return [].concat(...arrs);
}

function iterate(world) {
	let updated = false;
	for (let coords of world.live) {
		let [x, y] = coords.split(',');
		x = +x;
		y = +y;
		const tile = readWorld(world, x, y);

		if ((tile === '+' || tile === '|') &&
			y < world.yMax &&
			readWorld(world, x, y+1) === '.'
		) {
			writeWorld(world, x, y+1, '|');
			updated = true;
		}
		if (isSupported(tile)) {
			if (readWorld(world, x-1, y) === '.') {
				writeWorld(world, x-1, y, '|');
				updated = true;
			}
			if (readWorld(world, x+1, y) === '.') {
				writeWorld(world, x+1, y, '|');
				updated = true;
			}
		}

		if (tile === '|' && isSolid(readWorld(world, x, y+1))) {
			writeWorld(world, x, y, 'B');
			updated = true;
		}

		if (tile === 'B' && isLSolid(readWorld(world, x-1, y))) {
			writeWorld(world, x, y, 'L');
			updated = true;
		}

		if (tile === 'B' && isRSolid(readWorld(world, x+1, y))) {
			writeWorld(world, x, y, 'R');
			updated = true;
		}

		if (tile === 'L' && isRSolid(readWorld(world, x+1, y))) {
			writeWorld(world, x, y, '~');
			updated = true;
		}
		
		if (tile === 'R' && isLSolid(readWorld(world, x-1, y))) {
			writeWorld(world, x, y, '~');
			updated = true;
		}
	}

	return updated;
}

function isWet(tile) {
	return !!~'+|BLR~'.indexOf(tile);
}

function isSolid(tile) {
	return !!~'#~'.indexOf(tile);
}

function isSupported(tile) {
	return !!~'BLR~'.indexOf(tile);
}

function isLSolid(tile) {
	return !!~'#L~'.indexOf(tile);
}

function isRSolid(tile) {
	return !!~'#R~'.indexOf(tile);
}

function createWorld(xMin, xMax, yMin, yMax) {
	const world = {
		data: [],
		live: new Set(),
		xMin,
		xMax,
		yMin,
		yMax
	};
	return world;
}

function readWorld(world, x, y) {
	if (!world.data[y]) return '.';
	return world.data[y][x] || '.';
}

function writeWorld(world, x, y, value) {
	if (!world.data[y]) {
		world.data[y] = [];
	}
	world.data[y][x] = value;
	if (!!~'+|BLR'.indexOf(value)) {
		world.live.add(`${x},${y}`);
	} else {
		world.live.delete(`${x},${y}`);
	}
}

function score(world) {
	return world.data.reduce((acc, line) =>
		acc + line.reduce((acc, tile) =>
			tile === '~' ? acc + 1 : acc,
			0),
		0);
}

function showWorld(world) {
	for (let y = world.yMin; y <= world.yMax; ++y) {
		for (let x = world.xMin; x <= world.xMax; ++x) {
			process.stdout.write(readWorld(world, x, y));
		}
		process.stdout.write('\n');
	}
}

const world = parseScanString(input);

let n = 0;
do {
	if (n % 1000 === 0) {
		process.stdout.write('.');
	}
	++n;
} while (iterate(world));

console.log('\n');
showWorld(world);

console.log(score(world));
