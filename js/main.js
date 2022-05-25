'use strict';
var mine = 'mine';
var flags = 0;

var mineIcon = '<i class="fas fa-bomb"></i>';
var flagIcon = '🚩';
var empty = '';

var gBoard;
var gTimerInterval;

var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  console.table(gBoard);
  gGame.isOn = true;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
}

function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = { isShown: false, isMine: false, isMarked: false };
      // add created cell to the game board
      board[i][j] = cell;
    }
  }

  createMines(board, gLevel.MINES);
  setMinesNegsCount(board);
  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var cellClass = currCell.isShown ? 'cell-shown' : 'cell-hidden';
      strHTML += `\t<td id="cell-${i}-${j}"
      class="cell ${cellClass}"
      onclick="cellClicked(this, ${i},${j})"
      oncontextmenu="cellMarked(event,this, ${i},${j})"></td>\n`;
    }
    strHTML += '</tr>\n';
  }
  var elBoard = document.querySelector('.board-conatiner');
  elBoard.innerHTML = strHTML;
}

function createMines(board, minesCount) {
  for (var i = 0; i < minesCount; i++) {
    var IdxRow = getRandomIntInc(0, gLevel.SIZE - 1);
    var idxColumn = getRandomIntInc(0, gLevel.SIZE - 1);
    if (board[IdxRow][idxColumn].isMine) {
      i--;
      continue;
    }
    board[IdxRow][idxColumn].isMine = true;
  }
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine) continue;
      board[i][j].minesAreNegsCount = getNeighborMinesCount(board, i, j);
    }
  }
}

function getNeighborMinesCount(board, rowIdx, colIdx) {
  var counter = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === rowIdx && j === colIdx) continue;

      var currCell = board[i][j];
      if (currCell.isMine) counter++;
    }
  }
  return counter;
}

function cellClicked(elCell, i, j) {
  var clickedCell = gBoard[i][j];
  var elRevealed = document.querySelector('.mines-count');
  if (!gGame.isOn) return;
  if (clickedCell) {
    gTimerInterval = setInterval(countUpTimer, 50);
  }

  if (!clickedCell.isShown) {
    gGame.shownCount++;
    console.log(gGame);
  }
  if (!gGame.isOn) return;
  if (clickedCell.isMarked) return;

  // update the model
  clickedCell.isShown = true;
  console.log(clickedCell);

  //update the dom
  elCell.classList.remove('cell-hidden');
  elCell.classList.add('cell-shown');
  elRevealed.innerText = gGame.shownCount;

  checkGameOver(gBoard);
  if (clickedCell.isMine) {
    elCell.innerHTML = mineIcon;
    return;
  }
  if (!clickedCell.isMine) {
    elCell.innerHTML = clickedCell.minesAreNegsCount;
    return;
  }
  elCell.innerText = clickedCell.minesAroundCount === 0 ? '' : clickedCell.minesAroundCount;
}

function cellMarked(event, elCell, i, j) {
  event.preventDefault();
  checkGameOver(gBoard);
  var currCell = gBoard[i][j];
  if (!gGame.isOn) return;

  if (currCell.isMarked) {
    currCell.isMarked = false;

    elCell.innerText = ' ';
  } else {
    currCell.isMarked = true;
    gGame.markedCount++;

    console.log(gGame);
    elCell.innerHTML = flagIcon;
  }
}

// Game ends when all mines are
// marked, and all the other cells
// are shown

function checkGameOver(board) {
  var elModal = document.querySelector('.modal');
  var elRestartButton = document.querySelector('.restart-button');
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.isMine && currCell.isShown) {
        gGame.isOn = false;
        elModal.style.display = 'block';
        elRestartButton.innerText = '🤯';
      }
      if (currCell.isMarked && !currCell.isShown && currCell.isMarked === currCell.isMine) {
        console.log('winner');
      }
    }
  }
}

function restartGame() {
  init();
  var elRestartButton = document.querySelector('.restart-button');
  var elRevealed = document.querySelector('.mines-count');
  var elModal = document.querySelector('.modal');
  elRestartButton.innerText = '😃';
  elModal.style.display = 'none';
  elRevealed.innerText = gGame.shownCount;
}
