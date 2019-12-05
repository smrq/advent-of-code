const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('25.txt', 'utf-8').trim();
const tests = [
	['0,0,0,0\n3,0,0,0\n0,3,0,0\n0,0,3,0\n0,0,0,3\n0,0,0,6\n9,0,0,0\n12,0,0,0', 2],
	['-1,2,2,0\n0,0,2,-2\n0,0,0,-2\n-1,2,0,0\n-2,-2,-2,2\n3,0,2,-1\n-1,3,2,2\n-1,0,-1,0\n0,2,1,-2\n3,0,0,0', 4],
	['1,-1,0,1\n2,0,-1,0\n3,2,-1,0\n0,0,3,1\n0,0,-1,-1\n2,3,-2,0\n-2,2,0,0\n2,-2,0,-1\n1,-1,0,-1\n3,2,0,2', 3],
	['1,-1,-1,-2\n-2,-2,0,1\n0,2,1,3\n-2,3,-2,1\n0,2,3,-2\n-1,-1,1,-2\n0,-2,-1,0\n-2,2,3,-1\n1,2,2,0\n-1,-2,0,-2', 8]
];

function parseInput(input) {
	return input.split('\n').map(line => {
		const [w, x, y, z] = line.trim().split(',').map(x => +x);
		return { w, x, y, z, links: [] };
	});
}

function calculateDistance(a, b) {
	return Math.abs(a.w - b.w) +
		Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z);
}

function run(input) {
	const points = parseInput(input);
	for (let i = 1; i < points.length; ++i) {
		for (let j = 0; j < i; ++j) {
			const distance = calculateDistance(points[i], points[j]);
			if (distance <= 3) {
				points[i].links.push(j);
				points[j].links.push(i);
			}
		}
	}

	let result = 0;
	for (let point of points) {
		if (!point.visited) {
			++result;
			visit(points, point);
		}
	}

	return result;

}

function visit(points, point) {
	if (point.visited) return;
	point.visited = true;
	for (let link of point.links) {
		visit(points, points[link]);
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
