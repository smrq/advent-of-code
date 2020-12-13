import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('10.txt', 'utf-8').trim();
const tests = [
	[`.#..#\n.....\n#####\n....#\n...##`, 8],
	[`......#.#.\n#..#.#....\n..#######.\n.#.#.###..\n.#..#.....\n..#....#.#\n#..#....#.\n.##.#..###\n##...#..#.\n.#....####`, 33],
	[`#.#...#.#.\n.###....#.\n.#....#...\n##.#.#.#.#\n....#.#.#.\n.##..###.#\n..#...##..\n..##....##\n......#...\n.####.###.`, 35],
	[`.#..#..###\n####.###.#\n....###.#.\n..###.##.#\n##.##.#.#.\n....###..#\n..#.#..#.#\n#..#.#.###\n.##...##.#\n.....#.#..`, 41],
	[`.#..##.###...#######\n##.############..##.\n.#.######.########.#\n.###.#######.####.#.\n#####.##.#.##.###.##\n..#####..#.#########\n####################\n#.####....###.#.#.##\n##.#################\n#####.##.###..####..\n..######..##.#######\n####.##.####...##..#\n.#####..#.######.###\n##...#.##########...\n#.##########.#######\n.####.#.###.###.#.##\n....##.##.###..#####\n.#.#.###########.###\n#.#.#.#####.####.###\n###.##.####.##.#..##`, 210]
];

function run(input) {
	const map = input.split('\n');
	return findMostVisibleAsteroids(map);
}

function findMostVisibleAsteroids(map) {
	let max = 0;
	for (let y = 0; y < map.length; ++y) {
		for (let x = 0; x < map[y].length; ++x) {
			if (map[y][x] !== '#') continue;
			const visible = countVisibleAsteroids(map, x, y);
			if (visible > max) {
				max = visible;
			}
		}
	}
	return max;
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
