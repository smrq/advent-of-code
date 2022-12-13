import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`), 140
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const d1 = [[2]];
	const d2 = [[6]];
	input.push(d1, d2);
	input.sort((a, b) => compare(a, b) ? -1 : 1);
	return (input.indexOf(d1)+1) * (input.indexOf(d2)+1);
}

function compare(left, right) {
	if (!Array.isArray(left) && !Array.isArray(right)) {
		return left < right ? true :
			left > right ? false :
			null;
	}

	if (!Array.isArray(left)) left = [left];
	if (!Array.isArray(right)) right = [right];

	for (let i = 0; i < left.length && i < right.length; ++i) {
		const cmp = compare(left[i], right[i]);
		if (cmp != null) return cmp;
	}

	if (left.length < right.length) return true;
	if (left.length > right.length) return false;

	return null;
}

function parseInput(str) {
	return str.split('\n').filter(Boolean).map(parseList);
}

function parseList(str) {
	return JSON.parse(str);
}
