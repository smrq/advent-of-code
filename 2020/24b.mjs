import { getRawInput, autoparse, runTests } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`), 2208
]);

console.log(run(input));

function run(input) {
	let flipped = new Set();

	for (let dirs of input) {
		let q = 0;
		let r = 0;
		for (let dir of dirs) {
			switch (dir) {
				case 'ne': ++q; --r; break;
				case 'nw': --r; break;
				case 'se': ++r; break;
				case 'sw': --q; ++r; break;
				case 'e': ++q; break;
				case 'w': --q; break;
			}
		}

		const key = `${q},${r}`;
		if (flipped.has(key)) {
			flipped.delete(key);
		} else {
			flipped.add(key);
		}
	}

	const offsets = [
		[-1, 1],
		[-1, 0],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
	];

	for (let i = 0; i < 100; ++i) {
		let nextFlipped = new Set(flipped);

		const coords = [...flipped.values()].map(x => x.split(',').map(n => +n));
		const minQ = Math.min(...coords.map(c => c[0])) - 1;
		const maxQ = Math.max(...coords.map(c => c[0])) + 1;
		const minR = Math.min(...coords.map(c => c[1])) - 1;
		const maxR = Math.max(...coords.map(c => c[1])) + 1;

		for (let q = minQ; q <= maxQ; ++q) {
			for (let r = minR; r <= maxR; ++r) {
				const neighbors = offsets.filter(([a, b]) => flipped.has(`${q+a},${r+b}`)).length;
				if (flipped.has(`${q},${r}`)) {
					if (neighbors === 0 || neighbors > 2) {
						nextFlipped.delete(`${q},${r}`);
					}
				} else {
					if (neighbors === 2) {
						nextFlipped.add(`${q},${r}`);
					}
				}
			}
		}

		flipped = nextFlipped;
	}

	return flipped.size;
}

function parseInput(str) {
	return autoparse(str).map(line => line.split(/([ns]?[we])/).filter(Boolean));
}
