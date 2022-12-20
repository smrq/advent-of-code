import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`), 3068
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(jets) {
	const width = 7;
	const limit = 2022;
	const shapes = [
		//   0123
		// 0 ####
		[0b1111],

		//   012
		// 2 .#.
		// 1 ###
		// 0 .#.
		[0b010, 0b111, 0b010],

		//   012
		// 2 ..#
		// 1 ..#
		// 0 ###
		[0b111, 0b100, 0b100],

		//   0
		// 3 #
		// 2 #
		// 1 #
		// 0 #
		[0b1, 0b1, 0b1, 0b1],

		//   01
		// 1 ##
		// 0 ##
		[0b11, 0b11],
	]

	let jetIdx = 0;
	let shapeIdx = 0;
	let well = [];

	for (let i = 0; i < limit; ++i) {
		const shape = shapes[shapeIdx];
		shapeIdx = (shapeIdx + 1) % shapes.length;

		let y = well.length + 3;
		let x = 2;

		let falling = true;
		while (falling) {
			{
				const jet = jets[jetIdx];
				jetIdx = (jetIdx + 1) % jets.length;

				const dx = jet === '<' ? -1 : 1;
				let blocked = false;

				if (x+dx < 0) {
					blocked = true;
				} else {
					for (let py = 0; py < shape.length; ++py) {
						if ((shape[py] << (x+dx)) >= (1<<width)) blocked = true;
						else if (well[y+py] && !!(well[y+py] & (shape[py] << (x+dx)))) blocked = true;
					}
				}
				if (!blocked) {
					x += dx;
				}
			}

			{
				const dy = -1;
				let blocked = false;

				if (y+dy < 0) {
					blocked = true;
				} else {
					for (let py = 0; py < shape.length; ++py) {
						if (well[y+py+dy] && !!(well[y+py+dy] & (shape[py] << x))) blocked = true;
					}
				}

				if (blocked) {
					addToWell(well, shape, x, y);
					falling = false;
				} else {
					y += dy;
				}
			}
		}

	}
	// printWell(well);
	return well.length;

	function testWell(well, x, y) {
		return well[y] && !!(well[y] & 1<<x);
	}

	function addToWell(well, shape, x, y) {
		for (let py = 0; py < shape.length; ++py) {
			if (!well[y+py]) {
				well[y+py] = 0;
			}
			well[y+py] |= shape[py] << x;
		}
	}

	function printWell(well) {
		console.error(
			well
				.map(line =>
					'|'
					+ line
						.toString(2)
						.padStart(width, '0')
						.split('')
						.reverse()
						.join('')
						.replace(/0/g, '.')
						.replace(/1/g, '#')
					+ '|')
				.reverse()
				.join('\n')
			+ '\n+'
			+ '-'.repeat(width)
			+ '+');
	}
}

function parseInput(str) {
	return str.trim();
}
