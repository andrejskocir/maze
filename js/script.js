
var maze = document.getElementById("maze");
let ctx = maze.getContext("2d");
let size = 600;
const start = document.getElementById("start");
const opis = document.querySelector(".opis");
let current;
let goal;
let generationComplete = false;
let grid;

start.addEventListener("click", (e) => {
  opis.style.display = "none";
  start.style.display = "none";
  class Maze {
    constructor(size, rows, columns) {
      this.size = size;
      this.columns = columns;
      this.rows = rows;
      this.grid = [];
      this.stack = [];
    }

    setup() {
      for (let r = 0; r < this.rows; r++) {
        let row = [];
        for (let c = 0; c < this.columns; c++) {
          let cell = new Cell(r, c, this.grid, this.size);
          row.push(cell);
        }
        this.grid.push(row);
      }
      current = this.grid[0][0];
      this.grid[this.rows - 1][this.columns - 1].goal = true;
    }

    draw() {
      maze.width = this.size;
      maze.height = this.size;
      maze.style.background = "transparent";

      // maze.style.background = "url('./images/bg.jpg')";
      current.visited = true;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.columns; c++) {
          let grid = this.grid;
          grid[r][c].show(this.size, this.rows, this.columns);
        }
      }
      let next = current.checkNeighbours();
      if (next) {
        next.visited = true;
        this.stack.push(current);
        current.highlight(this.columns);
        current.removeWalls(current, next);
        current = next;
      } else if (this.stack.length > 0) {
        let cell = this.stack.pop();
        current = cell;
        current.highlight(this.columns);
      }
      if (this.stack.length === 0) {
        generationComplete = true;
        return;
        
      }

      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.draw();
        }, 5);
      });
    }
  }

  class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
      this.rowNum = rowNum;
      this.colNum = colNum;
      this.visited = false;
      this.walls = {
        topWall: true,
        rightWall: true,
        bottomWall: true,
        leftWall: true,
      };
      this.goal = false;
      this.parentGrid = parentGrid;
      this.parentSize = parentSize;
    }

    checkNeighbours() {
      let grid = this.parentGrid;
      let row = this.rowNum;
      let col = this.colNum;
      let neighbours = [];

      let top = row !== 0 ? grid[row - 1][col] : undefined;
      let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
      let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
      let left = col !== 0 ? grid[row][col - 1] : undefined;

      if (top && !top.visited) neighbours.push(top);
      if (right && !right.visited) neighbours.push(right);
      if (bottom && !bottom.visited) neighbours.push(bottom);
      if (left && !left.visited) neighbours.push(left);

      if (neighbours.length !== 0) {
        let random = Math.floor(Math.random() * neighbours.length);
        return neighbours[random];
      } else {
        return undefined;
      }
    }

    drawTopWall(x, y, size, columns, rows) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size / columns, y);
      ctx.stroke();

    }

    drawRightWall(x, y, size, columns, rows) {
      ctx.beginPath();
      ctx.moveTo(x + size / columns, y);
      ctx.lineTo(x + size / columns, y + size / rows);
      ctx.stroke();
    }

    drawBottomWall(x, y, size, columns, rows) {
      ctx.beginPath();
      ctx.moveTo(x, y + size / rows);
      ctx.lineTo(x + size / columns, y + size / rows);
      ctx.stroke();
    }

    drawLeftWall(x, y, size, columns, rows) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size / rows);
      ctx.stroke();
    }

    highlight(columns) {
      let x = (this.colNum * this.parentSize) / columns + 1;
      let y = (this.rowNum * this.parentSize) / columns + 1;


      let img = new Image();
      img.src = "./images/icon1.png";
      img.onload = function () {
        ctx.drawImage(img, x, y, 60, 60);
      };


    }




    removeWalls(cell1, cell2) {
      let x = cell1.colNum - cell2.colNum;
      if (x === 1) {
        cell1.walls.leftWall = false;
        cell2.walls.rightWall = false;
      } else if (x === -1) {
        cell1.walls.rightWall = false;
        cell2.walls.leftWall = false;
      }
      let y = cell1.rowNum - cell2.rowNum;
      if (y === 1) {
        cell1.walls.topWall = false;
        cell2.walls.bottomWall = false;
      } else if (y === -1) {
        cell1.walls.bottomWall = false;
        cell2.walls.topWall = false;
      }
    }

    show(size, rows, columns) {
      let x = (this.colNum * size) / columns;
      let y = (this.rowNum * size) / rows;

      ctx.strokeStyle = "white";
      ctx.fillStyle = "transparent";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "hsl(317 100% 54%)";
      if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
      if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
      if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
      if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
      if (this.visited) {
        ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      }
      if (this.goal) {
        let cilj = new Image();
        cilj.src = "./images/goal.png";
        ctx.drawImage(cilj, x, y, 60, 60);
        ctx.fillRect(
          x,
          y,
          this.parentSize / columns - 3,
          this.parentSize / columns - 3
        );



        // ctx.fillStyle = "hsl(317 100% 54%)";
        //ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
      }
    }
  }
  document.addEventListener("keydown", move);
        function move(e) {
          if (!generationComplete) return;
          let key = e.key;
          let row = current.rowNum;
          let col = current.colNum;
          switch (key) {
            case "ArrowUp":
              if (!current.walls.topWall) {
                let next = newMaze.grid[row - 1][col];
                current = next;
                newMaze.draw();
                current.highlight(newMaze.columns);
                // not required if goal is in bottom right
                if (current.goal){
                  complete.style.display = "block";
                  backdrop.style.display = "block";
                } 
              }
              break;

            case "ArrowRight":
              if (!current.walls.rightWall) {
                let next = newMaze.grid[row][col + 1];
                current = next;
                newMaze.draw();
                current.highlight(newMaze.columns);
                if (current.goal){
                  complete.style.display = "block";
                  backdrop.style.display = "block";
                }
              }
              break;

            case "ArrowDown":
              if (!current.walls.bottomWall) {
                let next = newMaze.grid[row + 1][col];
                current = next;
                newMaze.draw();
                current.highlight(newMaze.columns);
                if (current.goal){
                  complete.style.display = "block";
                  backdrop.style.display = "block";
                }
              }
              break;

            case "ArrowLeft":
              if (!current.walls.leftWall) {
                let next = newMaze.grid[row][col - 1];
                current = next;
                newMaze.draw();
                current.highlight(newMaze.columns);
                // not required if goal is in bottom right
                if (current.goal){
                  complete.style.display = "block";
                  backdrop.style.display = "block";
                }
              }
              break;
          }
          
        }

  let newMaze = new Maze(600, 10, 10);
  newMaze.setup();
  newMaze.draw();
});

let complete = document.querySelector(".complete");
let replay = document.querySelector(".replay");
let close = document.querySelector(".close");
let backdrop= document.querySelector(".backdrop");



replay.addEventListener("click", () => {
  location.reload();

});

replay.addEventListener("mousemove", () => {
  replay.style.transition = "0.5s ease";
});


let play = document.getElementById("play");
let audio=new Audio('audio/song.mp3');

function playSong(){

  audio.loop=true;
  audio.volume = 0.2;
  audio.play();
  document.getElementById("play").style.display= "none";
  document.getElementById("pause").style.display= "block";
}
function stopSong(){
  audio.pause();
  document.getElementById("play").style.display= "block";
  document.getElementById("pause").style.display= "none";
}
  
  
  















//sweetalert
const info = document.querySelector(".info");
const copy = document.getElementById("copy");

info.addEventListener("click", (e) => {
  Swal.fire({
    title: 'Instructions',
    color: '#716add',
    text: 'The maze will be automaticly generated to you. Your goal is to get to the X icon. Move with your arrow keys on the keyboard. Good luck!',
    background: 'linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.3)),hsl(317 70% 54%)',
    confirmButtonColor: "hsl(317 70% 54%)",
  })


})

copy.addEventListener("click", (e) => {
  Swal.fire({
    title: 'Credits',
    color: '#716add',
    text: 'Made by Andrej Skočir.',
    background: 'linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.3)),hsl(317 70% 54%)',
    confirmButtonColor: "hsl(317 70% 54%)",
  })


})