import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`), '4,6,3,5,6,3,5,2,1,0',
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ program, a, b, c }) {
	return runProgram(program, a, b, c).join(',');
}

function runProgram(program, a, b, c) {
	function combo(operand) {
		switch (operand) {
			case 0:
			case 1:
			case 2:
			case 3: return operand;
			case 4: return a;
			case 5: return b;
			case 6: return c;
			case 7: throw new Error();
		}
	}

	const output = [];
	for (let ip = 0; ip < program.length; ip += 2) {
		const opcode = program[ip];
		const operand = program[ip + 1];

		switch (opcode) {
			case 0:
				a = a >> combo(operand);
				break;
			case 1:
				b = b ^ operand;
				break;
			case 2:
				b = combo(operand) % 8;
				break;
			case 3:
				if (a !== 0) {
					ip = operand - 2;
				}
				break;
			case 4:
				b = b ^ c;
				break;
			case 5:
				output.push(combo(operand) % 8);
				break;
			case 6:
				b = a >> combo(operand);
				break;
			case 7:
				c = a >> combo(operand);
				break;
		}
	}

	return output;
}

function parseInput(str) {
	const program = /Program: ([\d,]+)/.exec(str)[1].split(',').map(n => parseInt(n, 10));
	const a = parseInt(/Register A: (\d+)/.exec(str)[1], 10);
	const b = parseInt(/Register B: (\d+)/.exec(str)[1], 10);
	const c = parseInt(/Register C: (\d+)/.exec(str)[1], 10);
	return { program, a, b, c };
}
