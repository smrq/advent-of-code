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
56 93 4`), 46
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function sliceRange(range, sliceStart, sliceLength) {
	let [rangeStart, rangeEnd] = range;
	let sliceEnd = sliceStart + sliceLength - 1;
	let before, inside, after;

	if (rangeEnd < sliceStart) {
		before = range;
	}
	else if (sliceEnd < rangeStart) {
		after = range;
	}
	else {
		inside = [
			Math.max(rangeStart, sliceStart),
			Math.min(rangeEnd, sliceEnd),
		];
		if (rangeStart < sliceStart) {
			before = [rangeStart, sliceStart - 1];
		}
		if (rangeEnd > sliceEnd) {
			after = [sliceEnd + 1, rangeEnd];
		}
	}
	return [before, inside, after];
}

function run([seeds, ...groups]) {
	let ranges = [];
	for (let i = 0; i < seeds.length; i += 2) {
		const start = seeds[i];
		const length = seeds[i+1];
		ranges.push([start, start + length - 1]);
	}

	for (const maps of groups) {
		const newRanges = [];
		for (let map of maps) {
			const unmapped = [];
			while (ranges.length) {
				const range = ranges.shift();
				const [before, inside, after] = sliceRange(range, map.src, map.len);
				if (inside) {
					newRanges.push([
						inside[0] - map.src + map.dest,
						inside[1] - map.src + map.dest,
					]);
				}
				if (before) {
					unmapped.push(before);
				}
				if (after) {
					unmapped.push(after);
				}
			}
			ranges = unmapped;
		}
		ranges = ranges.concat(newRanges);
	}

	return Math.min(...ranges.map(range => range[0]));
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
