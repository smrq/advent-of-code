import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`), '4',

	parseInput(`x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`), '2024',
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ wires, gates }) {
	while (gates.size) {
		let updated = false;
		for (let gate of gates) {
			if (wires.has(gate.a) && wires.has(gate.b)) {
				const a = wires.get(gate.a);
				const b = wires.get(gate.b);
				const o = operation(gate.op, a, b);
				wires.set(gate.o, o);
				gates.delete(gate);
				updated = true;
			}
		}
		if (!updated) break;
	}

	L.D(wires);
	let result = 0n;
	for (let [n, v] of wires.entries()) {
		if (!n.startsWith('z')) continue;
		const bit = parseInt(n.slice(1), 10);
		result |= BigInt(v) << BigInt(bit);
	}
	return String(result);
}

function operation(op, a, b) {
	switch (op) {
		case 'AND': return a & b;
		case 'OR': return a | b;
		case 'XOR': return a ^ b;
	}
}

function parseInput(str) {
	let [wires, gates] = str.trim().split('\n\n');
	wires = new Map(wires.split('\n').map(line => {
		let [wire, value] = line.split(': ');
		value = parseInt(value, 10);
		return [wire, value];
	}));
	gates = new Set(gates.split('\n').map(line => {
		let match = /^(\w+) (\w+) (\w+) -> (\w+)$/.exec(line);
		let [_, a, op, b, o] = match;
		return { op, a, b, o };
	}));
	return { wires, gates };
}
