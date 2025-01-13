/*
Kn = Xn ^ Yn
An = Xn & Yn
Bn = Cn-1 & Kn
Cn = An | Bn
Zn = Cn-1 ^ Kn

C0 = A0
Z0 = K0
*/

import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(gates) {
	const swaps = [
		['z15', 'fph'],
		['z21', 'gds'],
		['wrk', 'jrs'],
		['cqk', 'z34'],
	];
	for (let [a, b] of swaps) {
		swap(gates, a, b);
	}

	const wires = new Map();
	for (let gate of gates) {
		if (/^[xy]/.test(gate.a)) {
			wires.set(gate.a, gate.a);
		}
		if (/^[xy]/.test(gate.b)) {
			wires.set(gate.b, gate.b);
		}
	}

	while (gates.size) {
		let updated = false;
		for (let gate of gates) {
			if (wires.has(gate.a) && wires.has(gate.b)) {
				const a = wires.get(gate.a);
				const b = wires.get(gate.b);
				const o = operation(gate.op, a, b, gate.a, gate.b);
				wires.set(gate.o, o);
				gates.delete(gate);
				updated = true;
			}
		}
		if (!updated) break;
	}

	for (let entry of wires.entries()) {
		L.D(entry);
	}

	return swaps.flat().sort().join(',');
}

function swap(gates, a, b) {
	const values = [...gates.values()];
	const gateA = values.find(gate => gate.o === a);
	const gateB = values.find(gate => gate.o === b);
	gateA.o = b;
	gateB.o = a;
}

function operation(op, a, b, aWire, bWire) {
	if (a.localeCompare(b) > 0) {
		[a, b] = [b, a];
		[aWire, bWire] = [bWire, aWire];
	}
	let a_ = parseWire(a);
	let b_ = parseWire(b);

	if (a_ && b_) {
		if (a_.name === 'a' && b_.name === 'b' && a_.n === b_.n) {
			return `c${String(a_.n).padStart(2, '0')}`;
		}

		if (a_.name === 'x' && b_.name === 'y' && a_.n === b_.n) {
			if (op === 'AND' && a_.n === 0) {
				return 'c00';
			}

			if (op === 'XOR')
				return `k${String(a_.n).padStart(2, '0')}`;
			if (op === 'AND')
				return `a${String(a_.n).padStart(2, '0')}`;
			if (op === 'OR')
				return `o${String(a_.n).padStart(2, '0')}`;
		}

		if (a_.name === 'c' && b_.name === 'k' && a_.n + 1 === b_.n && op === 'AND') {
			return `b${String(Math.max(a_.n, b_.n)).padStart(2, '0')}`;
		}

		if (a_.name === 'c' && b_.name === 'k' && a_.n + 1 === b_.n && op === 'XOR') {
			return `z${String(Math.max(a_.n, b_.n)).padStart(2, '0')}`;
		}
	}

	switch (op) {
		case 'AND': return `(${aWire}=${a}) & (${bWire}=${b})`;
		case 'OR': return `(${aWire}=${a}) | (${bWire}=${b})`;
		case 'XOR': return `(${aWire}=${a}) ^ (${bWire}=${b})`;
	}
}

function parseWire(str) {
	const match = /^([a-z]+)(\d+)$/.exec(str);
	if (!match) return;
	let [_, name, n] = match;
	n = parseInt(n, 10);
	return { name, n };
}

function parseInput(str) {
	let [wires, gates] = str.trim().split('\n\n');
	gates = new Set(gates.split('\n').map(line => {
		let match = /^(\w+) (\w+) (\w+) -> (\w+)$/.exec(line);
		let [_, a, op, b, o] = match;
		return { op, a, b, o };
	}));
	return gates;
}
