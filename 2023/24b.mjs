import assert from 'assert';
import { init } from 'z3-solver';
import * as L from '../lib.mjs';

const { Context } = await init();
const { Solver, Real } = new Context('main');

await L.runTests(async (args) => run(args), [
	parseInput(`19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`), 47,
]);

const input = parseInput(L.getRawInput());
console.log(await run(input));
process.exit(0);

async function run(input) {
	const solver = new Solver();

	const x = Real.const('x');
	const y = Real.const('y');
	const z = Real.const('z');
	const vx = Real.const('vx');
	const vy = Real.const('vy');
	const vz = Real.const('vz');

	for (let i = 0; i < 5; ++i) {
		const { position: [xi, yi, zi], velocity: [vxi, vyi, vzi] } = input[i];
		const ti = Real.const(`t${i}`);
		solver.add(ti.mul(vx).add(x).eq(ti.mul(vxi).add(xi)));
		solver.add(ti.mul(vy).add(y).eq(ti.mul(vyi).add(yi)));
		solver.add(ti.mul(vz).add(z).eq(ti.mul(vzi).add(zi)));
	}

	const result = Real.const('result');
	solver.add(result.eq(x.add(y).add(z)));

	assert(await solver.check() === 'sat');
	const model = solver.model();
	return model.get(result).asNumber();
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const [position, velocity] = line.split(/\s+@\s+/)
			.map(triplet => triplet.split(/,\s+/)
				.map(n => parseInt(n, 10)))
		return { position, velocity };
	});
}
