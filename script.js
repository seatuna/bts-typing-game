const quotes = [
  "Dont think of anything. Dont bring up any word. Please just smile at me",
  "I still cant believe it. All of this feels like a dream. Dont try to fade away",
  "Is it true? Is it true? You You. Youre so beautiful that Im scared. Untrue Untrue. You You You",
  "Will you stay by my side? Will you promise me? If I touch you, that you might fly away, that you might be shattered, Im scared scared scared",
  "I would stop the time. Once this moment passes by, that it might become something that didnt happen, that I might lose you, Im scared scared scared"
]

const quote = document.getElementById('quote');
const input = document.getElementById('typed-value');
const start = document.getElementById('start');
const message = document.getElementById('message');
const gamerName = document.getElementById('gamer-name');
const scores = getScores();
const scoresUnorderedList = document.getElementById('scores-unordered-list');

let wordQueue;
let highlightPosition;
let startTime;

function startGame() {
  console.log('Game started!');

  const scoreItem = {
    name: gamerName.value,
    milliseconds: 0
  }
  scores.push(scoreItem);
  console.log('The scores array is now', scores);

  document.body.className = '';
  start.className = 'started';
  setTimeout(() => { start.className = 'button'; }, 2000);

  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quoteText = quotes[quoteIndex];

  wordQueue = quoteText.split(' ');
  quote.innerHTML = wordQueue.map(word => (`<span>${word}</span>`)).join('');

  highlightPosition = 0;
  quote.childNodes[highlightPosition].className = 'highlight';

  startTime = new Date().getTime();
}
start.addEventListener('click', startGame);
input.addEventListener('input', checkInput);

function checkInput() {
  console.log('Checking', input.value);

  const currentWord = wordQueue[0].replaceAll('.', '').replaceAll(',', '');
  const typedValue = input.value.trim();
  if (currentWord !== typedValue) {
    input.className = currentWord.startsWith(typedValue) ? '' : 'error';
    return;
  }

  wordQueue.shift(); // shift removes first item (0th item)
  input.value = ''; // empty textbox
  quote.childNodes[highlightPosition].className = '';

  if (wordQueue.length === 0) {
    gameOver();
    return;
  }

  highlightPosition++;
  quote.childNodes[highlightPosition].className = 'highlight';
}

function gameOver() {
  const elapsedTime = new Date().getTime() - startTime;
  document.body.className = 'winner';
  message.innerHTML = `<span class="congrats">Congratulations!</span><br>
  You finished in ${elapsedTime / 1000} seconds.`

  const lastScoreItem = scores.pop();
  lastScoreItem.milliseconds = elapsedTime;
  scores.push(lastScoreItem);
  console.log('The scores array at the end of the game is ', scores);
  saveScores();

  //clear out old list
  while (scoresUnorderedList.firstChild) {
    scoresUnorderedList.removeChild(scoresUnorderedList.firstChild);
  }
  // rebuild list with new score
  for (let score of getScores()) {
    const li = createElementForScore(score);
    console.log('li is ' + li);
    scoresUnorderedList.appendChild(li);
  }
}

function getScores() {
  const noScoresFound = '[]';
  const scoresJSON = localStorage.getItem('scores') || noScoresFound;
  return JSON.parse(scoresJSON);
}

function saveScores() {
  const data = JSON.stringify(scores);
  localStorage.setItem('scores', data);
}

function createElementForScore(score) {
  const template = document.getElementById('score-item-template');
  const newListItem = template.content.cloneNode(true);

  const text = newListItem.querySelector('.score-text');
  text.innerText = score.name + 'in ' + score.milliseconds / 1000 + 'seconds.';
  return newListItem
}