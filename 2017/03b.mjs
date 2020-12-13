import assert from 'assert';
import fs from 'fs';
const input = +fs.readFileSync('03.txt', 'utf-8').trim();

function run(input) {
	const values = new Map();
	values.set(`0,0`, 1);
	for (let ring = 1; ; ++ring) {
		for (let y = -ring + 1; y <= ring; ++y) {
			const x = ring;
			const value = calculateValue(x, y);
			if (value > input) return value;
			values.set(`${x},${y}`, value);
		}
		for (let x = ring - 1; x >= -ring; --x) {
			const y = ring;
			const value = calculateValue(x, y);
			if (value > input) return value;
			values.set(`${x},${y}`, value);
		}
		for (let y = ring - 1; y >= -ring; --y) {
			const x = -ring;
			const value = calculateValue(x, y);
			if (value > input) return value;
			values.set(`${x},${y}`, value);
		}
		for (let x = -ring + 1; x <= ring; ++x) {
			const y = -ring;
			const value = calculateValue(x, y);
			if (value > input) return value;
			values.set(`${x},${y}`, value);
		}
	}

	function calculateValue(x, y) {
		return (
			(values.get(`${x-1},${y-1}`) || 0) +
			(values.get(`${x  },${y-1}`) || 0) +
			(values.get(`${x+1},${y-1}`) || 0) +
			(values.get(`${x+1},${y  }`) || 0) +
			(values.get(`${x+1},${y+1}`) || 0) +
			(values.get(`${x  },${y+1}`) || 0) +
			(values.get(`${x-1},${y+1}`) || 0) +
			(values.get(`${x-1},${y  }`) || 0)
		);
	}
}

console.log(run(input));