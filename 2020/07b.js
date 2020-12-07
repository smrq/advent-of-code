const { getRawInput, runTests, sum } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
	parseInput(`shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`),
	126
]);

console.log(run(input));

function run(input) {
	return count(input, 'shiny gold', 1);
}

function count(input, color, n) {
	const container = input.find(x => x.outer === color);
	return sum(container.inner.map(inner => {
		const m = n * inner.n;
		return m + count(input, inner.color, m);
	}));
}

function parseInput(str) {
	return str.split('\n').map(line => {
		let [outer, inner] = line.split(' bags contain ');
		if (inner === 'no other bags.') {
			return { outer, inner: [] };
		}

		inner = inner.split(', ').map(x => {
			let [_, n, color] = /(\d+) ([\w ]+) bags?/.exec(x);
			return { n: +n, color };
		});
		return { outer, inner };
	});
}
