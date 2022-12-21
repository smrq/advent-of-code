import * as L from '../lib.mjs';
import assert from 'assert';

L.runTests(args => run(args), [
	parseInput(`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`), 301
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const monkeys = new Map(input.map(({ name, job }) => [name, job]));

	function walk(name) {
		if (name === 'humn') return 'humn';

		let value = monkeys.get(name);
		if (typeof value === 'number') {
			return value;
		}

		const lhs = walk(value.lhs);
		const rhs = walk(value.rhs);
		if (typeof lhs === 'number' && typeof rhs === 'number') {
			switch (value.op) {
				case '+': value = lhs + rhs; break;
				case '-': value = lhs - rhs; break;
				case '*': value = lhs * rhs; break;
				case '/': value = lhs / rhs; break;
			}
		} else {
			value = { lhs, op: value.op, rhs };
		}
		monkeys.set(name, value);
		return value;
	}

	const root = monkeys.get('root');
	return reduceEquality(walk(root.lhs), walk(root.rhs));
}

function reduceEquality(expr, value) {
	assert(typeof value === 'number');

	while (expr !== 'humn') {
		switch (expr.op) {
			case '+':
				if (typeof expr.lhs === 'number') {
					value = value - expr.lhs;
					expr = expr.rhs;
				} else {
					assert(typeof expr.rhs === 'number');
					value = value - expr.rhs;
					expr = expr.lhs;
				}
				break;
			case '-':
				if (typeof expr.lhs === 'number') {
					value = expr.lhs - value;
					expr = expr.rhs;
				} else {
					assert(typeof expr.rhs === 'number');
					value = expr.rhs + value;
					expr = expr.lhs;
				}
				break;
			case '*':
				if (typeof expr.lhs === 'number') {
					value = value / expr.lhs;
					expr = expr.rhs;
				} else {
					assert(typeof expr.rhs === 'number');
					value = value / expr.rhs;
					expr = expr.lhs;
				}
				break;
			case '/':
				if (typeof expr.lhs === 'number') {
					value = expr.lhs / value;
					expr = expr.rhs;
				} else {
					assert(typeof expr.rhs === 'number');
					value = expr.rhs * value;
					expr = expr.lhs;
				}
				break;
		}
	}

	return value;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const [name, job] = line.split(': ');
		if (/^\d+$/.test(job)) {
			return { name, job: parseInt(job, 10) };
		} else {
			const [_, lhs, op, rhs] = /(\w+) ([+*/-]) (\w+)/.exec(job);
			return { name, job: { lhs, op, rhs }};
		}
	});
}
