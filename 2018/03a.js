const fs = require('fs');
const claims = fs.readFileSync('03.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(str => {
		const [_, id, x, y, w, h] = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(str);
		return {
			id: +id,
			x: +x,
			y: +y,
			w: +w,
			h: +h
		};
	});

const fabric = Array.from({ length: 1000 * 1000 });
claims.forEach(claim => {
	claimFabric(fabric, claim);
});

console.log(fabric.filter(x => x === 'x').length);

function claimFabric(fabric, claim) {
	const { id, x, y, w, h } = claim;
	for (let j = y; j < y + h; ++j) {
		for (let i = x; i < x + w; ++i) {
			if (fabric[j * 1000 + i] == null) {
				fabric[j * 1000 + i] = id;
			} else {
				fabric[j * 1000 + i] = 'x';
			}
		}
	}
}
