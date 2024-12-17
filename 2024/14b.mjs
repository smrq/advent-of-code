import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input, 101, 103));

function run(input, w, h) {
	const tTarget = findT(input, w, h);
	for (let t = 0; t < tTarget; ++t) {
		input = sim(input, w, h);
	}
	print(input, w, h);
	return tTarget;
}

function sim(input, w, h) {
	return input.map(({ px, py, vx, vy }) => {
		const x = L.modulo(px + vx, w);
		const y = L.modulo(py + vy, h);
		return { px: x, py: y, vx, vy };
	});
}

function findT(input, w, h) {
	const best = {
		xVar: Infinity,
		xTime: -1,
		yVar: Infinity,
		yTime: -1,
	};

	for (let t = 0; t < Math.max(w, h); ++t) {
		const xVar = L.variance(input.map(({ px }) => px));
		const yVar = L.variance(input.map(({ py }) => py));

		if (xVar < best.xVar) {
			best.xVar = xVar;
			best.xTime = t;
		}

		if (yVar < best.yVar) {
			best.yVar = yVar;
			best.yTime = t;
		}

		input = sim(input, w, h);
	}

	return L.chineseRemainder([best.xTime, best.yTime], [w, h]);
}

function print(input, w, h) {
	for (let i = 0; i < h; ++i) {
		for (let j = 0; j < w; ++j) {
			process.stderr.write(`${input.filter(({px, py}) => py === i && px === j).length || '.'}`);
		}
		process.stderr.write('\n');
	}
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const match = /^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/.exec(line);
		const [px, py, vx, vy] = match.slice(1).map(n => parseInt(n, 10));
		return { px, py, vx, vy };
	});
}
