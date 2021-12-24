import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let facts = [
		'Input = [In0, In1, In2, In3, In4, In5, In6, In7, In8, In9, In10, In11, In12, In13]',
		'Input ins 1..9',
		'W0 #= 0',
		'X0 #= 0',
		'Y0 #= 0',
		'Z0 #= 0',
	];
	let varIdxs = { w: 0, x: 0, y: 0, z: 0, inp: 0 };
	for (let {opcode, args} of input) {
		facts.push(instructionToFact(opcode, args, varIdxs));
	}
	facts.push(`0 #= Z${varIdxs.z}`);
	const program = 'program(Input) :-\n' + facts.join(',\n') + '.';
	return program;
}

function instructionToFact(opcode, args, varIdxs) {
	let arg0, arg1;
	if (opcode === 'inp') {
		arg0 = 'In' + varIdxs.inp;
		++varIdxs.inp;
	} else {
		arg0 = args[0].toUpperCase() + varIdxs[args[0]];
		arg1 = typeof args[1] === 'string' ?
			args[1].toUpperCase() + varIdxs[args[1]] :
			args[1];
	}
	++varIdxs[args[0]];
	let lhs = args[0].toUpperCase() + varIdxs[args[0]];

	switch (opcode) {
		case 'inp': return `${lhs} #= ${arg0}`;
		case 'add': return `${lhs} #= ${arg0} + ${arg1}`;
		case 'mul': return `${lhs} #= ${arg0} * ${arg1}`;
		case 'div': return `${lhs} #= ${arg0} // ${arg1}`;
		case 'mod': return `${lhs} #= ${arg0} mod ${arg1}`;
		case 'eql': return `${lhs} #<==> ${arg0} #= ${arg1}`;
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
