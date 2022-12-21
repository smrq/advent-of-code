import * as L from '../lib.mjs';

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
hmdt: 32`), 152
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const monkeys = new Map(input.map(({ name, job }) => [name, job]));
	
	function walk(name) {
		let value = monkeys.get(name);
		if (typeof value === 'number') {
			return value;
		}

		const lhs = walk(value.lhs);
		const rhs = walk(value.rhs);
		switch (value.op) {
			case '+': value = lhs + rhs; break;
			case '-': value = lhs - rhs; break;
			case '*': value = lhs * rhs; break;
			case '/': value = lhs / rhs; break;
		}
		monkeys.set(name, value);
		return value;
	}

	return walk('root');
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
