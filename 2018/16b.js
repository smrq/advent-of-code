const fs = require('fs');
const input = fs.readFileSync('16.txt', 'utf-8').trim();

const ops = {
	addr: (r, a, b, c) => { r[c] = r[a] + r[b]; },
	addi: (r, a, b, c) => { r[c] = r[a] + b; },
	mulr: (r, a, b, c) => { r[c] = r[a] * r[b]; },
	muli: (r, a, b, c) => { r[c] = r[a] * b; },
	banr: (r, a, b, c) => { r[c] = r[a] & r[b]; },
	bani: (r, a, b, c) => { r[c] = r[a] & b; },
	borr: (r, a, b, c) => { r[c] = r[a] | r[b]; },
	bori: (r, a, b, c) => { r[c] = r[a] | b; },
	setr: (r, a, b, c) => { r[c] = r[a]; },
	seti: (r, a, b, c) => { r[c] = a; },
	gtir: (r, a, b, c) => { r[c] = a > r[b] ? 1 : 0; },
	gtri: (r, a, b, c) => { r[c] = r[a] > b ? 1 : 0; },
	gtrr: (r, a, b, c) => { r[c] = r[a] > r[b] ? 1 : 0; },
	eqir: (r, a, b, c) => { r[c] = a === r[b] ? 1 : 0; },
	eqri: (r, a, b, c) => { r[c] = r[a] === b ? 1 : 0; },
	eqrr: (r, a, b, c) => { r[c] = r[a] === r[b] ? 1 : 0; },
};

function parseSamplesString(str) {
	return str.split('\n\n')
		.map(sample => sample.split('\n'))
		.map(([before, instruction, after]) => {
			instruction = instruction.split(' ').map(x => +x);
			before = /Before: \[(\d+), (\d+), (\d+), (\d+)\]/.exec(before).slice(1).map(x => +x);
			after = /After:  \[(\d+), (\d+), (\d+), (\d+)\]/.exec(after).slice(1).map(x => +x);
			return {
				instruction, before, after
			}
		});
}

function getPossibleOpcodes({ instruction, before, after }) {
	return Object.keys(ops).filter(opcodeName =>
		isPossibleOpcode(ops[opcodeName], instruction, before, after));
}

function isPossibleOpcode(opFn, [op, a, b, c], rIn, rOut) {
	rIn = rIn.slice();
	opFn(rIn, a, b, c);
	return allRegistersEqual(rIn, rOut);
}

function allRegistersEqual(r1, r2) {
	return r1.every((x, i) => x === r2[i]);
}

function combineSamples(samples) {
	const opcodeMapping = {};
	for (let n = 0; n < 16; ++n) {
		opcodeMapping[n] = Object.keys(ops);
	}

	for (let sample of samples) {
		const possibleOpcodes = getPossibleOpcodes(sample);
		const n = sample.instruction[0];
		opcodeMapping[n] = intersect(opcodeMapping[n], possibleOpcodes);
	} 

	return opcodeMapping;
}

function intersect(arr1, arr2) {
	return arr1.filter(x => arr2.includes(x));
}

function showOpcodePossibilityTable(possibilityTable) {
	Object.keys(possibilityTable).forEach(n => {
		const values = possibilityTable[n];
		process.stdout.write(n + '\t');
		Object.keys(ops).forEach(name => {
			if (values.includes(name)) {
				process.stdout.write(name);
			}
			process.stdout.write('\t');
		});
		process.stdout.write('\n');
	});
}

function determineOpcodeMapping(possibilityTable) {
	const numberPossibilities = new Map();
	const opPossibilities = new Map();
	const mappings = [];

	for (let n = 0; n < 16; ++n) {
		numberPossibilities.set(n, new Set(possibilityTable[n]));
	}

	for (let name of Object.keys(ops)) {
		const nums = Object.keys(possibilityTable)
			.filter(n => possibilityTable[n].includes(name))
			.map(n => +n);
		opPossibilities.set(name, new Set(nums));
	}

	while (numberPossibilities.size) {
		for (let [n, set] of numberPossibilities) {
			if (set.size === 1) {
				const name = [...set][0];
				mappings[n] = name;
				opPossibilities.delete(name);
				numberPossibilities.delete(n);
				for (let [_, otherSet] of numberPossibilities) {
					otherSet.delete(name);
				}
			}
		}

		for (let [name, set] of opPossibilities) {
			if (set.size === 1) {
				const n = [...set][0];
				mappings[n] = name;
				numberPossibilities.delete(n);
				opPossibilities.delete(name);
				for (let [_, otherSet] of opPossibilities) {
					otherSet.delete(n);
				}
			}
		}
	}

	return mappings;
}

function parseProgramString(programStr) {
	return programStr.split('\n')
		.map(line => line.split(' ').map(x => +x));
}

function interpretProgram(program, opcodeMapping) {
	const registers = [0, 0, 0, 0];
	for (let [op, a, b, c] of program) {
		const opcodeName = opcodeMapping[op];
		ops[opcodeName](registers, a, b, c);
	}
	return registers[0];
}

const [samplesStr, programStr] = input.split('\n\n\n\n');

const samples = parseSamplesString(samplesStr);
const opcodeMapping = combineSamples(samples);
const possibilityTable = combineSamples(samples);
// showOpcodePossibilityTable(possibilityTable);
const mappings = determineOpcodeMapping(possibilityTable);

const program = parseProgramString(programStr);
const result = interpretProgram(program, mappings);
console.log(result);