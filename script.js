/* ======================= BREAKOUT GAME ======================= */
const canvas = document.getElementById("breakoutCanvas");
const startBtn = document.getElementById("startGameBtn");

if (canvas && startBtn) {
  const ctx = canvas.getContext("2d");

  // Ukuran canvas lebih kecil
  canvas.width = 360;
  canvas.height = 240;

  let gameStarted = false;

  // Ball
  let x, y, dx, dy;
  const ballRadius = 6; // lebih kecil supaya proporsional

  // Paddle
  const paddleHeight = 8;
  const paddleWidth = 60;
  let paddleX;
  let rightPressed = false;
  let leftPressed = false;

  /* =================== TOUCH CONTROL =================== */
  canvas.addEventListener("touchstart", handleTouch, { passive: false });
  canvas.addEventListener("touchmove", handleTouch, { passive: false });

  function handleTouch(e) {
    e.preventDefault(); // cegah scroll
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    paddleX = touchX - paddleWidth / 2;

    // Pastikan paddle tetap di dalam canvas
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
  }
  /* ===================================================== */

  /* ========== BRICK SETTINGS ========== */
  const brickRowCount = 4;
  const brickColumnCount = 6;
  const brickWidth = 45; // proporsional dengan canvas
  const brickHeight = 15;
  const brickPadding = 8;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 15;

  let bricks = [];
  let bricksBroken = 0;
  const totalBricks = brickRowCount * brickColumnCount;

  /* ========== RESET GAME FUNCTION ========== */
  function resetGame() {
    // Reset bola
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 1.5;
    dy = -1.5;

    // Reset paddle
    paddleX = (canvas.width - paddleWidth) / 2;

    // Reset bricks
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    bricksBroken = 0;
  }

  // Panggil reset saat pertama load
  resetGame();

  /* ========== DRAW BRICKS ========== */
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#00eaff";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  /* ========== COLLISION DETECTION + WIN CHECK ========== */
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          bricksBroken++;

          if (bricksBroken === totalBricks) {
            gameStarted = false;
            setTimeout(() => {
              alert("🎉 Kamu Menang! Tekan START untuk main lagi.");
              resetGame();
            }, 100);
          }
        }
      }
    }
  }

  /* ========== DRAW BALL ========== */
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00FFFF";
    ctx.fill();
    ctx.closePath();
  }

  /* ========== DRAW PADDLE ========== */
  function drawPaddle() {
    ctx.fillStyle = "#FFA500";
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
  }

  /* ========== HANDLE KEYBOARD ========== */
  function keyDownHandler(e) {
    if (e.key === "ArrowRight") {
      rightPressed = true;
      e.preventDefault(); // cegah scroll kanan
    } else if (e.key === "ArrowLeft") {
      leftPressed = true;
      e.preventDefault(); // cegah scroll kiri
    }
  }

  function keyUpHandler(e) {
    if (e.key === "ArrowRight") {
      rightPressed = false;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      leftPressed = false;
      e.preventDefault();
    }
  }

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  /* ========== START GAME ========== */
  startBtn.addEventListener("click", () => {
    if (!gameStarted) {
      gameStarted = true;
      draw();
    }
  });

  /* ========== DRAW GAME LOOP ========== */
  function draw() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Bounce bola
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius - paddleHeight) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        gameStarted = false;
        setTimeout(() => {
          alert("💀 Game Over! Tekan START untuk main lagi.");
          resetGame();
        }, 50);
      }
    }

    // Gerak paddle dengan batas canvas (keyboard)
    if (rightPressed && paddleX + paddleWidth < canvas.width) paddleX += 4;
    if (leftPressed && paddleX > 0) paddleX -= 4;

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }
}
