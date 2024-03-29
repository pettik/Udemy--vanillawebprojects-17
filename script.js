const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas');
const pressSpace = document.querySelector('.press-space')
const ctx = canvas.getContext('2d');

let score = 0;
let isBallMoving = true; // Add a flag to control ball movement

const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
   x: canvas.width / 2,
   y: canvas.height / 2,
   size: 10,
   speed: 4,
   dx: 4,
   dy: -4,
};

// Draw ball on canvas
function drawBall() {
   ctx.beginPath();
   ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
   ctx.fillStyle = '#0095dd';
   ctx.fill();
   ctx.closePath();
}

// Create paddle props
const paddle = {
   x: canvas.width / 2 - 40,
   y: canvas.height - 20,
   w: 80,
   h: 10,
   speed: 8,
   dx: 0,
};

// Create brick props
const brickInfo = {
   w: 70,
   h: 20,
   padding: 10,
   offsetX: 45,
   offsetY: 60,
   visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
   bricks[i] = [];
   for (let j = 0; j < brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetX;
      bricks[i][j] = {
         x,
         y,
         ...brickInfo,
      };
   }
}

// Draw paddle on canvas
function drawPaddle() {
   ctx.beginPath();
   ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
   ctx.fillStyle = '#0095dd';
   ctx.fill();
   ctx.closePath();
}

// Draw score on cavas
function drawScore() {
   ctx.font = '20px Verdana';
   ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
   bricks.forEach(column => {
      column.forEach(brick => {
         ctx.beginPath();
         ctx.rect(brick.x, brick.y, brick.w, brick.h);
         ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
         ctx.fill();
         ctx.closePath();
      });
   });
}

// Move paddle on canvas
function movePaddle() {
   paddle.x += paddle.dx;

   // Wall detection
   if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
   }

   if (paddle.x < 0) {
      paddle.x = 0;
   }
}

// Draw everthing
function draw() {
   // clear canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   drawBall();
   drawPaddle();
   drawScore();
   drawBricks();
   moveBall();
}

// Move ball on canvas
// Move ball on canvas
function moveBall() {
   if (!isBallMoving) return; // Check if the ball is paused

   ball.x += ball.dx;
   ball.y += ball.dy;


   // Wall collisin (x)
   if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1;
   }

   // Wall collisin (y)
   if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
   }

   // Paddle collision
   if (
      ball.x - ball.size > paddle.x &&
      ball.x + ball.size < paddle.x + paddle.w &&
      ball.y + ball.size > paddle.y
   ) {
      ball.dy = -ball.speed;
   }

   // Brick collision
   bricks.forEach(column => {
      column.forEach(brick => {
         if (brick.visible) {
            if (
               ball.x - ball.size > brick.x && // left brick side check
               ball.x + ball.size < brick.x + brick.w && // right brick side check
               ball.y + ball.size > brick.y && // top brick side check
               ball.y - ball.size < brick.y + brick.h // bottom brick side check
            ) {
               ball.dy *= -1;
               brick.visible = false;
               increaseScore();
            }
         }
      });
   });

   // Reset ball position
   function resetBallPosition() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - (70);

   }


   // Hit bottom wall = lose
   if (ball.y + ball.size > canvas.height) {
      showAllBricks();
      score = 0;
      resetBallPosition(); // Reset ball position
      isBallMoving = false; // Pause the ball
      pressSpace.classList.add('show');
   }

}

// Increase score
function increaseScore() {
   score++;

   if (score % (brickRowCount * brickRowCount) === 0) {
      showAllBricks();
   }
}

// Make all bricks appear
function showAllBricks() {
   bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true));
   });
}

// Update canvas drawing and animation
function update() {
   movePaddle();
   // Draw everything
   draw();
   requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
   if (e.key === 'Right' || e.key === 'ArrowRight') {
      paddle.dx = paddle.speed;
   } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      paddle.dx = -paddle.speed;
   }
}

function keyUp(e) {
   if (
      e.key === 'Right' ||
      e.key === 'RightArrow' ||
      e.key === 'Left' ||
      e.key === 'ArrowLeft'
   ) {
      paddle.dx = 0;
   }

   if (e.code === 'Space') {
      isBallMoving = true;
      pressSpace.classList.remove('show');
   }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


// Rules and close event handlers
rulesBtn.addEventListener('click', () => {
   rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
   rules.classList.remove('show');
});


// // Event listener for 'backspace' key to start moving ball again
// document.addEventListener('keydown', function (e) {
//   if (e.key === 'Backspace') {
//     isBallMoving = true;
//   }
// });
