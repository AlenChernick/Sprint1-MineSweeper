'use strict';
var mineIcon = '<i class="fas fa-bomb"></i>';
var flagIcon = '🚩';
var userLife = 3;
var hints = 3;

var gBoard;
var gTimerInterval;
var gFirstClick = true;
var isHint = false;

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
  gFirstClick = true;
  gGame.isOn = true;
  isHint = false;
  gGame.markedCount = 0;
  gGame.shownCount = 0;
  gTotalSeconds = 0;
  hints = 3;
  userLife = 3;
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0,
      };
      // add created cell to the game board
      board[i][j] = cell;
    }
  }
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

function createMines(board, minesCount, i, j) {
  for (var i = 0; i < minesCount; i++) {
    var idxRow = getRandomIntInc(0, gLevel.SIZE - 1);
    var idxColumn = getRandomIntInc(0, gLevel.SIZE - 1);
    if (board[idxRow][idxColumn].isMine || (idxRow === i && idxColumn === j)) {
      i--;
      continue;
    }
    board[idxRow][idxColumn].isMine = true;
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
  if (gFirstClick) {
    gTimerInterval = setInterval(countUpTimer, 20);
    createMines(gBoard, gLevel.MINES, i, j);
    setMinesNegsCount(gBoard);
    gFirstClick = false;
  }
  if (clickedCell.isMine && userLife > 0) {
    lifeSupport(gBoard);
    clickedCell.isMine = false;
    clickedCell.isShown = true;
    elCell.classList.remove('cell-hidden');
    elCell.classList.add('cell-shown');
    elCell.innerHTML = mineIcon;
    changeLifeToBordo();
  }
  if (!gGame.isOn) return;

  if (!clickedCell.isShown) {
    gGame.shownCount++;
    console.log(gGame);
  } else return;

  if (clickedCell.isMarked) return;

  if (isHint) {
    getHints(gBoard, i, j);
    return;
  }

  // update the model
  clickedCell.isShown = true;
  console.log(clickedCell);

  //update the dom
  elCell.classList.remove('cell-hidden');
  elCell.classList.add('cell-shown');
  elRevealedTxt.innerHTML = gGame.shownCount;
  // console.log(elCell);
  checkGameOver(gBoard);
  if (clickedCell.isMine) {
    clickedCell.isShown = true;
    elCell.innerHTML = mineIcon;
    return;
  }

  if (clickedCell.minesAroundCount === 0) {
    expandShown(gBoard, elCell, i, j);
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

function isWon() {
  // check if user won
  if (gLevel.SIZE === 4) {
    if (
      (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** gLevel.MINES - gGame.markedCount) ||
      gGame.shownCount > 13
    ) {
      winnerUpdate();
    }
    checkMineOnBoard(gBoard);
  }
  if (gLevel.SIZE === 8) {
    if (
      (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** gLevel.MINES - gGame.markedCount) ||
      gGame.shownCount > 51
    ) {
      winnerUpdate();
    }
    checkMineOnBoard(gBoard);
  }
  if (gLevel.SIZE === 12) {
    if (
      (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** gLevel.MINES - gGame.markedCount) ||
      gGame.shownCount > 113
    ) {
      winnerUpdate();
    }
    checkMineOnBoard(gBoard);
  }
}

function checkGameOver(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      // check if user lost
      if (currCell.isShown && currCell.isMine) {
        isLost();
      }
      checkMineOnBoard(gBoard);
    }
    // check if user won
    if (!currCell.isMine) {
      isWon();
    }
  }
}

function restartGame() {
  init();
  clearInterval(gTimerInterval);
  changeLifeToRed();
  updateModelAndDom();
}

function expandShown(board, elCell, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === rowIdx && j === colIdx) continue;
      var currCell = board[i][j];
      if (currCell.isShown) continue;
      var cellId = '#' + getIdName({ i, j });

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

function getHints(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      var cellId = '#' + getIdName({ i: i, j: j });
      var elCell = document.querySelector(cellId);
      // update the DOM
      if (currCell.isShown) continue;
      elCell.innerText = currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount;
      if (currCell.isMine) {
        elCell.innerHTML = mineIcon;
      }

      elCell.classList.add('cell-shown');
    }
  }
  setTimeout(() => {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j >= board[0].length) continue;
        var currCell = board[i][j];
        var cellId = '#' + getIdName({ i: i, j: j });
        var elCell = document.querySelector(cellId);
        // update the DOM
        if (currCell.isShown) continue;
        elCell.innerText = '';
        elCell.classList.remove('cell-shown');
      }
    }
    var elCellIcon = document.querySelector(`.hint${hints}`);
    elCellIcon.style.color = 'rgb(133, 133, 20)';
    hints--;
    // console.log(elCellIcon);
  }, 1000);
  isHint = false;
}

function hint() {
  if (gFirstClick || hints === 0 || isHint === true) return;
  isHint = true;
}
