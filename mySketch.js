/*
Nyan Jump
Dena Huang
d74huang

INSTRUCTIONS
This game is called Nyan Jump, a game similar to the iconic
	2000's mobile game, Doodle Jump, but with the character as
	the iconic Nyan Cat. The aim of the game is to jump onto 
	the platforms and move "upwards" and collect coins as points. 
	In the original game, the player would tilt their
	screen sideways to move left and right; in my version, the 
	player will use their mouse to control direction. If the player
	falls off the screen (bottom), then the game is over. I have
	implemented a way for the high score to be saved and displayed, 
	and allow the user to play again to beat their high score. 
	To start the game, the player simply moves their character
	to the platform and presses the mouse. To pause the game,
	the player can simply press the 'P' key. 
HINT: it is much easier to play with a mouse!
NOTE: Nyan cat's body (pop tart looking area) must hit the 
	platform or coin to count. The head, tail, and legs do
	not count. 

CODING QUALITY AND VISUAL DESIGN
My coding skills are great because I have created modular 
	code by organizing my code neatly through the use of
	functions and whitespace to block off code. I have separated
	code into functions that draw and move items throughout my 
	game. 
My visual design is great because of the simple yet stunning
	visuals that are incorporated in retro games. The main focus
	of this game is Nyan cat, and I am quite proud of how well I
	coded her to look. Furthermore, my splash screen is great
	because I applied a black+white filter to give emphasis on 
	the title and Nyan cat. Once the player starts the game, 
	the filter is removed and color is brought to life. I also used
	the map() function to create the effect that the platforms are
	changing color. 

VIDEO
https://drive.google.com/file/d/1yknZF5FCmaD_7jc34x4gloTWmKHSWIMa/view?usp=sharing 
^ may take a long time to load?? try link below
https://www.youtube.com/watch?v=ZIuzx7NjoTI

RELEASE
I, Dena Huang, grant permission to CS 105 course staff 
to use my Final Project program and video for the purpose
of promoting CS 105.
*/

/*
Basic Concepts (5)
1. Drawing shapes and using drawing attributes
2. Conditionals
3. User-defined functions
4. Loops
5. Arrays

Extended Concepts (3+)
1. Rectangle hit test
2. Mouse + keyboard event functions
3. Loading + displaying images
4. Remapping

Other features
- pause
- play again
- high score tracker

Image Link:
https://i.pinimg.com/originals/b2/08/a8/b208a84a728c632b655ed4f35b229627.jpg
*/

let player = {
	x: 0,
	y: 0,
	w: 40,
	h: 30,
};

let platform = {
	num: 6,
	x: [0],
	y: [0],
	w: 80,
	h: 15,
	space: 100,
	move: 0,
};

let coin = {
	num: 2,
	x: [0],
	y: [0],
	size: 20,
	show: [0, 0, true, 0, 0, true],
	img: 0,
};

// game
let start = false;
let gameOver = false;
let score;
let highScore = 0;
let pause = false;

// player movement
let yVel = 0;
const gravity = 0.4;
let jumpSize = 10;

// other
let col = 0;

function preload() {
	coin.img = loadImage("coin.png");
}

function setup() {
	createCanvas(400, 600);
	colorMode(HSB);
	initialization();
}

function draw() {
	/*
	BASIC CONCEPT: CONDITIONALS
	i used conditional statements to display the various
	stages of my game. the statements check if the game has
	started, is over, or is paused. 
	*/
	if (gameOver) {
		filterBW();
		gameOverScreen();
	} else {
		if (!pause) {
			drawBg();
			drawPlatform();
			movePlayer();
			drawPlayer();
			displayScore();
		}
	}
}

function initialization() {
	score = 0;
	
	player.x = width / 2;
	player.y = height - platform.space - player.h;
	
	platform.x[0] = width / 2 - platform.w / 2;
	platform.y[0] = height - platform.space;
	
	for (let i = 1; i < platform.num; i++) {
		platform.x[i] = random(0, width - platform.w);
		platform.y[i] = height - (i + 1) * platform.space;
		
		// only initialize every third coin (out of six)
		if (i === 2 || i === 5) {
			coin.y[i] = platform.y[i] - coin.size;
		}
	}
}

function drawBg() {
	background(210, 90, 40);
	
	// move platforms based on player
	if (player.y < height / 3) {
		platform.move = 4;
	} else if (player.y < height / 2) {
		platform.move = 3;
	} else {
		platform.move = 0;
	}
}

function drawPlatform() {
	rectMode(CORNER);
	strokeWeight(1);
	stroke(100);
	
	/* 
	BASIC CONCEPT: LOOPS
	this loop repeatedly draws each platform. there is a total
	of 6 platforms displayed at a time. the loop loops through each
	platform index and draws each platform, creating the illusion
	that all the platforms are being displayed at once. the loop 
	also checks for the color that the platform should be displayed in. 
	
	BASIC CONCEPT: ARRAYS
	i have created an array for the platforms to be drawn. these 
	six arrays are used to create the illusion that there is an 
	infinite number of platforms. this is done by relocated the 
	platform once it leaves the screen (through the bottom). 
	*/
	for (let i = 0; i < platform.num; i++) {
		/*
		EXTENDED CONCEPT: REMAPPING WITH MAP()
		i use the map function to change the platform colors based
		on their y-location. this creates the illusion that the 
		platforms are changing color (which they kind of are). at 
		different positions, the platforms will change to a certain 
		color. for example, at the top, platforms will be red, and 
		near the middle, platforms will fade from green to blue. 
		*/
		// platform hue
		let hue = map(platform.y[i], 0, height, 0, 360);
		fill(hue, 100, 100);
		
		// update platform y position
		platform.y[i] += platform.move;
		
		// draw platform
		rect(platform.x[i], platform.y[i], platform.w, platform.h);
		stroke(255);
		line(platform.x[i] + 12, platform.y[i] + 7, platform.x[i] + 20, platform.y[i] + 3);
		line(platform.x[i] + 10, platform.y[i] + 12, platform.x[i] + 25, platform.y[i] + 3);
		line(platform.x[i] + 60, platform.y[i] + 12, platform.x[i] + 75, platform.y[i] + 7);
		
		// generate coin every 3 platforms
		if (i === 2 || i === 5) {
			drawCoin(i);
		}
		
		// regenerate platform at top once gone from bottom
		if (platform.y[i] >= height) {
			platform.x[i] = random(0, width - platform.w);
			platform.y[i] = -platform.h;
		}
	}
	
}

function drawCoin(i) {
	/*
	EXTENDED CONCEPT: LOADING+DISPLAYING IMAGES
	i have used an image of a coin as my scoring system.
	for each coin that the player collides with, the player
	gets a point. 
	*/
	
	// update coin x and y position
	coin.x[i] = platform.x[i] + platform.w / 2;
	coin.y[i] += platform.move;
	
	if (coin.show[i]) {
		// check collision with coin
		if (coin.x[i] + coin.size / 2 > player.x - player.w / 2 &&
				coin.x[i] - coin.size / 2 < player.x + player.w / 2 && 
				coin.y[i] + coin.size / 2 > player.y && 
				coin.y[i] + coin.size / 2 < player.y + player.h) {
			// print("COIN");
			coin.show[i] = false;
			score++;
		} else {
			// draw coin (only if player has not touched)
			// ellipse(coin.x[i], coin.y[i], coin.size);
			image(coin.img, coin.x[i] - coin.size / 2, coin.y[i], coin.size, coin.size);
		}
	}

	// regenerate coin at top once platform is gone from bottom
	if (platform.y[i] >= height) {
		coin.x[i] = random(0, width - coin.size);
		coin.y[i] = -coin.size * 2;
		coin.show[i] = true;
	}
	
}

function movePlayer() {
	// update player x as mouse position
	player.x = mouseX;
	player.x = constrain(mouseX, player.w / 2, width - player.w / 2);
	player.y = constrain(player.y, player.h / 2, height + player.h / 2);
	
	if (start) {
		for (let i = 0; i < platform.num; i++) {
			/* 
			EXTENDED CONCEPT: RECTANGLE HIT TEST
			i use a rectangle hit test to check if the player has 
			landed on the platform. this hit test checks both the 
			x-locations and y-locations of the player and platform. 
			if they have collided, then the player jumps and moves upwards,
			but if the player does, then it continues to fall. additionally,
			i have a condition that requires the y-velocity to be negative,
			meaning that the player is falling down. this ensures that
			the player does not get a "boost" every time it touches a 
			platform, but only when it is falling downwards. 
			*/
			// check collision with platform
			// yVel < 0: only allow jump when player is falling down
			if (player.x + player.w / 2 > platform.x[i] && 
					player.x - player.w / 2 < platform.x[i] + platform.w && 
					player.y + player.h / 2 > platform.y[i] &&
					player.y - player.h / 2 < platform.y[i] &&
					yVel < 0) {
				yVel = jumpSize;
			}
		}
		
		yVel -= gravity;
		player.y -= yVel;

	} else {
		// display start screen
		filterBW();
		splashScreen();
	}
	
	// if player falls out of bottom boundary, game ends
	if (player.y - player.h >= height) {
		gameOver = true;
		start = false;
	}
}

function drawPlayer() {
	/*
	BASIC CONCEPT: DRAWING SHAPES + USING ATTRIBUTES
	all the code in this function draws the character, Nyan cat. 
	I used different colors and shapes to produce a cute character. 
	*/
	
	// player attributes
	rectMode(CENTER);
	noStroke();
	// fill(0, 0, 255);
	
	// legs + tail
	fill(0, 3, 54);
	ellipse(player.x - 15, player.y + player.h / 2, 4, 10);
	ellipse(player.x - 10, player.y + player.h / 2, 4, 10);
	ellipse(player.x + 10, player.y + player.h / 2, 4, 10);
	ellipse(player.x + 15, player.y + player.h / 2, 4, 10);
	ellipse(player.x - player.w / 2, player.y + 5, 20, 5);
	
	// body
	fill(36, 48, 100);
	rect(player.x, player.y, player.w, player.h);
	fill(306, 46, 100);
	ellipse(player.x, player.y, player.w - 5, player.h - 5);
	fill(322, 100, 100);
	ellipse(player.x - 13, player.y, 3);
	ellipse(player.x - 7, player.y + 3, 3);
	ellipse(player.x - 5, player.y - 5, 3);
	ellipse(player.x - 3, player.y + 7, 3);
	ellipse(player.x - 1, player.y, 3);
	ellipse(player.x + 9, player.y - 7, 3);
	
	// head
	fill(0, 3, 54);
	ellipse(player.x + player.w / 3, player.y + player.h / 5, 30, 20);
	triangle(player.x + player.w / 3, player.y, player.x + player.w / 3 - 12, player.y + 10, player.x + player.w / 3 - 15, player.y - 10);
	triangle(player.x + player.w / 3, player.y, player.x + player.w / 3 + 12, player.y + 10, player.x + player.w / 3 + 15, player.y - 10);
	
	// eyes
	fill(0);
	ellipse(player.x + player.w / 3 - 5, player.y + player.h / 5 - 2, 5);
	ellipse(player.x + player.w / 3 + 5, player.y + player.h / 5 - 2, 5);
	fill(100);
	ellipse(player.x + player.w / 3 - 6, player.y + player.h / 5 - 3, 3);
	ellipse(player.x + player.w / 3 + 4, player.y + player.h / 5 - 3, 3);
	
	// blush
	fill(2, 43, 98);
	ellipse(player.x + player.w / 3 - 8, player.y + player.h / 5 + 2, 5, 3);
	ellipse(player.x + player.w / 3 + 8, player.y + player.h / 5 + 2, 5, 3);
	
	// mouth
	noFill();
	stroke(0);
	strokeWeight(0.5);
	arc(player.x + player.w / 3 - 2, player.y + player.h / 5 + 3, 4, 4, 0, PI);
	arc(player.x + player.w / 3 + 2, player.y + player.h / 5 + 3, 4, 4, 0, PI);
}

function displayScore() {
	// display score
	fill(100);
	text("Score: " + score, width / 2, 30);
}

function splashScreen() {
	// rainbow stripe
	let c = 0;
	while (c < width) {
		let hue = map(c, 0, width, 0, 360);
		stroke(hue, 100, 100);
		line(c, height / 2 - 50, c, height / 2 + 50);
		c++;
	}
	
	stroke(100);
	line(0, height / 2 - 50 , width, height / 2 - 50);
	line(0, height / 2 + 50 , width, height / 2 + 50);
	
	// display text
	textAlign(CENTER);
	fill(100);
	strokeWeight(3);
	stroke(0);
	textSize(50);
	text("NYAN JUMP", width / 2, height / 2);
	textSize(20);
	text("click to start!", width / 2, height / 2 + 30);
}

function filterBW() {
	filter(GRAY);
}

/*
BASIC CONCEPT: USER-DEFINED FUNCTIONS
this is one of my many user-defined functions. this function
in particular, gameOverScreen(), is called when the player
has "died" and the game is over. this function displays text
that tells the player that the game is over and shows a high
score, along with a prompt to play again.
*/
function gameOverScreen() {
	// calculate high score
	if (score > highScore) {
		highScore = score;
	}
	
	// display text
	fill(col, 100, 100);
	stroke(100);
	strokeWeight(2);
	textSize(30);
	
	text("GAME OVER", width / 2, height / 2);
	text("click to play again!", width / 2, height / 2 + 50);
	text("HIGH SCORE: " + highScore, width / 2, height - 50);
	
	col++;
	
	if (col > 360) {
		col = 0;
	}
}

/*
EXTENDED CONCEPT: MOUSE/KEYBOARD EVENT FUNCTIONS
i have used a mouse event function that allows the player
to start the game by clicking the mouse. additionally, i
have also implemented a "pause" feature that allows the 
player to pause the game by clicking the "P" key. 
*/
function mousePressed() {
	if (!start && gameOver) {
		gameOver = false;
		initialization();
	} else if (gameOver) {
		gameOver = false;
	} else if (!start) {
		start = true;
	}
}

function keyPressed() {
	if (key === "p" || key === "P") {
		pause = !pause;
	}
}