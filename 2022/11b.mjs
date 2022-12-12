import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`), 2713310158
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(state) {
	const lcm = L.lcm(...state.map(monkey => monkey.test));

	for (let monkey of state) {
		monkey.count = 0;
	}

	function inspect(item, operator, operand) {
		if (operand === 'old') {
			operand = item;
		}
		switch (operator) {
			case '+': return item + operand;
			case '*': return item * operand;
		}
	}

	for (let round = 0; round < 10000; ++round) {
		for (let monkey of state) {
			while (monkey.items.length) {
				let item = monkey.items.shift();
				item = inspect(item, monkey.operator, monkey.operand) % lcm;

				const testResult = item % monkey.test === 0;
				const target = testResult ? monkey.ifTrue : monkey.ifFalse;
				state[target].items.push(item);

				++monkey.count;
			}
		}
	}

	const [a, b] = state.map(monkey => monkey.count).sort((a, b) => b - a);
	return a * b;
}

function parseInput(str) {
	let state = [];

	str.split('\n\n').forEach(chunk => {
		let [n, items, operation, test, ifTrue, ifFalse] = chunk.split('\n');
		let [_, operator, operand] = /Operation: new = old ([+*]) (\d+|old)/.exec(operation);
		
		n = parseInt(/Monkey (\d+)/.exec(n)[1], 10);
		items = /Starting items: ([\d, ]+)/.exec(items)[1].split(', ').map(x => parseInt(x, 10));
		if (operand !== 'old') operand = parseInt(operand, 10);
		test = parseInt(/Test: divisible by (\d+)/.exec(test)[1], 10);
		ifTrue = parseInt(/If true: throw to monkey (\d+)/.exec(ifTrue)[1], 10);
		ifFalse = parseInt(/If false: throw to monkey (\d+)/.exec(ifFalse)[1], 10);

		state[n] = { items, operator, operand, test, ifTrue, ifFalse };
	});

	return state;
}
