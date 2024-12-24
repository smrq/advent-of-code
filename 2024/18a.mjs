import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`), 6, 12], 22,
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 70, 1024));

function run(input, size, fallen) {
	const result = L.astar2({
		start: { y: 0, x: 0 },
		goal: ({ x, y }) => x === size && y === size,
		key: ({ x, y }) => `${x},${y}`,
		neighbors: function *({ x, y }) {
			for (let [dy, dx] of L.orthogonalOffsets(2)) {
				if (
					x+dx >= 0 && x+dx <= size &&
					y+dy >= 0 && y+dy <= size &&
					!input.slice(0, fallen).includes(`${x+dx},${y+dy}`)
				) {
					yield [{ x: x + dx, y: y + dy }, 1];
				}
			}
		}
	});
	L.D(result);
	return result.cost;
}

function parseInput(str) {
	return str.trim().split('\n');
}
