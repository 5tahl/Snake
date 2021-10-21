const container = document.querySelector(".container");
const btn = document.querySelector(".btn");
const timeEl = document.querySelector(".time");
const loserScreenEl = document.querySelector(".loserScreen");
const loserScore = document.querySelector(".loserScore");

let snakeBodyArr = [];
let foodLocation = [];
let lastSnakePartLocation = [];
let direction = "ArrowDown";
let previousDirection;
let timerVar;
let clock = 0;
let color = "1, 54, 8";

// IIFE that changes the background color of the button.
// With a global variable.
(function () {
  btn.style.cssText = `background-color: rgb(${color});`;
})();

// Makes a part of the snake and adds its location to an array, r is row and c is column.
const addBody = (r, c) => {
  let snake = document.createElement("div");
  snake.classList.add("snakePart");
  snake.style = `grid-column: ${c} / ${c + 1}; grid-row: ${r} / ${r + 1};`;
  container.append(snake);
  snakeBodyArr.unshift({ row: r, col: c });
};

// Same as addBody but it prepends the new body part.
const addBodyFromFood = (r, c) => {
  let snake = document.createElement("div");
  snake.classList.add("snakePart");
  snake.style = `grid-column: ${c} / ${c + 1}; grid-row: ${r} / ${r + 1};`;
  container.prepend(snake);
  snakeBodyArr.push({ row: r, col: c });
};

// Removes the last part of the snake and adds the location to an array.
const removeBody = () => {
  document.querySelector(".snakePart").remove();
  lastSnakePartLocation = snakeBodyArr.pop();
};

// Creates the snake food in a random grid location.
const createSnakeFood = () => {
  let num1 = Math.floor(Math.random() * 25) + 1;
  let num2 = Math.floor(Math.random() * 25) + 1;

  let food = document.createElement("div");
  food.classList.add("snakeFood");
  food.style = `grid-column: ${num1} / ${num1 + 1}; grid-row: ${num2} / ${
    num2 + 1
  };`;
  container.append(food);

  foodLocation = [{ row: num2, col: num1 }];
};
// Removes the food element.
const removeFood = () => {
  document.querySelector(".snakeFood").remove();
};

// Function that moves the snake and stops it from going
// the same direction that the body is in.
const moveSnake = () => {
  if ((direction === "ArrowRight") && (previousDirection != "ArrowLeft")) {
	previousDirection = direction;
    addBody(snakeBodyArr[0].row, snakeBodyArr[0].col + 1);
    removeBody();
  } else if ((direction === "ArrowDown") && (previousDirection != "ArrowUp")) {
	previousDirection = direction;
    addBody(snakeBodyArr[0].row + 1, snakeBodyArr[0].col);
    removeBody();
  } else if ((direction === "ArrowLeft") && (previousDirection != "ArrowRight")) {
	previousDirection = direction;
    addBody(snakeBodyArr[0].row, snakeBodyArr[0].col - 1);
    removeBody();
  } else if ((direction === "ArrowUp") && (previousDirection != "ArrowDown")) {
	previousDirection = direction;
    addBody(snakeBodyArr[0].row - 1, snakeBodyArr[0].col);
    removeBody();
  } else if (previousDirection === "ArrowLeft") {
	direction = previousDirection;
    addBody(snakeBodyArr[0].row, snakeBodyArr[0].col - 1);
	removeBody();
  } else if (previousDirection === "ArrowUp") {
	direction = previousDirection;
    addBody(snakeBodyArr[0].row - 1, snakeBodyArr[0].col);
    removeBody();
  } else if (previousDirection === "ArrowRight") {
	direction = previousDirection;
    addBody(snakeBodyArr[0].row, snakeBodyArr[0].col + 1);
    removeBody();
  } else if (previousDirection === "ArrowDown") {
	direction = previousDirection;
    addBody(snakeBodyArr[0].row + 1, snakeBodyArr[0].col);
    removeBody();
  }

  snakeCrashed();
  foodEaten();
};

//	Function that checks if the snake has eaten the food,
//	if so call the createSnakeFood and addBodyFromFood function.
const foodEaten = () => {
  if (
    snakeBodyArr[0].row === foodLocation[0].row &&
    snakeBodyArr[0].col === foodLocation[0].col
  ) {
    removeFood();
    createSnakeFood();

    addBodyFromFood(lastSnakePartLocation.row, lastSnakePartLocation.col);
  }
};

// My own custom event.
const time = () => {
  let event = new CustomEvent("time");
  clock++;

  container.dispatchEvent(event);
  timeEl.dispatchEvent(event);
};

// A timer that will run until stopTimer is called.
const timer = () => {
  timerVar = setTimeout(timer, 100);
  time();
};

// Stops timer.
const stopTimer = () => {
  clearTimeout(timerVar);
};

//	When you press the button it creates a snake and some snake food.
btn.addEventListener("click", () => {
  btn.remove();
  addBody(12, 13);
  addBodyFromFood(11, 13);
  addBodyFromFood(10, 13);
  createSnakeFood();
  timer();
});

//	Check what key was pressed.
document.addEventListener("keydown", (e) => {
  direction = e.key;
});
// Every time "time" is called it moves the snake.
container.addEventListener("time", () => {
  moveSnake();
});
// Every time "time" is called it prints out the time.
timeEl.addEventListener("time", () => {
  timeEl.textContent = clock / 10;
});

// Checks if snake is same position as the rest of the snake or outside of the grid,
// if so remove "hide" class from loserScreen and add the score.
const snakeCrashed = () => {
  let newSnakeBodyArr = snakeBodyArr.map((x) => x);
  let snakeHead = newSnakeBodyArr.shift();

  newSnakeBodyArr.forEach((part) => {
    if (snakeHead.row === part.row && snakeHead.col === part.col) {
      stopTimer();
      loserScreenEl.classList.remove("hide");

      let score = snakeBodyArr.length * 5;
      loserScore.textContent = `Score: ${score}`;

      loserScreenEl.addEventListener("click", () => {
        location.reload();
      });
    } else if (
      snakeHead.col > 25 ||
      snakeHead.col < 1 ||
      snakeHead.row > 25 ||
      snakeHead.row < 1
    ) {
      stopTimer();
      loserScreenEl.classList.remove("hide");

      let score = snakeBodyArr.length * 5;
      loserScore.textContent = `Score: ${score}`;

      loserScreenEl.addEventListener("click", () => {
        location.reload();
      });
    }
  });
};
