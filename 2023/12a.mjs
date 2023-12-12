import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`), 21,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function countPermutations(pattern, runs) {
	if (!runs.length) {
		return /#/.test(pattern) ? 0 : 1;
	}

	let result = 0;

	if (new RegExp(`^[?#]{${runs[0]}}($|[?.])`).test(pattern)) {
		result += countPermutations(pattern.slice(runs[0]+1), runs.slice(1));
	}

	if (/[?.]/.test(pattern[0])) {
		result += countPermutations(pattern.slice(1), runs);
	}

	return result;
}

function run(input) {
	return L.sum(input.map(line =>
		countPermutations(line.pattern, line.runs)
	));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [ pattern, runs ] = line.split(' ');
		runs = runs.split(',').map(x => +x);
		return { pattern, runs };
	});
}
