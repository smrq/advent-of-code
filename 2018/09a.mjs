import fs from 'fs';
const [players, lastMarble] = fs.readFileSync('09.txt', 'utf-8')
	.trim()
	.match(/(\d+) players; last marble is worth (\d+) points/)
	.slice(1)
	.map(x => +x);
// const players = 13, lastMarble = 7999;

const scores = Array.from({ length: players }).map(_ => 0);
const marbles = [0];
let currentIndex = 0;
let currentPlayer = 0;

for (let marble = 1;
	marble <= lastMarble;
	++marble, currentPlayer = (currentPlayer + 1) % players
) {
	if (marble % 23 === 0) {
		currentIndex = mod(currentIndex - 7, marbles.length);
		const removed = marbles.splice(currentIndex, 1);
		scores[currentPlayer] += marble + removed[0];
	} else {
		currentIndex = mod(currentIndex + 2, marbles.length);
		marbles.splice(currentIndex, 0, marble);
	}

	// console.log(`[${currentPlayer}] ` + marbles.map((m, i) => {
	// 	if (i === currentIndex) {
	// 		return `(${m})`;
	// 	} else {
	// 		return ` ${m} `;
	// 	}
	// }).join(''));
}

console.log(Math.max(...scores));
function mod(p, q) {
	while (p < 0) {
		p += q;
	}
	return p % q;
}