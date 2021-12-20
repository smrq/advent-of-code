export class PriorityQueue {
	constructor() {
		this.data = [];
		this.priorities = [];
		this.length = this.data.length;
	}

	push(item, priority) {
		let index = this.priorities.findIndex(p => p > priority);
		if (index === -1) {
			index = this.priorities.length;
		}
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

export class InfiniteGrid {
	constructor(dimensions) {
		this._data = new Map();
		this._dimensions = Array(dimensions).fill().map(() => [0, 0]);
	}

	set(coords, value) {
		if (coords.length !== this._dimensions.length) {
			throw new Error(`invalid coords ${coords} for ${this._dimensions.length} dimensions`);
		}

		this._data.set(coords.join(','), value);
		coords.forEach((coord, i) => {
			if (this._dimensions[i][0] > coord) {
				this._dimensions[i][0] = coord;
			}
			if (this._dimensions[i][1] < coord) {
				this._dimensions[i][1] = coord;
			}
		});
	}

	get(coords) {
		if (coords.length !== this._dimensions.length) {
			throw new Error(`invalid coords ${coords} for ${this._dimensions.length} dimensions`);
		}

		return this._data.get(coords.join(','));
	}

	dimensions() {
		return this._dimensions;
	}

	entries() {
		return this._data.entries();
	}

	values() {
		return this._data.values();
	}

	print(empty = ' ') {
		if (this._dimensions.length != 2) throw new Error('print is only supported for 2-dimensional grids');
		let [[minX, maxX], [minY, maxY]] = this.dimensions();
		for (let y = minY; y <= maxY; ++y) {
			for (let x = minX; x <= maxX; ++x) {
				const v = this.get([x, y]);
				process.stderr.write(v == null ? empty : v);
			}
			process.stderr.write('\n');
		}
	}
}
