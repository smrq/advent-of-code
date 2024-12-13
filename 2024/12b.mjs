import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`AAAA
BBCD
BBCC
EEEC`), 80,
	parseInput(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`), 236,
	parseInput(`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`), 368,
	parseInput(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`), 1206,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const groups = [];
	const groupMap = [...Array(input.length)].map(() => [...Array(input[0].length)]);
	const unfilled = new Set(input.flatMap((row, y) => row.map((_, x) => `${y},${x}`)));

	while (unfilled.size > 0) {
		const groupId = groups.length;
		const [startY, startX] = unfilled.values().next().value.split(',').map(n => parseInt(n, 10));
		groups[groupId] = { start: [startY, startX], area: 1, sides: 0 };
		groupMap[startY][startX] = groupId;
		unfilled.delete(`${startY},${startX}`);

		let working = [[startY, startX]];
		while (working.length) {
			const next = [];
			for (let [y, x] of working) {
				for (let [dy, dx] of L.orthogonalOffsets(2)) {
					if (
						L.inBounds(input, y + dy, x + dx) &&
						input[y + dy][x + dx] === input[y][x] &&
						groupMap[y + dy][x + dx] == null
					) {
						groups[groupId].area += 1;
						groupMap[y + dy][x + dx] = groupId;
						unfilled.delete(`${y + dy},${x + dx}`);
						next.push([y + dy, x + dx]);
					}
				}
			}
			working = next;
		}
	}

	groups.forEach((group, groupId) => {
		for (let y = 0; y < groupMap.length + 1; ++y) {
			let state = 0;

			for (let x = 0; x < groupMap[0].length; ++x) {
				const beforeInGroup = L.inBounds(groupMap, y-1, x) && groupMap[y-1][x] === groupId;
				const afterInGroup = L.inBounds(groupMap, y, x) && groupMap[y][x] === groupId;
				const nextState = (beforeInGroup ? 1 : 0) + (afterInGroup ? 2 : 0);

				if ((nextState === 1 || nextState === 2) && nextState !== state) {
					++group.sides;
				}

				state = nextState;
			}
		}

		for (let x = 0; x < groupMap[0].length + 1; ++x) {
			let state = 0;

			for (let y = 0; y < groupMap.length; ++y) {
				const beforeInGroup = L.inBounds(groupMap, y, x-1) && groupMap[y][x-1] === groupId;
				const afterInGroup = L.inBounds(groupMap, y, x) && groupMap[y][x] === groupId;
				const nextState = (beforeInGroup ? 1 : 0) + (afterInGroup ? 2 : 0);

				if ((nextState === 1 || nextState === 2) && nextState !== state) {
					++group.sides;
				}

				state = nextState;
			}
		}
	});

	L.D(groups);
	return L.sum(groups.map(group => group.area * group.sides));
}

function parseInput(str) {
	return str.trim().split('\n').map(row => row.split(''));
}
