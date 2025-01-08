/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/

import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`029A
980A
179A
456A
379A`), 126384
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(str => {
		const solved = solve(str);
		return score(str, solved);
	}));
}

function solve(str) {
	const kpDir = [[null, '^', 'A'], ['<', 'v', '>']];
	const kpNum = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], [null, '0', 'A']];
	const navigate = L.memo(function navigate(keypad, position, dir) {
		let [y, x] = L.findIndex2d(keypad, x => x === position);
		switch (dir) {
			case '<': --x; break;
			case '>': ++x; break;
			case '^': --y; break;
			case 'v': ++y; break;
		}
		if (L.inBounds(keypad, y, x) && keypad[y][x] != null) {
			return keypad[y][x];
		} else {
			return null;
		}
	});

	const start = { a: 'A', b: 'A', c: 'A', entered: '', path: '' };

	function goal(state) {
		return state.entered === str;
	}

	function key(state) {
		return `${state.entered}|${state.a}${state.b}${state.c}`;
	}

	function* neighbors(state) {
		for (let dir of ['<', '^', '>', 'v']) {
			const nextA = navigate(kpDir, state.a, dir);
			if (nextA) {
				yield [{ ...state, a: nextA, path: state.path + dir }, 1];
			}
		}
		if (state.a !== 'A') {
			const nextB = navigate(kpDir, state.b, state.a);
			if (nextB) {
				yield [{ ...state, b: nextB, path: state.path + 'A' }, 1];
			}
		} else {
			if (state.b !== 'A') {
				const nextC = navigate(kpNum, state.c, state.b);
				if (nextC) {
					yield [{ ...state, c: nextC, path: state.path + 'A' }, 1];
				}
			} else {
				const nextEntered = state.entered + state.c;
				if (str.startsWith(nextEntered)) {
					yield [{ ...state, entered: nextEntered, path: state.path + 'A' }, 1];
				}
			}
		}
	}

	return L.astar2({ start, goal, key, neighbors });
}

function score(str, solved) {
	L.D(str, solved.cost);
	return solved.cost * parseInt(str, 10);
}

function parseInput(str) {
	return L.autoparse(str);
}
