const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('10.txt', 'utf-8').trim();
const tests = [
	[`.#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##`, 802]
];

function run(input) {
	const map = input.split('\n');
	const base = findBase(map);

	const coords = getAsteroidCoords(map)
		.filter(c => !(c.x === base.x && c.y === base.y));

	for (let coord of coords) {
		coord.angle = Math.atan2(coord.y - base.y, coord.x - base.x);
	}

	coords.sort((a, b) =>
		(a.angle - b.angle) ||
		(Math.abs(a.x - base.x) - Math.abs(b.x - base.x)));

	let destroyed = 0;
	let i = coords.findIndex(c => c.angle >= -Math.PI/2);
	for (;;) {
		coords[i].dead = true;
		++destroyed;

		if (destroyed === 200) {
			return 100*coords[i].x + coords[i].y;
		}

		const currentAngle = coords[i].angle;
		do {
			i = (i + 1) % coords.length;
		} while (coords[i].angle === currentAngle || coords[i].dead);
	}
}

function getAsteroidCoords(map) {
	return flatten(
		map.map((line, y) => (
			line.split('').map((c, x) =>
				c === '#' ? { x, y } : null)))
	).filter(c => c);
}

function flatten(arrs) {
	return [].concat(...arrs);
}

function findBase(map) {
	let max = 0;
	let coords;
	for (let y = 0; y < map.length; ++y) {
		for (let x = 0; x < map[y].length; ++x) {
			if (map[y][x] !== '#') continue;
			const visible = countVisibleAsteroids(map, x, y);
			if (visible > max) {
				max = visible;
				coords = { x, y };
			}
		}
	}
	return coords;
}

function countVisibleAsteroids(map, baseX, baseY) {
	let result = 0;
	for (let y = 0; y < map.length; ++y) {
		outer: for (let x = 0; x < map[y].length; ++x) {
			if (baseX === x && baseY === y) continue;
			if (map[y][x] !== '#') continue;

			const dx = x - baseX;
			const dy = y - baseY;
			const g = gcd(Math.abs(dx), Math.abs(dy));

			for (let i = 1; i < g; ++i) {
				const nearerX = baseX + (i * dx / g);
				const nearerY = baseY + (i * dy / g);
				if (map[nearerY][nearerX] === '#') {
					continue outer;
				}
			}

			++result;
		}
	}
	return result;
}

function gcd(a, b) {
    if (a === 0) return b;
    return gcd(b % a, a);
}

for (let [input, output] of tests) {
	assert.deepEqual(run(input), output);
}
console.log(run(input));
