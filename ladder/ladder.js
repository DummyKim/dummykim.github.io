const countCon = document.querySelector(".ladder-count-con");
const minusBtn = document.querySelector(".ladder-minus-btn");
const plusBtn = document.querySelector(".ladder-plus-btn");
const ladderCount = document.querySelector(".ladder-ladder-count");
const startBtn = document.querySelector(".ladder-start-btn");
const canvas = document.querySelector("#ladder-canvas");
const ctx = canvas.getContext("2d");
const gap = 100;
const drawCon = document.querySelector(".ladder-draw-con");
const functionBtn = document.querySelector(".ladder-function-btn");
const topCon = drawCon.querySelector(".ladder-top-con");
const botCon = drawCon.querySelector(".ladder-bot-con");
const nextCon = document.querySelector(".ladder-next-btn");
const resultBtn = document.querySelector(".ladder-result-btn");
const resetBtn = document.querySelector(".ladder-reset-btn");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let count = 2;
let users;
let cases;
let y = 10;
let isReady = false;
let horizontalLines = [];
let animationFrameId;

const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta', 'yellow']; // 각 사용자에 대한 색상 배열

ladderCount.textContent = count;

minusBtn.addEventListener("click", function() {
  if (count > 2) count--;
  else alert("최소 2개 이상 가능");
  ladderCount.textContent = count;
});

plusBtn.addEventListener("click", function() {
  if (count < 10) count++;
  else alert("최대 10개 까지 가능");
  ladderCount.textContent = count;
});

startBtn.addEventListener("click", function() {
  drawCon.classList.remove("ladder-con-dis");
  functionBtn.classList.remove("ladder-con-dis");
  countCon.classList.add("ladder-con-dis");
  startPoint = (canvasWidth - (count - 1) * gap) / 2;
  topCon.innerHTML = '';
  botCon.innerHTML = '';
  canvas.height = window.innerHeight * 0.5; // canvas 높이 조정
  canvasHeight = canvas.height;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 캔버스 초기화
  horizontalLines = Array(count - 1).fill().map(() => []);
  for (let i = 0; i < count; i++) {
    const userDiv = document.createElement("div");
    userDiv.style.display = "flex";
    userDiv.style.flexDirection = "column";
    userDiv.style.alignItems = "center";

    const startButton = document.createElement("button");
    startButton.textContent = "결과 보기";
    startButton.classList.add("ladder-start-user-btn");
    startButton.dataset.index = i;
    userDiv.appendChild(startButton);

    const userInput = document.createElement("input");
    userInput.setAttribute("type", "text");
    userInput.classList.add("ladder-text-top");
    userInput.value = `참가자${i + 1}`;  // 기본값 설정
    userInput.addEventListener("focus", function() {
      if (userInput.value === `참가자${i + 1}`) {
        userInput.value = "";
        userInput.style.color = "black";
      }
    });
    userInput.addEventListener("blur", function() {
      if (userInput.value === "") {
        userInput.value = `참가자${i + 1}`;
        userInput.style.color = "lightgray";
      }
    });
    userInput.style.color = "lightgray";
    userDiv.appendChild(userInput);

    topCon.appendChild(userDiv);

    const caseInput = document.createElement("input");
    caseInput.setAttribute("type", "text");
    caseInput.classList.add("ladder-text-bot");
    caseInput.value = `결과${i + 1}`;  // 기본값 설정
    caseInput.addEventListener("focus", function() {
      if (caseInput.value === `결과${i + 1}`) {
        caseInput.value = "";
        caseInput.style.color = "black";
      }
    });
    caseInput.addEventListener("blur", function() {
      if (caseInput.value === "") {
        caseInput.value = `결과${i + 1}`;
        caseInput.style.color = "lightgray";
      }
    });
    caseInput.style.color = "lightgray";
    botCon.appendChild(caseInput);

    ctx.beginPath();
    ctx.moveTo(startPoint + gap * i, 0);
    ctx.lineTo(startPoint + gap * i, canvasHeight);
    ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.closePath();
  }
  users = document.querySelectorAll(".ladder-text-top");
  cases = document.querySelectorAll(".ladder-text-bot");

  document.querySelectorAll('.ladder-start-user-btn').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      animateUserResult(index);
    });
  });
});

nextCon.addEventListener("click", function() {
  for (let i = 0; i < users.length; i++) {
    if (users[i].value === "" || cases[i].value === "") {
      alert("빈칸을 기입해주세요");
      return;
    }
  }
  nextCon.disabled = true;
  y = 10; // y 값을 초기화
  leg();
});

resultBtn.addEventListener("click", function() {
  if (isReady) {
    users.forEach((user, index) => {
      drawUserResult(index);
    });
  }
});

resetBtn.addEventListener("click", function() {
  drawCon.classList.add("ladder-con-dis");
  functionBtn.classList.add("ladder-con-dis");
  countCon.classList.remove("ladder-con-dis");
  nextCon.disabled = false;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ladderCount.textContent = count;
  horizontalLines = [];
  isReady = false;
  y = 10; // y 값을 초기화
});

function leg() {
  y += 10;
  for (let i = 0; i < count - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(startPoint + gap * i, y);
    if (Math.random() * 100 > 80) {
      ctx.lineTo(startPoint + gap * i + 100, y);
      horizontalLines[i].push(y); // 가로줄 위치 저장
      i++;
    }
    ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
    ctx.stroke();
  }
  animationFrameId = requestAnimationFrame(leg);
  if (y > canvasHeight - 30) {
    isReady = true;
    ctx.closePath();
    cancelAnimationFrame(animationFrameId);
  }
}

function animateUserResult(index) {
  if (!isReady) return;
  let xPos = index;
  let yPos = 0;
  const userColor = colors[index % colors.length]; // 사용자별 색상 지정

  function animate() {
    if (yPos >= canvasHeight) {
      ctx.closePath();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(startPoint + gap * xPos, 0);
    let y = 0;
    let currentX = xPos;

    while (y <= yPos) {
      if (currentX > 0 && horizontalLines[currentX - 1].includes(y)) {
        ctx.lineTo(startPoint + gap * (currentX - 1), y);
        currentX--;
      } else if (currentX < count - 1 && horizontalLines[currentX].includes(y)) {
        ctx.lineTo(startPoint + gap * (currentX + 1), y);
        currentX++;
      }
      y += 10;
      ctx.lineTo(startPoint + gap * currentX, y);
    }

    ctx.strokeStyle = userColor; // 각 사용자별 색상으로 경로 표시
    ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
    ctx.stroke();
    ctx.closePath();
    yPos += 10;
    requestAnimationFrame(animate);
  }
  animate();
}

function drawUserResult(index) {
  if (!isReady) return;
  let xPos = index;
  let yPos = 0;
  const userColor = colors[index % colors.length]; // 사용자별 색상 지정

  ctx.beginPath();
  ctx.moveTo(startPoint + gap * xPos, yPos);

  while (yPos < canvasHeight) {
    if (xPos > 0 && horizontalLines[xPos - 1].includes(yPos)) {
      ctx.lineTo(startPoint + gap * (xPos - 1), yPos);
      xPos--;
    } else if (xPos < count - 1 && horizontalLines[xPos].includes(yPos)) {
      ctx.lineTo(startPoint + gap * (xPos + 1), yPos);
      xPos++;
    }
    yPos += 10;
    ctx.lineTo(startPoint + gap * xPos, yPos);
  }

  ctx.strokeStyle = userColor; // 각 사용자별 색상으로 경로 표시
  ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
  ctx.stroke();
  ctx.closePath();
}

function drawLadder() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.moveTo(startPoint + gap * i, 0);
    ctx.lineTo(startPoint + gap * i, canvasHeight);
    ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.closePath();
  }
  horizontalLines.forEach((lines, index) => {
    lines.forEach(y => {
      ctx.beginPath();
      ctx.moveTo(startPoint + gap * index, y);
      ctx.lineTo(startPoint + gap * index + gap, y);
      ctx.lineWidth = 4; // 선의 두께를 두 배로 증가
      ctx.stroke();
    });
  });
}
