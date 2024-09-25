function make2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) { 
    arr[i] = new Array(cols);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
  return arr
}

let grid;
let nextGrid;
let boxSize = 10;
let rows;
let cols;
let startSim = false;
let HEIGHT = 650;
let WIDTH = 600;

let start;
let stop;

function preload() {
  startImage = loadImage("images/startImage.png");
  stopImage = loadImage("images/stop.png");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  rows = width / boxSize;
  cols = (height - 50) / boxSize;
  
  grid = make2DArray(rows, cols);
  
  start = startImage;
  stop = stopImage;

  
  // grid[0][1] = 1;
  // grid[1][0] = 1;
  // grid[1][2] = 1;
  // grid[2][1] = 1;
  // grid[2][2] = 1;
  // grid[4][4] = 1;
  // grid[4][5] = 1;
  // grid[5][4] = 1;
  // grid[5][5] = 1;
}

function draw() {
  
  background(30, 41, 59);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = i * boxSize;
      let y = j * boxSize;
      if (grid[i][j] == 0) {
        fill(30, 41, 59);
      } else {
        fill(0, 227, 26);
      }

      square(x,y, boxSize);
    }
  }  
  let mouseRow = floor(mouseX / boxSize);
  let mouseCol = floor(mouseY / boxSize);

  if (startSim) {
    frameRate(60);
    image(start, 0, HEIGHT - 50, 50, 50);
    nextGrid = make2DArray(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {

        state = checkNeighbors(i, j);

        nextGrid[i][j] = state;
      }
    }
  } else {
    frameRate(60);
    if (mouseIsPressed) {
      if (mouseRow >= 0 && mouseRow < rows && mouseCol >= 0 && mouseCol < cols) { 
        nextGrid[mouseRow][mouseCol] = 1;
      }
    }
    image(stop, 0, HEIGHT - 50, 50, 50);
    nextGrid = grid;
  }
  
  grid = nextGrid;
}



function keyPressed() {
  if (key == " ") {
    if (startSim) {
      startSim = false;
    } else {
      startSim = true; 
    }
  }
  if (key == "r") {
    grid = make2DArray(rows, cols);
    startSim = false;
  }
}

function returnState(centerCellState, neighborCount) {
  /*
    1. Any live cell with fewer than two live neighbours dies, as if by        underpopulation.
    2. Any live cell with two or three live neighbours lives on to the next    generation.
    3. Any live cell with more than three live neighbours dies, as if by      overpopulation.
    4. Any dead cell with exactly three live neighbours becomes a live        cell, as if by reproduction.
  */
  if (centerCellState == 1 && neighborCount < 2) {
    return 0;
  } else if (centerCellState == 1 && (neighborCount == 2 || neighborCount == 3)) {
    return 1;
  } else if (centerCellState == 1 && neighborCount > 3) {
    return 0;
  } else if (centerCellState == 0 && neighborCount == 3) {
    return 1;
  } else {
    return centerCellState;
  }
}

function checkNeighbors(i, j) {
  let adjacentCells = [[0, -1], [0, 1], [-1, 0], [1, 0],
                      [-1, -1], [-1, 1], [1, -1], [1, 1]];
  
  let centerCellState = grid[i][j];
  let neighborCount = 0;
  
  for (let k = 0; k < adjacentCells.length; k++) {
    let new_position = adjacentCells[k];
    let cell_position = [i + new_position[1], j + new_position[0]];
    
    if ((cell_position[0] > grid.length - 1 || cell_position[0] < 0) || (cell_position[1] > grid[grid.length-1].length -1 || cell_position[1] < 0)) {
      continue;
    }

    if (grid[cell_position[0]][cell_position[1]] == 1) {
      neighborCount++;
    }
  }
  state = returnState(centerCellState, neighborCount);
  
  return state; 
}