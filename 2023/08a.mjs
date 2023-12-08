import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`), 2,
	parseInput(`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`), 6,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let n = 0, location = 'AAA';
	while (location !== 'ZZZ') {
		const dir = input.dirs[n % input.dirs.length];
		location = input.map.get(location)[dir];
		++n;
	}
	return n;
}

function parseInput(str) {
	let [dirs, mapLines] = str.trim().split('\n\n');
	let map = mapLines.split('\n').reduce((map, line) => {
		let [, node, L, R] = /(\w+) = \((\w+), (\w+)\)/.exec(line);
		map.set(node, { L, R });
		return map;
	}, new Map());
	return { dirs, map };
}
