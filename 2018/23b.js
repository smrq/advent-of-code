const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('23.txt', 'utf-8').trim();
const testInput = `pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`;

class PriorityQueue {
	constructor(comparator = (a, b) => a - b) {
		this.data = [];
		this.priorities = [];
		this.length = this.data.length;
		this.comparator = comparator;
	}

	push(item, priority) {
		const index = this.priorities.findIndex(p => this.comparator(p, priority) > 0);
		this.data.splice(index, 0, item);
		this.priorities.splice(index, 0, priority);
		this.length = this.data.length;
	}

	pop() {
		const result = this.data.shift();
		this.priorities.shift();
		this.length = this.data.length;
		return result;
	}
}

function parseInput(input) {
	return input.split('\n').map(line => {
		const match = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/.exec(line);
		const [_, x, y, z, r] = match;
		return { x: +x, y: +y, z: +z, r: +r };
	});
}

function run(bots) {
	const halfStartLength = nextPowerOf2(Math.max(...flatten(bots.map(b => [
		Math.abs(b.x),
		Math.abs(b.y),
		Math.abs(b.z)
	]))));
	const start = {
		x: -halfStartLength,
		y: -halfStartLength,
		z: -halfStartLength,
		l: halfStartLength * 2
	};

	const openSet = new PriorityQueue((a, b) => (b.score - a.score) || (a.distanceToOrigin - b.distanceToOrigin));
	openSet.push(start, null);

	while (openSet.length) {
		const current = openSet.pop();
		const currentScore = scoreBox(current, bots);

		if (current.l === 0) {
			return current.x + current.y + current.z;
		}

		for (let box of subdivideAabb(current)) {
			const score = scoreBox(box, bots);
			const distanceToOrigin =
				(box.x >= 0 ? box.x : -box.x + box.l) +
				(box.y >= 0 ? box.y : -box.y + box.l) +
				(box.z >= 0 ? box.z : -box.z + box.l);
			openSet.push(box, { score, distanceToOrigin });
		}
	}

	return false;
}

function calculateDistance(a, b) {
	return Math.abs(a.x - b.x) +
		Math.abs(a.y - b.y) +
		Math.abs(a.z - b.z);
}

function flatten(arrs) {
	return [].concat(...arrs);
}

function nextPowerOf2(n) {
	n = n - 1;
	n |= n >> 1;
	n |= n >> 2;
	n |= n >> 4;
	n |= n >> 8;
	n |= n >> 16;
	n = n + 1;
	return n;
}

/*
  
  AABB:

  +-------+ <={x+l, y+l, z+l}
  |       |
  |       |
  |       |
  .-------+
  ^={x,y,z}

  Manhattan Sphere:
      ^
    /   \
  <   .---> r
    \   /
      V

*/

function subdivideAabb({ x, y, z, l }) {
	if (l > 1) {
		const l2 = l / 2;
		return [
			{ x: x,      y: y,      z: z,      l: l2 },
			{ x: x + l2, y: y,      z: z,      l: l2 },
			{ x: x,      y: y + l2, z: z,      l: l2 },
			{ x: x + l2, y: y + l2, z: z,      l: l2 },
			{ x: x,      y: y,      z: z + l2, l: l2 },
			{ x: x + l2, y: y,      z: z + l2, l: l2 },
			{ x: x,      y: y + l2, z: z + l2, l: l2 },
			{ x: x + l2, y: y + l2, z: z + l2, l: l2 },
		];
	} else {
		return [
			{ x: x,     y: y,     z: z,     l: 0 },
			{ x: x + 1, y: y,     z: z,     l: 0 },
			{ x: x,     y: y + 1, z: z,     l: 0 },
			{ x: x + 1, y: y + 1, z: z,     l: 0 },
			{ x: x,     y: y,     z: z + 1, l: 0 },
			{ x: x + 1, y: y,     z: z + 1, l: 0 },
			{ x: x,     y: y + 1, z: z + 1, l: 0 },
			{ x: x + 1, y: y + 1, z: z + 1, l: 0 },
		];
	}
}

function collideAabbWithSphere(box, sphere) {
	const boxCenter = {
		x: box.x + box.l / 2,
		y: box.y + box.l / 2,
		z: box.z + box.l / 2
	};
	const distance = calculateDistance(boxCenter, sphere);

	// Sphere does not collide with outer bounding sphere of box
	// >> This doesn't work... why?

	// if (distance > box.l + sphere.r) {
	// 	return false;
	// }

	// Sphere collides with inner bounding sphere of box

	if (distance <= (box.l / 2) + sphere.r) {
		return true;
	}

	// Sphere center collides with Minkowski of sphere and box

	if (sphere.x >= box.x - sphere.r && sphere.x <= box.x + box.l + sphere.r &&
		sphere.y >= box.y            && sphere.y <= box.y + box.l &&
		sphere.z >= box.z            && sphere.z <= box.z + box.l) {
		return true;
	}

	if (sphere.x >= box.x            && sphere.x <= box.x + box.l &&
		sphere.y >= box.y - sphere.r && sphere.y <= box.y + box.l + sphere.r &&
		sphere.z >= box.z            && sphere.z <= box.z + box.l) {
		return true;
	}

	if (sphere.x >= box.x            && sphere.x <= box.x + box.l &&
		sphere.y >= box.y            && sphere.y <= box.y + box.l &&
		sphere.z >= box.z - sphere.r && sphere.z <= box.z + box.l + sphere.r) {
		return true;
	}

	if (calculateDistance(sphere, { x: box.x,         y: box.y,         z: box.z         }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x + box.l, y: box.y,         z: box.z         }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x,         y: box.y + box.l, z: box.z         }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x + box.l, y: box.y + box.l, z: box.z         }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x,         y: box.y,         z: box.z + box.l }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x + box.l, y: box.y,         z: box.z + box.l }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x,         y: box.y + box.l, z: box.z + box.l }) <= sphere.r) return true;
	if (calculateDistance(sphere, { x: box.x + box.l, y: box.y + box.l, z: box.z + box.l }) <= sphere.r) return true;

	return false;
}

function scoreBox(box, bots) {
	return bots.reduce((acc, bot) => acc + (collideAabbWithSphere(box, bot) ? 1 : 0), 0);
}

assert.strictEqual(36, run(parseInput(testInput)));
console.log(run(parseInput(input)));
