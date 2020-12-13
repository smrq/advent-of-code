import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('03.txt', 'utf-8').trim();

assert.strictEqual(6, score(`R8,U5,L5,D3
U7,R6,D4,L4`));
assert.strictEqual(159, score(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`));
assert.strictEqual(135, score(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`));

console.log(score(input));

function score(pathStr) {
	const paths = pathStr.split('\n')
	 	.map(str => str.split(','));
	const lines = paths.map(calculateLines);
	const intersections = findIntersections(...lines);
	return intersections.map(distance).sort((a, b) => a - b)[0];
}

function distance(coords) {
	return Math.abs(coords[0]) + Math.abs(coords[1]);
}

function calculateLines(path) {
	const result = [];
	let x1 = 0;
	let y1 = 0;
	for (let command of path) {
		let [dir, amount] = /(\w)(\d+)/.exec(command).slice(1);
		amount = +amount;

		let x2 = x1;
		let y2 = y1;
		switch (dir) {
			case 'U': y2 += amount; break;
			case 'D': y2 -= amount; break;
			case 'R': x2 += amount; break;
			case 'L': x2 -= amount; break;
		}

		result.push({ x1, y1, x2, y2 });

		x1 = x2;
		y1 = y2;
	}
	return result;
}

function findIntersections(lines1, lines2) {
	const intersections = new Set();
	for (let line1 of lines1) {
		for (let line2 of lines2) {
			if (line1.x1 === line1.x2) {
				if (line2.x1 === line2.x2) continue;
				const x = line1.x1;
				const y = line2.y1;
				if (x === 0 && y === 0) continue;
				if (((line2.x1 <= x && line2.x2 >= x) ||
					 (line2.x2 <= x && line2.x1 >= x)) &&
					((line1.y1 <= y && line1.y2 >= y) ||
					 (line1.y2 <= y && line1.y1 >= y))) {
					intersections.add(`${x},${y}`);
				}
			} else {
				if (line2.y1 === line2.y2) continue;
				const x = line2.x1;
				const y = line1.y1;
				if (x === 0 && y === 0) continue;
				if (((line1.x1 <= x && line1.x2 >= x) ||
					 (line1.x2 <= x && line1.x1 >= x)) &&
					((line2.y1 <= y && line2.y2 >= y) ||
					 (line2.y2 <= y && line2.y1 >= y))) {
					intersections.add(`${x},${y}`);
				}
			}
		}
	}
	return [...intersections].map(x => x.split(',').map(n => +n));
}