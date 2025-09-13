const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Paddle objects
let leftPaddle = {
  x: 20,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

let rightPaddle = {
  x: WIDTH - 20 - PADDLE_WIDTH,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

// Ball object
let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  dx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
  dy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Mouse tracking for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2; 
  // Clamp within bounds
  leftPaddle.y = Math.max(0, Math.min(HEIGHT - leftPaddle.height, leftPaddle.y));
});

// Draw paddles and ball
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(ball) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, 0, Math.PI*2);
  ctx.fill();
}

// Simple AI for right paddle
function moveRightPaddle() {
  // Move toward the ball's y position
  let target = ball.y + ball.size/2 - rightPaddle.height/2;
  if (rightPaddle.y < target) {
    rightPaddle.y += PADDLE_SPEED;
  } else if (rightPaddle.y > target) {
    rightPaddle.y -= PADDLE_SPEED;
  }
  // Clamp
  rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

// Collision detection
function isColliding(paddle, ball) {
  return ball.x < paddle.x + paddle.width &&
         ball.x + ball.size > paddle.x &&
         ball.y < paddle.y + paddle.height &&
         ball.y + ball.size > paddle.y;
}

// Main game loop
function update() {
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (top/bottom)
  if (ball.y <= 0) {
    ball.y = 0;
    ball.dy *= -1;
  }
  if (ball.y + ball.size >= HEIGHT) {
    ball.y = HEIGHT - ball.size;
    ball.dy *= -1;
  }

  // Paddle collision
  if (isColliding(leftPaddle, ball)) {
    ball.x = leftPaddle.x + leftPaddle.width;
    ball.dx *= -1;
    // Add some randomness to ball's dy
    ball.dy += (Math.random() - 0.5) * 2;
  }
  if (isColliding(rightPaddle, ball)) {
    ball.x = rightPaddle.x - ball.size;
    ball.dx *= -1;
    ball.dy += (Math.random() - 0.5) * 2;
  }

  // Score check (reset ball if it goes past paddles)
  if (ball.x < 0 || ball.x > WIDTH) {
    // Reset ball to center
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    // Randomize direction
    ball.dx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
  }

  moveRightPaddle();
}

// Render everything
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw center line
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles and ball
  drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#ff5e5e');
  drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#5ecfff');
  drawBall(ball);
}

// Game loop
function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();
