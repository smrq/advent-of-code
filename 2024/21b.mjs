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

                    2            8                6                A
         <      ^   A       ^^   A        v   >   A        vv      A
  v <<   A >  ^ A > A   <   AA > A   < v  A > A ^ A   < v  AA ^  > A
<vA<AA>>^AvA<^A>AvA^A<v<A>>^AAvA^A<v<A>A^>AvA^A<A>A<v<A>A^>AA<A>vA^A
*/

import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`029A
980A
179A
456A
379A`), 3], 126384
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 26));

function run(input, levels) {
	return L.sum(input.map(str => {
		const solved = solve(str, levels);
		return score(str, solved);
	}));
}

function generatePaths(keypad) {
	const result = {};

	for (let y1 = 0; y1 < keypad.length; ++y1) {
		for (let x1 = 0; x1 < keypad[y1].length; ++x1) {
			const a = keypad[y1][x1];
			if (a == null) continue;

			result[a] = {};

			for (let y2 = 0; y2 < keypad.length; ++y2) {
				for (let x2 = 0; x2 < keypad[y2].length; ++x2) {
					const b = keypad[y2][x2];
					if (b == null) continue;

					const horiz = Array(Math.abs(x2 - x1)).fill(x2 > x1 ? '>' : '<').join('');
					const vert = Array(Math.abs(y2 - y1)).fill(y2 > y1 ? 'v' : '^').join('');

					if (keypad[y2][x1] == null) {
						// vertical first is invalid
						result[a][b] = horiz + vert + 'A';
					}
					else if (keypad[y1][x2] == null) {
						// horizontal first is invalid
						result[a][b] = vert + horiz + 'A';
					}
					else if (horiz.includes('<')) {
						// prioritize <
						result[a][b] = horiz + vert + 'A';
					}
					else {
						result[a][b] = vert + horiz + 'A';	
					}
				}
			}
		}
	}

	return result;
}

function solve(str, levels) {
	const dirPaths = generatePaths([[null, '^', 'A'], ['<', 'v', '>']]);
	const numPaths = generatePaths([['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], [null, '0', 'A']]);
	
	const traverse = L.memo(function (str, level, levels) {
		if (level === levels) {
			return str.length;
		} else {
			const paths = level === 0 ? numPaths : dirPaths;
			let prev = 'A';
			let result = 0;
			for (let i = 0; i < str.length; ++i) {
				result += traverse(paths[prev][str[i]], level + 1, levels);
				prev = str[i];
			}
			return result;
		}
	});

	return traverse(str, 0, levels);
}

function score(str, solved) {
	L.D(str, solved);
	return solved * parseInt(str, 10);
}

function parseInput(str) {
	return L.autoparse(str);
}
