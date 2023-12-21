import assert from 'assert';
import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input, 26501365));

function floodFill(map, start) {
	map = structuredClone(map);

	let working = [start];
	map[start[0]][start[1]] = 0;

	while (working.length) {
		let next = [];
		for (let [y, x] of working) {
			for (let [dy, dx] of L.orthogonalOffsets(2)) {
				if ('S.'.includes(map[y+dy]?.[x+dx])) {
					map[y+dy][x+dx] = map[y][x] + 1;
					next.push([y+dy, x+dx]);
				}
			}
		}
		working = next;
	}

	return map;
}

function countSpaces(map, steps) {
	return map
		.flatMap(x => x)
		.filter(cell =>
			typeof cell === 'number' &&
			cell % 2 === steps % 2 &&
			cell <= steps)
		.length;
}

function run(input, steps) {
	assert(input.length === input[0].length);

	const N = input.length; // 131
	const A = Math.floor(steps / N); // 202300
	const B = steps % N; // 65

	assert(N === B*2+1);

	const start = L.findIndex2d(input, cell => cell === 'S');
	assert(start[0] === B);
	assert(start[1] === B);

	const maps = {
		mid: floodFill(input, [B, B]),
		n: floodFill(input, [0, B]),
		e: floodFill(input, [B, N-1]),
		s: floodFill(input, [N-1, B]),
		w: floodFill(input, [B, 0]),
		ne: floodFill(input, [0, N-1]),
		se: floodFill(input, [N-1, N-1]),
		sw: floodFill(input, [N-1, 0]),
		nw: floodFill(input, [0, 0]),
	};

	assert(maps.mid[B][0] === B);
	assert(maps.mid[B][N-1] === B);
	assert(maps.mid[0][B] === B);
	assert(maps.mid[N-1][B] === B);

	assert(maps.mid[0][0] === N-1);
	assert(maps.mid[N-1][0] === N-1);
	assert(maps.mid[0][N-1] === N-1);
	assert(maps.mid[N-1][N-1] === N-1);

	let result = 0;

	// Tiles at the far cardinal corners
	result += countSpaces(maps.n, N-1);
	result += countSpaces(maps.e, N-1);
	result += countSpaces(maps.s, N-1);
	result += countSpaces(maps.w, N-1);

	// Tiles along the diagonal border with a single corner cut out
	result += (A-1) * countSpaces(maps.ne, N+B-1);
	result += (A-1) * countSpaces(maps.se, N+B-1);
	result += (A-1) * countSpaces(maps.sw, N+B-1);
	result += (A-1) * countSpaces(maps.nw, N+B-1);

	// Tiles along the diagonal border consisting of a single corner
	result += A * countSpaces(maps.ne, B-1);
	result += A * countSpaces(maps.se, B-1);
	result += A * countSpaces(maps.sw, B-1);
	result += A * countSpaces(maps.nw, B-1);

	// Interior tiles
	result += (A-1)**2 * countSpaces(maps.mid, steps);
	result += A**2 * countSpaces(maps.mid, steps - B);

	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}
