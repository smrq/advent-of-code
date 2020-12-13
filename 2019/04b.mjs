import fs from 'fs';
const input = fs.readFileSync('04.txt', 'utf-8').trim();
const [minStr, maxStr] = input.split('-');
const min = +minStr;
const max = +maxStr;

let result = [];
for (let a = +minStr[0]; a <= +maxStr[0]; ++a)
for (let b = a; b <= 9; ++b)
for (let c = b; c <= 9; ++c)
for (let d = c; d <= 9; ++d)
for (let e = d; e <= 9; ++e)
for (let f = e; f <= 9; ++f) {
	if ((a === b && b !== c) ||
		(a !== b && b === c && c !== d) ||
		(b !== c && c === d && d !== e) ||
		(c !== d && d === e && e !== f) ||
		(d !== e && e === f)) {
		const n = f + 10*e + 100*d + 1000*c + 10000*b + 100000*a;
		if (n >= min && n <= max) {
			result.push(n);
		}
	}
}
console.log(result.length);