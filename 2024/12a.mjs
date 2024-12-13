import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`AAAA
BBCD
BBCC
EEEC`), 140,
	parseInput(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`), 772,
	parseInput(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`), 1930,
	parseInput(`AAAXXX
AXXXBX
XXBBBX`), (10*22 + 4*10 + 4*10),
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const metrics = [];
	const groups = [...Array(input.length)].map(() => [...Array(input[0].length)]);
	const merges = [];

	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[y].length; ++x) {
			const matchesLeft = x > 0 && input[y][x-1] === input[y][x];
			const matchesUp = y > 0 && input[y-1][x] === input[y][x];

			function getLiveGroup(group) {
				while (metrics[group].merge) {
					group = metrics[group].merge;
				}
				return group;
			}

			if (matchesUp && matchesLeft) {
				const groupLeft = getLiveGroup(groups[y][x-1]);
				const groupUp = getLiveGroup(groups[y-1][x]);
				if (groupLeft !== groupUp) {
					metrics[groupLeft].area += metrics[groupUp].area;
					metrics[groupLeft].perimeter += metrics[groupUp].perimeter;
					metrics[groupUp] = { merge: groupLeft };
				}
				groups[y][x] = groupLeft;
				metrics[groupLeft].area += 1;
			}
			else if (matchesLeft) {
				const groupLeft = getLiveGroup(groups[y][x-1]);
				groups[y][x] = groupLeft;
				metrics[groupLeft].area += 1;
				metrics[groupLeft].perimeter += 2;
			}
			else if (matchesUp) {
				const groupUp = getLiveGroup(groups[y-1][x]);
				groups[y][x] = groupUp;
				metrics[groupUp].area += 1;
				metrics[groupUp].perimeter += 2;
			}
			else {
				const groupNew = metrics.length;
				groups[y][x] = groupNew;
				metrics[groupNew] = { area: 1, perimeter: 4 };
			}
		}
	}

	return L.sum(metrics
		.filter(m => m.merge == null)
		.map(({ area, perimeter }) => area * perimeter)
	);
}

function parseInput(str) {
	return L.autoparse(str);
}
