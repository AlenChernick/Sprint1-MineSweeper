'use strict';

function lifeSupport(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (life > 0) {
        life--;
        return life;
      }
    }
  }
}

function changeLifeToRed() {
  var elLife1 = document.querySelector('.life1');
  var elLife2 = document.querySelector('.life2');
  var elLife3 = document.querySelector('.life3');
  elLife1.style.color = '#e74c3c';
  elLife2.style.color = '#e74c3c';
  elLife3.style.color = '#e74c3c';
}

function changeLifeToBordo() {
  var elLife1 = document.querySelector('.life1');
  var elLife2 = document.querySelector('.life2');
  var elLife3 = document.querySelector('.life3');
  if (life === 2) {
    elLife1.style.color = '#523734';
  }

  if (life === 1) {
    elLife2.style.color = '#523734';
  }

  if (life === 0) {
    elLife3.style.color = '#523734';
  }
}

function changeAllHintsBackToYellow() {
  var elHint3 = document.querySelector('.hint3');
  var elHint2 = document.querySelector('.hint2');
  var elHint1 = document.querySelector('.hint1');
  elHint3.style.color = 'rgb(248, 248, 32)';
  elHint2.style.color = 'rgb(248, 248, 32)';
  elHint1.style.color = 'rgb(248, 248, 32)';
}

function winnerUpdate() {
  var elModal = document.querySelector('.modal');
  var elModalTxt = document.querySelector('.modal h2');
  var elRestartButton = document.querySelector('.restart-button');
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  elModal.style.display = 'block';
  elModalTxt.innerText = 'You Won';
  elModalTxt.style.color = 'rgb(122, 250, 152)';
  elRestartButton.innerText = '😎';
}

function isLost() {
  var elModal = document.querySelector('.modal');
  var elModalTxt = document.querySelector('.modal h2');
  var elRestartButton = document.querySelector('.restart-button');
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  elModal.style.display = 'block';
  elModalTxt.innerText = 'Game Over';
  elModalTxt.style.color = 'rgb(179, 76, 76)';
  elRestartButton.innerText = '🤯';
}

function updateModelAndDom() {
  var elTimer = document.querySelector('.clock');
  var elRestartButton = document.querySelector('.restart-button');
  var elRevealedTxt = document.querySelector('.revealed-number');
  var elModal = document.querySelector('.modal');
  elRestartButton.innerText = '😃';
  elModal.style.display = 'none';
  elRevealedTxt.innerText = gGame.shownCount;
  elTimer.innerText = 'TIMER 0:0:00';
}

function checkMineOnBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j];
      var cellId = '#' + getIdName({ i, j });
      var elBombCell = document.querySelector(cellId);
      if (!currCell.isMine) continue;
      if (currCell.isMine && !gGame.isOn) {
        currCell.isShown = true;
        elBombCell.classList.remove('cell-hidden');
        elBombCell.classList.add('cell-shown');
        elBombCell.innerHTML = mineIcon;
      }
    }
  }
}

function boardSizeDifficulty(board) {
  //checks the difficuly of the game,
  //and update the dom,model
  // restartGame();
  if (board === 4) {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gGame.shownCount = 0;
    restartGame();
  }

  if (board === 8) {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    gGame.shownCount = 0;
    restartGame();
  }

  if (board === 12) {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gGame.shownCount = 0;
    restartGame();
  }
  return board;
}
