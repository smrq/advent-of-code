const fs = require('fs');
let [players, lastMarble] = fs.readFileSync('09.txt', 'utf-8')
	.trim()
	.match(/(\d+) players; last marble is worth (\d+) points/)
	.slice(1)
	.map(x => +x);
lastMarble *= 100;

const scores = Array.from({ length: players }).map(_ => 0);
let currentMarble = { value: 0 };
currentMarble.cw = currentMarble;
currentMarble.ccw = currentMarble;
let currentPlayer = 0;

for (let marble = 1;
	marble <= lastMarble;
	++marble, currentPlayer = (currentPlayer + 1) % players
) {
	if (marble % 23 === 0) {
		for (let i = 0; i < 7; ++i) {
			currentMarble = currentMarble.ccw;
		}
		const { cw, ccw, value } = currentMarble;
		scores[currentPlayer] += marble + value;
		cw.ccw = ccw;
		ccw.cw = cw;
		currentMarble = cw;
	} else {
		const ccw = currentMarble.cw;
		const cw = currentMarble.cw.cw;
		const newMarble = { value: marble, cw, ccw };
		ccw.cw = newMarble;
		cw.ccw = newMarble;
		currentMarble = newMarble;
	}
}

console.log(Math.max(...scores));

function mod(p, q) {
	while (p < 0) {
		p += q;
	}
	return p % q;
}