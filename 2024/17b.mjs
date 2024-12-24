import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ program, b, c }) {
	return search(program, 0, 0n, b, c).toString();
}

function search(program, i, a, b, c) {
	if (i === program.length) {
		return a;
	}

	for (let n = 0n; n < 8n; ++n) {
		const aNext = 8n*a + n;
		const output = runProgram(program, aNext, b, c);
		if (output[0] === program[program.length - 1 - i]) {
			L.D(`A=${aNext.toString(8)} => ${output.join(',')}`);
			const result = search(program, i+1, aNext, b, c);
			if (result != null) {
				return result;
			}
		}
	}

	return null;
}

function runProgram(program, a, b, c) {
	function combo(operand) {
		switch (operand) {
			case 0:
			case 1:
			case 2:
			case 3: return BigInt(operand);
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
				b = b ^ BigInt(operand);
				break;
			case 2:
				b = combo(operand) % 8n;
				break;
			case 3:
				if (a !== 0n) {
					ip = operand - 2;
				}
				break;
			case 4:
				b = b ^ c;
				break;
			case 5:
				output.push(Number(combo(operand) % 8n));
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
	const b = BigInt(parseInt(/Register B: (\d+)/.exec(str)[1], 10));
	const c = BigInt(parseInt(/Register C: (\d+)/.exec(str)[1], 10));
	return { program, b, c };
}
