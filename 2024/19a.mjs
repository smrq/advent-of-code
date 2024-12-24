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
bbrgwb`), 6
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ patterns, designs }) {
	const search = L.memo(design => {
		if (design === '') {
			return true;
		}
		for (let pattern of patterns) {
			if (design.startsWith(pattern) && search(design.slice(pattern.length))) {
				return true;
			}
		}
		return false;
	});

	return designs.filter(search).length;
}

function parseInput(str) {
	let [patterns, designs] = str.trim().split('\n\n');
	patterns = patterns.split(', ');
	designs = designs.split('\n');
	return { patterns, designs };
}
