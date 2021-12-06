import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`3,4,3,1,2`), 5934
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	function sim(list) {
		const result = [];
		for (let fish of list) {
			if (fish > 0) {
				result.push(fish - 1);
			} else {
				result.push(6);
				result.push(8);
			}
		}
		return result;
	}

	for (let i = 0; i < 80; ++i) {
		input = sim(input);
	}

	return input.length;
}

function parseInput(str) {
	return L.autoparse(str);
}
