import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`), 16
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ patterns, designs }) {
	const search = L.memo(design => {
		if (design === '') {
			return 1;
		}

		let result = 0;
		for (let pattern of patterns) {
			if (design.startsWith(pattern)) {
				result += search(design.slice(pattern.length));
			}
		}
		return result;
	});

	return L.sum(designs.map(design => search(design)));
}

function parseInput(str) {
	let [patterns, designs] = str.trim().split('\n\n');
	patterns = patterns.split(', ');
	designs = designs.split('\n');
	return { patterns, designs };
}
