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
wseweeenwnesenwwwswnew`), 10
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

	return flipped.size;
}

function parseInput(str) {
	return autoparse(str).map(line => line.split(/([ns]?[we])/).filter(Boolean));
}
