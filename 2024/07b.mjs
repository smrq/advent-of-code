import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`), 11387
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input
		.filter(({ value, list }) => validate(value, list))
		.map(({ value }) => value)
	);
}

function validate(value, list) {
	const results = list.slice(1).reduce(
		(values, n) => [
			...values.map(v => v + n),
			...values.map(v => v * n),
			...values.map(v => parseInt(`${v}${n}`, 10)),
		],
		[list[0]]
	);
	return results.includes(value);
}

function parseInput(str) {
	return L.autoparse(str).map(line => {
		let [value, list] = line.split(': ');
		value = parseInt(value, 10);
		list = list.split(' ').map(n => parseInt(n, 10));
		return { value, list };
	});
}
