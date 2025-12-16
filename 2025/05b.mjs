import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3-5
10-14
16-20
12-18

1
5
8
11
17
32`), 14
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(ranges) {
	const flatRanges = ranges.flatMap(([start, end]) => [
		{ type: 'start', n: start },
		{ type: 'end', n: end },
	]).sort((a, b) => a.n - b.n || -(a.type.localeCompare(b.type)));

	let unionedRanges = [];
	let depth = 0;
	for (let { type, n } of flatRanges) {
		if (type === 'start') {
			if (depth === 0) {
				unionedRanges.push({ type, n });
			}
			++depth;
		} else {
			--depth;
			if (depth === 0) {
				unionedRanges.push({ type, n });
			}
		}
	}

	let result = 0;
	for (let i = 1; i < unionedRanges.length; i += 2) {
		const start = unionedRanges[i - 1].n;
		const end = unionedRanges[i].n;
		result += (end - start) + 1;
	}

	return result;
}

function parseInput(str) {
	const [ranges, ids] = L.autoparse(str);
	return ranges.map(range => range.split('-').map(n => parseInt(n, 10)));
}

