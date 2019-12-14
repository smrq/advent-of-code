const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('14.txt', 'utf-8').trim();
const tests = [
	[`10 ORE => 10 A\n1 ORE => 1 B\n7 A, 1 B => 1 C\n7 A, 1 C => 1 D\n7 A, 1 D => 1 E\n7 A, 1 E => 1 FUEL`, 31],
	[`9 ORE => 2 A\n8 ORE => 3 B\n7 ORE => 5 C\n3 A, 4 B => 1 AB\n5 B, 7 C => 1 BC\n4 C, 1 A => 1 CA\n2 AB, 3 BC, 4 CA => 1 FUEL`, 165],
];

function parseInput(input) {
	return input.split('\n').map(parseLine);	
}

function parseLine(line) {
	const [inputStr, outputStr] = line.split(' => ');
	const inputStrs = inputStr.split(', ');

	return {
		inputs: inputStrs.map(parseItem),
		output: parseItem(outputStr)
	};
}

function parseItem(item) {
	const [n, name] = item.split(' ');
	return { name, amount: +n };
}

async function run(input) {
	const equations = parseInput(input);
	let inventory = {};
	return produce('FUEL', 1);

	function produce(name, amount) {
		let ore = 0;
		const equation = equations.find(e => e.output.name === name);
		const multiplier = Math.ceil(amount / equation.output.amount);

		for (let input of equation.inputs) {
			if (input.name === 'ORE') {
				ore += multiplier * input.amount;
			} else {
				if (!inventory[input.name]) {
					inventory[input.name] = 0;
				}

				if (inventory[input.name] < multiplier * input.amount) {
					ore += produce(input.name, multiplier * input.amount - inventory[input.name]);
				}

				inventory[input.name] -= multiplier * input.amount;
			}
		}

		if (!inventory[equation.output.name]) {
			inventory[equation.output.name] = 0;
		}

		inventory[equation.output.name] += multiplier * equation.output.amount;

		return ore;
	}
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));	
})();
