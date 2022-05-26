'use strict';
var mine = 'mine';
var flags = 0;

var mineIcon = '<i class="fas fa-bomb"></i>';
var flagIcon = '🚩';
var empty = '';

var gBoard;
var gTimerInterval;
var gFirstClick = true;

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
  gGame.isOn = true;
  gFirstClick = true;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
  gTotalSeconds = 0;
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
  console.log(board);
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
      board[i][j].minesAroundCount = getNeighborMinesCount(board, i, j);
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
  var counter = 0;
  var clickedCell = gBoard[i][j];
  var elRevealedTxt = document.querySelector('.revealed-number');

  if (!gGame.isOn) return;

  if (!clickedCell.isShown) {
    gGame.shownCount++;
    console.log(gGame);
  }

  if (clickedCell.isMarked) return;

  // update the model
  clickedCell.isShown = true;
  console.log(clickedCell);

  //update the dom
  elCell.classList.remove('cell-hidden');
  elCell.classList.add('cell-shown');
  elRevealedTxt.innerHTML = gGame.shownCount;

  if (gFirstClick) {
    gTimerInterval = setInterval(countUpTimer, 20);
    gFirstClick = false;
    if (clickedCell.isMine) {
      clickedCell.isMine = false;
      elCell.innerText = '';
      expandShown(gBoard, elCell, i, j);
      return;
    }
  }

  if (clickedCell.minesAroundCount === 0) {
    expandShown(gBoard, elCell, i, j);
  }

  checkGameOver(gBoard);

  if (clickedCell.isMine) {
    elCell.innerHTML = mineIcon;
    return;
  }

  elCell.innerText = clickedCell.minesAroundCount === 0 ? '' : clickedCell.minesAroundCount;
}

function cellMarked(event, elCell, i, j) {
  event.preventDefault();
  checkGameOver(gBoard);
  var currCell = gBoard[i][j];
  if (gFirstClick) {
    gTimerInterval = setInterval(countUpTimer, 15);
    gFirstClick = false;
  }

  if (!gGame.isOn) return;

  if (currCell.isShown) return;

  if (currCell.isMarked) {
    currCell.isMarked = false;
    gGame.markedCount--;
    elCell.innerText = ' ';
  } else {
    currCell.isMarked = true;
    gGame.markedCount++;
    elCell.innerHTML = flagIcon;
  }
}

function checkGameOver(board) {
  var elModal = document.querySelector('.modal');
  var elModalTxt = document.querySelector('.modal h2');
  var elRestartButton = document.querySelector('.restart-button');

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      // check if he lost
      if (currCell.isMine && currCell.isShown) {
        clearInterval(gTimerInterval);
        gGame.isOn = false;
        elModal.style.display = 'block';
        elRestartButton.innerText = '🤯';
      }

      // check if he won
      if (gGame.shownCount === 14 && gGame.markedCount === 2) {
        clearInterval(gTimerInterval);
        gGame.isOn = false;
        elModal.style.display = 'block';
        elModalTxt.innerText = 'You Won';
        elRestartButton.innerText = '😎';
      }
      if (gGame.shownCount === 52 && gGame.markedCount === 12) {
        clearInterval(gTimerInterval);
        gGame.isOn = false;
        elModal.style.display = 'block';
        elModalTxt.innerText = 'You Won';
        elRestartButton.innerText = '😎';
      }

      if (gGame.shownCount === 114 && gGame.markedCount === 30) {
        clearInterval(gTimerInterval);
        gGame.isOn = false;
        elModal.style.display = 'block';
        elModalTxt.innerText = 'You Won';
        elRestartButton.innerText = '😎';
      }
    }
  }
}

function restartGame() {
  init();
  clearInterval(gTimerInterval);
  var elTimer = document.querySelector('.clock');
  var elRestartButton = document.querySelector('.restart-button');
  var elRevealedTxt = document.querySelector('.revealed-number');
  var elModal = document.querySelector('.modal');
  elRestartButton.innerText = '😃';
  elModal.style.display = 'none';
  elRevealedTxt.innerText = gGame.shownCount;
  elTimer.innerText = 'TIMER 0:0:00';
}

function expandShown(board, elCell, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === rowIdx && j === colIdx) continue;
      var currCell = board[i][j];
      if (currCell.isShown) continue;
      var cellId = '#' + getClassName({ i, j });

      // update the model
      currCell.isShown = true;
      gGame.shownCount++;

      // update the DOM
      var elNextCell = document.querySelector(cellId);
      elNextCell.classList.add('cell-shown');
      elNextCell.classList.remove('cell-hidden');
      elNextCell.innerText = currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount;
    }
  }
}

function boardSizeDifficulty(board) {
  if (board === 8) {
    var boardSize = (gLevel.SIZE = 4);
    var newMines = (gLevel.MINES = 2);
    gBoard = buildBoard();
    renderBoard(gBoard);
  }

  if (board === 16) {
    var boardSize = (gLevel.SIZE = 8);
    var newMines = (gLevel.MINES = 12);
    gBoard = buildBoard();
    renderBoard(gBoard);
  }

  if (board === 24) {
    var boardSize = (gLevel.SIZE = 12);
    var newMines = (gLevel.MINES = 30);
    gBoard = buildBoard();
    renderBoard(gBoard);
  }
}
