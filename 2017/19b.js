const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('19.txt', 'utf-8');
const tests = [
	[`     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 
`, 38]
];

function run(input) {
	const map = input.split('\n');

	let x = map[0].indexOf('|');
	let y = 0;
	let dir = 'down';
	let steps = 0;

	for (;;) {
		++steps;
		switch (dir) {
			case 'left':  --x; break;
			case 'right': ++x; break;
			case 'up':    --y; break;
			case 'down':  ++y; break;
		}
		switch (map[y][x]) {
			case ' ':
				return steps;
			case '+':
				switch (dir) {
					case 'left':
					case 'right':
						if (y > 0 && map[y-1][x] != ' ') {
							dir = 'up';
						} else if (y < map.length - 1 && map[y+1][x] != ' ') {
							dir = 'down';
						} else throw new Error();
						break;
					case 'up':
					case 'down':
						if (x > 0 && map[y][x-1] != ' ') {
							dir = 'left';
						} else if (x < map[0].length - 1 && map[y][x+1] != ' ') {
							dir = 'right';
						} else throw new Error();
						break;
				}
				break;
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
