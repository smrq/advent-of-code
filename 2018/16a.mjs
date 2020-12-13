import fs from 'fs';
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

const [samplesStr, programStr] = input.split('\n\n\n\n');
const samples = parseSamplesString(samplesStr);
const ambiguousSamples = samples.filter(sample => getPossibleOpcodes(sample).length >= 3);
console.log(ambiguousSamples.length);
