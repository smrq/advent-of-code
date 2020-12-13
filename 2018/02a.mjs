import fs from 'fs';
const ids = fs.readFileSync('02.txt', 'utf-8')
	.trim()
	.split('\n');

const twos = ids.map(id => check(id, 2)).filter(x => x).length;
const threes = ids.map(id => check(id, 3)).filter(x => x).length;
console.log(twos * threes);

function check(id, n) {
	const counts = countLetters(id);
	return Object.values(counts).includes(n);
}

function countLetters(str) {
	const result = {};
	str.split('').forEach(letter => {
		result[letter] = (result[letter] || 0) + 1;
	});
	return result;
}
