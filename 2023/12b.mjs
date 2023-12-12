import * as L from '../lib.mjs';

const countPermutations = L.memo(_countPermutations);

L.runTests(args => run(args), [
    parseInput(`???.### 1,1,3`), 1,
    parseInput(`.??..??...?##. 1,1,3`), 16384,
    parseInput(`?#?#?#?#?#?#?#? 1,3,1,6`), 1,
    parseInput(`????.#...#... 4,1,1`), 16,
    parseInput(`????.######..#####. 1,6,5`), 2500,
    parseInput(`?###???????? 3,2,1`), 506250,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function repeat(arr, n) {
	let result = [];
	for (let i = 0; i < n; ++i) {
		result = result.concat(arr);
	}
	return result;
}

function _countPermutations(pattern, runs) {
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
	const repeats = 5;
	return L.sum(input.map(line => {
		const pattern = repeat([line.pattern], repeats).join('?');
		const runs = repeat(line.runs, repeats);
		return countPermutations(pattern, runs);
	}));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [ pattern, runs ] = line.split(' ');
		runs = runs.split(',').map(x => +x);
		return { pattern, runs };
	});
}
