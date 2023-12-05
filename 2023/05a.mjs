import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`), 35
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run([seeds, ...groups]) {
	for (const maps of groups) {
		seeds = seeds.map(seed => {
			for (let map of maps) {
				if (seed >= map.src && seed < map.src + map.len) {
					return seed - map.src + map.dest;
				}
			}
			return seed;
		});
	}

	return Math.min(...seeds);
}

function parseInput(str) {
	return str.split('\n\n').map(group => {
		if (/\n/.test(group)) {
			return group.split('\n').slice(1).map(line => {
				let [dest, src, len] = line.split(' ').map(x => +x);
				return { dest, src, len };
			});
		} else {
			return group.split(' ').slice(1).map(x => +x);
		}
	});
}
