var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasWidth = canvas.width; // Use the new canvas width
var canvasHeight = canvas.height; // Use the new canvas height

var catImage = new Image();
catImage.src = 'cat_red.png'; // Replace with 'cat_red.png' or 'cat_blue.png' for the left image
var catWidth = 120; // Adjust the desired width for the cat images
var catHeight = 200; // Maintain the height ratio as the original (200)

var bluePillImg = new Image();
bluePillImg.src = 'blue_pill.png';
var redPillImg = new Image();
redPillImg.src = 'red_pill.png';

var dangerImg = new Image();
dangerImg.src = 'danger.png'; // Danger image

// Define the size of the smaller danger image while maintaining the aspect ratio
var dangerWidth = 60; // Adjust the desired width for the danger image
var dangerHeight = (60 / dangerImg.width) * dangerImg.height;

var scaledPillWidth = 20; // Adjust the desired width for the pill images
var scaledPillHeight = 20 * 200 / 60; // Make the height range narrower (adjust the denominator)

var obstacles = [];
var score = 0;
var consecutiveFails = 0; // To track consecutive fails

var currentPill = 'blue';

var obstacleSpeed = 2; // Initial speed
var obstacleWidth = scaledPillWidth;
var obstacleHeight = scaledPillHeight;

var spacebarPressed = false;

var nextSpeedThreshold = 10; // The next score threshold to increase the speed
var speedIncreased = false; // Variable to track if the speed has already been increased

var dangerDisplayTime = 3000; // Time to display 'danger.png' in milliseconds
var dangerVisible = false; // To track if 'danger.png' is currently visible

function drawPill(x, y) {
    var pillImage = currentPill === 'blue' ? bluePillImg : redPillImg;

    // Clear the area where the cat image will be drawn
    ctx.clearRect(50, canvasHeight / 2 - 100, catWidth, catHeight);

    // Adjust the coordinates to move the cat image to the left and above
    var catX = 20; // Move the cat image 20 pixels to the left
    var catY = canvasHeight / 2 - 130 + 30; // Move the cat image 30 pixels above and 30 pixels lower

    ctx.drawImage(pillImage, x, y + 30, scaledPillWidth, scaledPillHeight); // Move the pill image 30 pixels lower
    ctx.drawImage(catImage, catX, catY, catWidth, catHeight); // Draw the cat image after the pill image
}

function drawObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        var obstacleImage = obstacles[i].color === 'blue' ? bluePillImg : redPillImg;
        ctx.drawImage(obstacleImage, obstacles[i].x, obstacles[i].y + 30, scaledPillWidth, scaledPillHeight); // Move the obstacles 30 pixels lower
    }
}

function drawDangerImage() {
    if (dangerVisible) {
        // Adjust the coordinates to place the smaller danger image below the canvas
        var dangerX = (canvasWidth - dangerWidth) / 2;
        var dangerY = canvasHeight;

        ctx.drawImage(dangerImg, dangerX, dangerY, dangerWidth, dangerHeight);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function moveObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
    }
}

function spawnObstacle() {
    var color = Math.random() < 0.5 ? 'blue' : 'red';
    var x = canvasWidth;
    var minY = 100; // Minimum Y position
    var maxY = canvasHeight - scaledPillHeight - 150; // Maximum Y position (adjust the 150 to make the height range narrower)
    var y = Math.random() * (maxY - minY) + minY; // Random Y position between minY and maxY
    obstacles.push({ x: x, y: y, color: color });
}

function updateScore(match) {
    if (match) {
        score += 1;
        consecutiveFails = 0; // Reset consecutive fails counter
        if (score === nextSpeedThreshold && !speedIncreased) {
            // Increase the speed when the player's score reaches the next threshold and speed is not already increased
            obstacleSpeed += 0.5; // Adjust the speed increment as desired
            nextSpeedThreshold += 10; // Set the next speed threshold for the next speed increase
            speedIncreased = true; // Mark that the speed has been increased
        }
        if (score % 10 === 0) {
            speedIncreased = false; // Reset the speed increase flag when the score is a multiple of 10
        }
    } else {
        consecutiveFails += 1;
        if (consecutiveFails >= 5) {
            showDangerImage();
        }
        if (score > 0) {
            score -= 1;
        }
    }
}

function showDangerImage() {
    dangerVisible = true;
    setTimeout(function () {
        dangerVisible = false;
    }, dangerDisplayTime);
}

function frame() {
    requestAnimationFrame(frame);

    ctx.fillStyle = 'lightgray'; // Set the background color to light gray
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Fill the entire canvas with the background color

    clearCanvas();

    drawPill(50, canvasHeight / 2 - 100);
    drawObstacles();
    drawDangerImage(); // Draw the danger image if visible

    moveObstacles();

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvasWidth - 100) {
        spawnObstacle();
    }

    for (var i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x < -obstacleWidth) {
            obstacles.shift();
        }
    }

    for (var i = 0; i < obstacles.length; i++) {
        var playerX = 50;
        var playerY = canvasHeight / 2 - 100;
        var playerColor = currentPill;

        var obstacleX = obstacles[i].x;
        var obstacleY = obstacles[i].y;
        var obstacleColor = obstacles[i].color;

        if (
            playerX < obstacleX + obstacleWidth &&
            playerX + scaledPillWidth > obstacleX &&
            playerY < obstacleY + obstacleHeight &&
            playerY + scaledPillHeight > obstacleY
        ) {
            if (playerColor === obstacleColor) {
                updateScore(true);
            } else {
                updateScore(false);
            }

            obstacles.splice(i, 1);
            i--;
        }
    }

    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);
}

frame();

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !spacebarPressed) {
        spacebarPressed = true;
        currentPill = currentPill === 'blue' ? 'red' : 'blue';
        catImage.src = currentPill === 'blue' ? 'cat_blue.png' : 'cat_red.png';
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'Space') {
        spacebarPressed = false;
    }
});
