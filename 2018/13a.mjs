import fs from 'fs';
const [tracks, carts] = parseCarts(fs.readFileSync('13.txt', 'utf-8'));

forever: while (true) {
	carts.sort((a, b) => (a.y - b.y) || (a.x - b.x));
	for (let cart of carts) {
		moveCart(tracks, cart);
		if (carts.some(other => cart !== other && cart.x === other.x && cart.y === other.y)) {
			console.log(`${cart.x},${cart.y}`);
			break forever;
		}
	}
}

function parseCarts(str) {
	const tracks = str.split('\n');
	const carts = [];
	for (let y = 0; y < tracks.length; ++y) {
		for (let x = 0; x < tracks[y].length; ++x) {
			if (tracks[y][x] === 'v') {
				carts.push({ x, y, dir: 'down', turnNum: 0 });
				tracks[y] = tracks[y].slice(0, x) + '|' + tracks[y].slice(x + 1);
			} else if (tracks[y][x] === '^') {
				carts.push({ x, y, dir: 'up', turnNum: 0 });
				tracks[y] = tracks[y].slice(0, x) + '|' + tracks[y].slice(x + 1);
			} else if (tracks[y][x] === '<') {
				carts.push({ x, y, dir: 'left', turnNum: 0 });
				tracks[y] = tracks[y].slice(0, x) + '-' + tracks[y].slice(x + 1);
			} else if (tracks[y][x] === '>') {
				carts.push({ x, y, dir: 'right', turnNum: 0 });
				tracks[y] = tracks[y].slice(0, x) + '-' + tracks[y].slice(x + 1);
			}
		}
	}

	return [tracks, carts];	
}

function moveCart(tracks, cart) {
	switch (cart.dir) {
		case 'up':
			--cart.y;
			break;
		case 'down':
			++cart.y;
			break;
		case 'left':
			--cart.x;
			break;
		case 'right':
			++cart.x;
			break;
	}

	if (tracks[cart.y][cart.x] === '/') {
		switch (cart.dir) {
			case 'up': cart.dir = 'right'; break;
			case 'down': cart.dir = 'left'; break;
			case 'left': cart.dir = 'down'; break;
			case 'right': cart.dir = 'up'; break;
		}
	} else if (tracks[cart.y][cart.x] === '\\') {
		switch (cart.dir) {
			case 'up': cart.dir = 'left'; break;
			case 'down': cart.dir = 'right'; break;
			case 'left': cart.dir = 'up'; break;
			case 'right': cart.dir = 'down'; break;
		}
	} else if (tracks[cart.y][cart.x] === '+') {
		switch (cart.turnNum) {
			case 0: // turn left
				switch (cart.dir) {
					case 'up': cart.dir = 'left'; break;
					case 'left': cart.dir = 'down'; break;
					case 'down': cart.dir = 'right'; break;
					case 'right': cart.dir = 'up'; break;
				}
				break;

			case 1: // straight
				break;

			case 2: // turn right
				switch (cart.dir) {
					case 'up': cart.dir = 'right'; break;
					case 'right': cart.dir = 'down'; break;
					case 'down': cart.dir = 'left'; break;
					case 'left': cart.dir = 'up'; break;
				}
				break;
		}
		cart.turnNum = (cart.turnNum + 1) % 3;
	}
}
