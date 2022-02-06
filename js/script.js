
var maze = document.getElementById("maze");
let ctx = maze.getContext("2d");
ctx.scale(2,2);
let size = 600;
const start = document.getElementById("start");
const container = document.querySelector(".container");
let current;
let goal;
let generationComplete = false;
let grid;
const first = document.getElementById("first-option");
const second = document.getElementById("second-option");

const level1 = document.getElementById("level1");
const level2 = document.getElementById("level2");
const level3 = document.getElementById("level3");

let level;

function getLevel(){
  if(second.classList.contains("selected")){
    level = 1;
    } 
    else if(first.classList.contains("selected")){
      if(level1.classList.contains("selected")){
        level = 1;
      }
      else if(level2.classList.contains("selected")) {
        level = 2;
      }   
      else{
        level = 3;
      }    
      
      }
      console.log(level);
  
  return level;
}

let moveSound = new Audio('audio/move.wav');
    moveSound.volume = 0.5;
let winSound = new Audio('audio/win.wav');

start.addEventListener("click", (e) => { 
  start.style.display = "none";
  container.style.display = "none";
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
      switch(level){
        case 1:
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              this.draw();
            }, 5);
          });
          break;
        case 2:
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              this.draw();
            }, 2);
          });
          break;
         case 3:
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              this.draw();
            }, 0.1);
          });
          break;   
      }

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
        switch (level) {
          case 1:
            ctx.drawImage(img, x + 5, y + 5, 50, 50);
            break;
          case 2:
            ctx.drawImage(img, x + 5, y + 5, 40, 40);
            break;
          case 3:
            ctx.drawImage(img, x + 5, y + 5, 30, 30);
            break;
        }

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

      ctx.strokeStyle = "#2bd01f";
      ctx.fillStyle = "transparent";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#2bd01f";
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
        switch (level) {
          case 1:
            ctx.drawImage(cilj, x + 5, y + 5, 50, 50);
            ctx.fillRect(
              x,
              y,
              this.parentSize / columns - 3,
              this.parentSize / columns - 3
            );
            break;
          case 2:
            ctx.drawImage(cilj, x + 5, y + 5, 40, 40);
            ctx.fillRect(
              x,
              y,
              this.parentSize / columns - 3,
              this.parentSize / columns - 3
            );
            break;
          case 3:
            ctx.drawImage(cilj, x + 5, y + 5, 30, 30);
            ctx.fillRect(
              x,
              y,
              this.parentSize / columns - 3,
              this.parentSize / columns - 3
            );
            break;

        }



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
          moveSound.pause();
          moveSound.play();
          let next = newMaze.grid[row - 1][col];
          current = next;
          newMaze.draw();
          current.highlight(newMaze.columns);
          // not required if goal is in bottom right
          if (current.goal) {
            winSound.play();
            generationComplete = false;
            if (first.classList.contains("selected")){
              level=4;
              newLevel(level);
              tekst.innerHTML = "Congratulations, game completed.";
              nivo.innerHTML = "Play again";
              complete.style.display = "block";
              backdrop.style.display = "block";
            }

            else
            {
              level++;
              tekst.innerHTML = "Maze completed";
              if(level!=4)
              nivo.innerHTML = "Play level "+level;
              complete.style.display = "block";
              backdrop.style.display = "block";
            }
          }

        }
        break;

      case "ArrowRight":
        if (!current.walls.rightWall) {
          moveSound.pause();
          moveSound.play();

          let next = newMaze.grid[row][col + 1];
          current = next;
          newMaze.draw();
          current.highlight(newMaze.columns);
          if (current.goal) {
            winSound.play();
            generationComplete = false;
            if (first.classList.contains("selected")){
              level=4;
              newLevel(level);
              tekst.innerHTML = "Congratulations, game completed.";
              nivo.innerHTML = "Play again";
              complete.style.display = "block";
              backdrop.style.display = "block";
            }

            else
            {
              level++;
              tekst.innerHTML = "Maze completed";
              if(level!=4)
              nivo.innerHTML = "Play level "+level;
              complete.style.display = "block";
              backdrop.style.display = "block";
            }
          }
        }
        break;

      case "ArrowDown":
        if (!current.walls.bottomWall) {
          moveSound.pause();
          moveSound.play();

          let next = newMaze.grid[row + 1][col];
          current = next;
          newMaze.draw();
          current.highlight(newMaze.columns);
          if (current.goal) {
            winSound.play();
            generationComplete = false;
            if (first.classList.contains("selected")){
              level=4;
              newLevel(level);
              tekst.innerHTML = "Congratulations, game completed.";
              nivo.innerHTML = "Play again";
              complete.style.display = "block";
              backdrop.style.display = "block";
            }

            else
            {
              level++;
              tekst.innerHTML = "Maze completed";
              if(level!=4)
              nivo.innerHTML = "Play level "+level;
              complete.style.display = "block";
              backdrop.style.display = "block";
            }
          }
        }
        break;

      case "ArrowLeft":
        if (!current.walls.leftWall) {
          moveSound.pause();
          moveSound.play();

          let next = newMaze.grid[row][col - 1];
          current = next;
          newMaze.draw();
          current.highlight(newMaze.columns);
          // not required if goal is in bottom right
          if (current.goal) {
            winSound.play();
            generationComplete = false;
            if (first.classList.contains("selected")){
              level=4;
              newLevel(level);
              tekst.innerHTML = "Congratulations, game completed.";
              nivo.innerHTML = "Play again";
              complete.style.display = "block";
              backdrop.style.display = "block";
            }

            else
            {
              level++;
              tekst.innerHTML = "Maze completed";
              if(level!=4)
              nivo.innerHTML = "Play level "+level;
              complete.style.display = "block";
              backdrop.style.display = "block";
            }
 
          }
        }
        break;
    }


  }
  let complete = document.querySelector(".complete");
  let tekst = document.querySelector(".tekst");
  let replay = document.querySelector(".replay");
  let backdrop = document.querySelector(".backdrop");
  let nivo = document.getElementById("nivo");

  let newMaze;
  newLevel(level);

  function newLevel(level) {

    switch (level) {
      case 1:
        newMaze = new Maze(600, 10, 10);
        nivo.innerHTML = "Play level 2";
        break;
      case 2:
        newMaze = new Maze(600, 12, 12);
        nivo.innerHTML = "Play level 3";
        break;

      case 3:
        newMaze = new Maze(600, 15, 15);
        tekst.innerHTML = "Congratulations, game completed.";
        nivo.innerHTML = "Play again";
        break;
      case 4:
        if(first.classList.contains("selected")){
          setTimeout(()=>{
            location.reload();
          },3000);
        }
        else
          location.reload();

    }

    newMaze.setup();
    newMaze.draw();
  }

  replay.addEventListener("click", () => {

    newLevel(level);
    complete.style.display = "none";
    backdrop.style.display = "none";
  });

  replay.addEventListener("mousemove", () => {
    replay.style.transition = "0.5s ease";
  });
});




level1.addEventListener("click",(e)=>{
  level2.classList.remove("selected");
  level3.classList.remove("selected");
  level1.classList.add("selected");
})
level2.addEventListener("click",(e)=>{
  level3.classList.remove("selected");
  level1.classList.remove("selected");
  level2.classList.add("selected");
})
level3.addEventListener("click",(e)=>{
  level1.classList.remove("selected");
  level2.classList.remove("selected");
  level3.classList.add("selected");
})

first.addEventListener("click",() =>{
  second.classList.remove("selected");
  first.classList.add("selected");
  options.style.visibility = "hidden";
  select.style.display = "block";
  start.style.display = "none";
})

second.addEventListener("click",() =>{
  first.classList.remove("selected");
  second.classList.add("selected");
  options.style.visibility = "hidden";
  select.style.display = "none";
  start.style.display = "block";
})

const select = document.getElementById("select");
const options = document.querySelector(".options");
const opis = document.querySelector(".opis");
select.addEventListener("click",()=>{
  if(first.classList.contains("selected")){
    options.style.visibility = "visible";
    first.style.display = "none";
    second.style.display = "none";
    select.style.display = "none";
    start.style.display = "block";
    opis.style.display = "none";
  }

 
})







let play = document.getElementById("play");
let audio = new Audio('audio/song.mp3');



function playSong() {

  audio.loop = true;
  audio.volume = 0.8;
  audio.play();
  document.getElementById("play").style.display = "block";
  document.getElementById("pause").style.display = "none";
}
function stopSong() {
  audio.pause();
  document.getElementById("play").style.display = "none";
  document.getElementById("pause").style.display = "block";
}


















//sweetalert
const info = document.querySelector(".info");
const copy = document.getElementById("copy");




info.addEventListener("click", (e) => {
  swal.fire({
    title: 'Instructions',
        text: "The maze will be automatically generated to you. Your goal is to get to the X icon. Move with your arrow keys on the keyboard. Good luck!",
        background: "#55cc55",
        customClass: {
            confirmButton: 'no-border',
          },
        confirmButtonColor: '#353535',
  });
})


copy.addEventListener("click", (e) => {
  swal.fire({
    title: 'Credits',
        text: "Made by Andrej Skočir",
        background: "#55cc55",
        customClass: {
            confirmButton: 'no-border',
          },
        confirmButtonColor: '#353535',
  });

})