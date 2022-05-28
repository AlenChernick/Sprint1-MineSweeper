'use strict';
var gTotalSeconds = 0;

function createMat(ROWS, COLS = ROWS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push('');
    }
    mat.push(row);
  }
  return mat;
}

function getRandomIntInc(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getIdName(location) {
  var cellId = 'cell-' + location.i + '-' + location.j;
  return cellId;
}

function getCellCoord(strCellId) {
  var parts = strCellId.split('-');
  var coord = { i: +parts[1], j: +parts[2] };
  return coord;
}

function countUpTimer() {
  ++gTotalSeconds;
  var hour = Math.floor(gTotalSeconds / 3600);
  var minute = Math.floor((gTotalSeconds - hour * 3600) / 60);
  var seconds = gTotalSeconds - (hour * 3600 + minute * 60);
  var elTimer = document.querySelector('.clock');
  elTimer.innerHTML = 'TIMER' + '<br>' + hour + ':' + minute + ':' + seconds;
  elTimer.style.display = 'block';
}
