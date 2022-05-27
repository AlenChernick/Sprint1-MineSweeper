'use strict';
var mine = 'mine';
var flags = 0;
var userLife = 3;

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
  userLife = 3;
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
  var clickedCell = gBoard[i][j];
  var elRevealedTxt = document.querySelector('.revealed-number');
  var elLife1 = document.querySelector('.life1');
  var elLife2 = document.querySelector('.life2');
  var elLife3 = document.querySelector('.life3');
  if (clickedCell.isMine && userLife > 0) {
    lifeSupport(gBoard);
    clickedCell.isMine = false;
    clickedCell.isShown = true;
    elCell.classList.remove('cell-hidden');
    elCell.classList.add('cell-shown');
    elCell.innerHTML = mineIcon;
    if (userLife === 2) {
      elLife1.style.color = '#523734';
    }

    if (userLife === 1) {
      elLife2.style.color = '#523734';
    }

    if (userLife === 0) {
      elLife3.style.color = '#523734';
    }
  }

  if (!gGame.isOn) return;
  if (!clickedCell.isShown) {
    gGame.shownCount++;
    console.log(gGame);
  } else return;

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
    clickedCell.isMine = true;
    clickedCell.isShown = true;
    elCell.innerHTML = mineIcon;
    return;
  }

  elCell.innerText = clickedCell.minesAroundCount === 0 ? '' : clickedCell.minesAroundCount;
}

function cellMarked(event, elCell, i, j) {
  event.preventDefault();
  var currCell = gBoard[i][j];
  checkGameOver(gBoard);
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
  var elCellMine;
  var elModal = document.querySelector('.modal');
  var elModalTxt = document.querySelector('.modal h2');
  var elRestartButton = document.querySelector('.restart-button');
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      // check if he win or he loss
      if (gLevel.SIZE === 4) {
        if (gGame.shownCount > 13) {
          clearInterval(gTimerInterval);
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'You Won';
          elModalTxt.style.color = 'rgb(122, 250, 152)';
          elRestartButton.innerText = '😎';
        }
        if (currCell.isShown && currCell.isMine && gGame.shownCount <= 14) {
          clearInterval(gTimerInterval);
          currCell.isMine = true;
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'Game Over';
          elModalTxt.style.color = 'rgb(179, 76, 76)';
          elRestartButton.innerText = '🤯';
        }
      }
      if (gLevel.SIZE === 8) {
        if (gGame.shownCount > 51) {
          clearInterval(gTimerInterval);
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'You Won';
          elModalTxt.style.color = 'rgb(122, 250, 152)';
          elRestartButton.innerText = '😎';
        }
        if (currCell.isShown && currCell.isMine && gGame.shownCount <= 52) {
          clearInterval(gTimerInterval);
          currCell.isMine = true;
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'Game Over';
          elModalTxt.style.color = 'rgb(179, 76, 76)';
          elRestartButton.innerText = '🤯';
        }
      }

      if (gLevel.SIZE === 12) {
        if (gGame.shownCount > 113) {
          clearInterval(gTimerInterval);
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'You Won';
          elModalTxt.style.color = 'rgb(122, 250, 152)';
          elRestartButton.innerText = '😎';
        }
        if (currCell.isShown && currCell.isMine && gGame.shownCount <= 114) {
          clearInterval(gTimerInterval);
          currCell.isMine = true;
          gGame.isOn = false;
          elModal.style.display = 'block';
          elModalTxt.innerText = 'Game Over';
          elModalTxt.style.color = 'rgb(179, 76, 76)';
          elRestartButton.innerText = '🤯';
        }
      }
    }
  }
}

function restartGame() {
  init();
  clearInterval(gTimerInterval);
  var elLife1 = document.querySelector('.life1');
  var elLife2 = document.querySelector('.life2');
  var elLife3 = document.querySelector('.life3');
  var elTimer = document.querySelector('.clock');
  var elRestartButton = document.querySelector('.restart-button');
  var elRevealedTxt = document.querySelector('.revealed-number');
  var elModal = document.querySelector('.modal');
  elRestartButton.innerText = '😃';
  elLife1.style.color = '#e74c3c';
  elLife2.style.color = '#e74c3c';
  elLife3.style.color = '#e74c3c';
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
      elNextCell.innerHTML = currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount;
    }
  }
}

function boardSizeDifficulty(board) {
  if (board === 8) {
    restartGame();
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gGame.shownCount = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
  }

  if (board === 16) {
    restartGame();
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    gGame.shownCount = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
  }

  if (board === 24) {
    restartGame();
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gGame.shownCount = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
  }
  return board;
}

function lifeSupport(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (userLife > 0) {
        userLife--;
        return userLife;
      }
    }
  }
}
