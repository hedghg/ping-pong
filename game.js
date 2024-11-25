const canvas = document.getElementById('pongTable');
const context = canvas.getContext('2d');

let playerScore = 0;
let aiScore = 0;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    acceleration: 0.2
};

const player = {
    x: (canvas.width - 100) / 2,
    y: canvas.height - 10,
    width: 100,
    height: 10,
    color: '#fff',
    score: 0
};

const ai = {
    x: (canvas.width - 100) / 2,
    y: 0,
    width: 100,
    height: 10,
    color: '#fff',
    score: 0
};

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px Arial";
    context.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(player.score, canvas.width / 2, canvas.height / 4, "#fff");
    drawText(ai.score, canvas.width / 2, 3 * canvas.height / 4, "#fff");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.radius, "#fff");
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let aiLevel = 0.1;
    let mistakeProbability = Math.random();

    if (mistakeProbability > 0.123) { 
        ai.x += (ball.x - (ai.x + ai.width / 2)) * aiLevel;
    }

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
    }

    let playerPosition = (ball.y < canvas.height / 2) ? ai : player;

    if (collision(ball, playerPosition)) {
        let collidePoint = ball.x - (playerPosition.x + playerPosition.width / 2);
        collidePoint = collidePoint / (playerPosition.width / 2);
        
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.y < canvas.height / 2) ? 1 : -1;

        ball.speed += ball.acceleration;

        ball.velocityY = direction * ball.speed * Math.cos(angleRad);
        ball.velocityX = ball.speed * Math.sin(angleRad);
    }

    if (ball.y - ball.radius < 0) {
        player.score++;
        resetBall();
    } else if (ball.y + ball.radius > canvas.height) {
        ai.score++;
        resetBall();
    }
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityY = -ball.velocityY;
    ball.speed = 5;
}

function game() {
    update();
    render();
}

const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);

canvas.addEventListener('mousemove', evt => {
    let rect = canvas.getBoundingClientRect();
    player.x = evt.clientX - rect.left - player.width / 2;
});
