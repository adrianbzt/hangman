let playButton = document.querySelector('.play');
let usedLetters = document.querySelector('.hg-used');
let guessLetters = document.querySelector('.hg-guess');
let imageSelector = document.querySelector('.hg-image-selector');

let usedLettersPerGame = [];


let words = ['ana', 'are', 'mere', 'mari', 'frumoase'];

let tries = {
  max: 6,
  current: 0,
}

let min = 0;
let max = Math.floor(words.length);

let pos = Math.floor(Math.random() * (max - min)) + min;

playButton.addEventListener('click', function() {
  let role = playButton.getAttribute('value');
  switch (role) {
    case 'Play':
      startHangman();
      break;
    case 'Reset':
      resetHangman();
      break;
    default:
      break;
  }

})

function startHangman() {
  document.getElementById('hg-result-span').innerHTML = '';
  generateNewPos();
  addBlankLetters();
  enableKeyPress();
  updatePlayButton();
}

function stopHangman(message) {
  console.log(message);

  document.getElementById('hg-result-span').innerHTML = message;
  resetHangman();
}


function isGameOver() {
  if (tries.current >= tries.max) {
    return true;
  } else {
    return false;
  }
}

function isWin() {
  let guessLetters = document.querySelectorAll('.hg-guess-letter');
  let guessWord = '';
  for (let i = 0; i < guessLetters.length; i++) {
    guessWord += guessLetters[i].innerHTML;
  }

  if (guessWord.toLocaleUpperCase() === words[pos].toLocaleUpperCase()) {
    return true;
  } else {
    return false;
  }
}

function getPosition(eventWhich, position) {
  let posInWord = (words[pos]).toLocaleUpperCase().indexOf(String.fromCharCode(eventWhich).toLocaleUpperCase(), position);
  return posInWord;
}

function addBlankLetters() {

  for (i = 0; i < words[pos].length; i++) {
    let space = document.createElement('span');
    space.setAttribute('class', 'hg-guess-letter');
    space.setAttribute('id', 'letter_' + i);
    space.innerHTML = '_';
    guessLetters.appendChild(space);
  }
}

function addLetterHistory(eventWhich, isFound) {

  let stringLetter = String.fromCharCode(event.which).toLocaleUpperCase();

  if (usedLettersPerGame.indexOf(stringLetter) === -1) {

    usedLettersPerGame.push(stringLetter);

    let letter = document.createElement('span');
    letter.setAttribute('class', (isFound) ? 'hg-letter-correct' : 'hg-letter-incorrect');
    letter.innerHTML = stringLetter;
    usedLetters.appendChild(letter);
  }
}

function enableKeyPress() {
  document.addEventListener('keyup', gameLogic);
}

function gameLogic(event) {

  let stringLetter = String.fromCharCode(event.which).toLocaleUpperCase();

  if (!isGameOver()) {
    if (((event.which >= 97 && event.which <= 122) || (event.which >= 65 && event.which <= 90)) && (event.key).toString().length < 2) {

      let allPositions = getAllPositions(event.which, 0);
      let isFound = false;

      console.log(allPositions)

      if (allPositions.length > 0) {
        for (let i = 0; i < allPositions.length; i++) {
          revealLetter(event.which, allPositions[i]);
        }
        isFound = true;

      } else {
        if (usedLettersPerGame.indexOf(stringLetter) === -1) {
          tries.current++;
          let imageFile = 'images/Selection_00' + tries.current + '.png';
          imageSelector.setAttribute('src', imageFile);

        }
      }
      addLetterHistory(event.which, isFound);
    }

  } else {

    stopHangman('You Loose! The word was "' + words[pos] + '"');
  }

  if (isWin()) {
    setTimeout(() => {
      stopHangman('You Win! The word was "' + words[pos] + '"');
    }, 1000)
  }
}

function revealLetter(eventWhich, posInWord) {

  let toRevealPos = document.getElementById('letter_' + posInWord);
  toRevealPos.innerHTML = String.fromCharCode(eventWhich).toLocaleUpperCase();
}

function getAllPositions(eventWhich, posInWord) {
  let position = getPosition(event.which, posInWord);
  let positions = [];

  while (position > -1) {

    positions.push(position);
    position = getPosition(event.which, position + 1);
  }

  return positions;
}

function updatePlayButton() {
  playButton.setAttribute('value', 'Reset');
}

function resetHangman() {
  playButton.setAttribute('value', 'Play');

  while (usedLetters.firstChild) {
    usedLetters.removeChild(usedLetters.firstChild);
  }

  while (guessLetters.firstChild) {
    guessLetters.removeChild(guessLetters.firstChild);
  }

  let imageFile = 'images/start.png';
  imageSelector.setAttribute('src', imageFile);

  tries.current = 0;

  usedLettersPerGame = [];

  document.removeEventListener("keyup", gameLogic); // Succeeds

}

function generateNewPos() {
  pos = Math.floor(Math.random() * (max - min)) + min;
  console.log(pos)
  console.log(words[pos])
}
