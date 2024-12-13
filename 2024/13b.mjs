import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`), 0], 480
]);

/*
[ax bx][a] = [px]
[ay by][b]   [py]
Av = p

det(A) = (ax*by - bx*ay)
A^-1 = 1/det(A) * [by -bx]
                  [-ay ax]

[a] = 1/det(A) * [by -bx][px]
[b]              [-ay ax][py]

a = 1/det(A) * (by*px - bx*py)
b = 1/det(A) * (-ay*px + ax*py)
*/

const input = parseInput(L.getRawInput());
console.log(run(input, 10000000000000));

function run(input, added) {
	let result = 0;
	for (let { a: [ax, ay], b: [bx, by], p: [px, py] } of input) {
		px += added;
		py += added;

		const det = ax*by - bx*ay;
		const aNum = by*px - bx*py;
		const bNum = -ay*px + ax*py;

		if (aNum % det === 0 && bNum % det === 0) {
			const a = aNum / det;
			const b = bNum / det;
			result += 3*a + b;
		}
	}
	return result;
}

function parseInput(str) {
	return str.trim().split('\n\n').map(lines => {
		const [aStr, bStr, pStr] = lines.split('\n');
		const a = /^Button A: X\+(\d+), Y\+(\d+)$/.exec(aStr).slice(1).map(n => parseInt(n, 10));
		const b = /^Button B: X\+(\d+), Y\+(\d+)$/.exec(bStr).slice(1).map(n => parseInt(n, 10));
		const p = /^Prize: X=(\d+), Y=(\d+)$/.exec(pStr).slice(1).map(n => parseInt(n, 10));
		return { a, b, p };
	})
	return L.autoparse(str);
}
