import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`), 11, 7, 100], 12
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 101, 103, 100));

function run(input, w, h, t) {
	const final = input.map(({ px, py, vx, vy }) => {
		const x = L.modulo(px + t * vx, w);
		const y = L.modulo(py + t * vy, h);
		return [x, y];
	});

	// for (let i = 0; i < h; ++i) {
	// 	for (let j = 0; j < w; ++j) {
	// 		process.stderr.write(`${final.filter(([x, y]) => y === i && x === j).length || '.'}`);
	// 	}
	// 	process.stderr.write('\n');
	// }

	const q1 = final.filter(([x, y]) => x < Math.floor(w/2) && y < Math.floor(h/2)).length;
	const q2 = final.filter(([x, y]) => x >= Math.ceil(w/2) && y < Math.floor(h/2)).length;
	const q3 = final.filter(([x, y]) => x < Math.floor(w/2) && y >= Math.ceil(h/2)).length;
	const q4 = final.filter(([x, y]) => x >= Math.ceil(w/2) && y >= Math.ceil(h/2)).length;
	return q1 * q2 * q3 * q4;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const match = /^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/.exec(line);
		const [px, py, vx, vy] = match.slice(1).map(n => parseInt(n, 10));
		return { px, py, vx, vy };
	});
	return L.autoparse(str);
}
