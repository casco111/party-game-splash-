// Get URL parameters to access data from main page
const urlParams = new URLSearchParams(window.location.search);
const gameType = urlParams.get('game');
const gameTitle = urlParams.get('title');

// Alternative: Get data from localStorage
const storedGame = localStorage.getItem('currentGame');
const storedTitle = localStorage.getItem('gameTitle');
const storedDescription = localStorage.getItem('gameDescription');

console.log('Game type (URL):', gameType);
console.log('Game title (URL):', gameTitle);
console.log('Game type (localStorage):', storedGame);
console.log('Game title (localStorage):', storedTitle);
console.log('Game description (localStorage):', storedDescription);

// Update the page title if data is available
if (gameTitle) {
    document.title = gameTitle;
    document.querySelector('h1').textContent = gameTitle;
} else if (storedTitle) {
    document.title = storedTitle;
    document.querySelector('h1').textContent = storedTitle;
}

// Game variables
let players = [];
let currentPlayerIndex = 0;
let timeLeft = 20;
let timer;
let isPlaying = false;
let wordCount = 0;
let roundNumber = 1;
let currentCategory = '';
let usedPlayers = [];
let currentInterval = 0;
let timeIntervals = [20, 10, 5];
let intervalSwitchCount = [2, 4]; //per player

let options = {
    timeMultiplier:1.0

};
// Categories
let categories = [
  ];
  

// DOM elements
const setupSection = document.getElementById('setupSection');
const wordListSection = document.getElementById('wordListSection');
const wordListSectionIframe = document.getElementById('text-to-data-iframe');
const gameSection = document.getElementById('gameSection');
const categoryDisplay = document.getElementById('category');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const timerDisplay = document.getElementById('timer');
const bombDisplay = document.getElementById('bomb');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const roundNumberDisplay = document.getElementById('roundNumber');
const wordCountDisplay = document.getElementById('wordCount');


nextBtn.addEventListener('click', nextPlayer);
restartBtn.addEventListener('click', restartGame);

window.addEventListener('message', (event) => {
    // Optionally check event.origin here for security
    const data = event.data;
   
    if(data.type === 'playerSelectDone'){
        players = data.players;
        setupSection.classList.add('hidden');
        wordListSection.classList.remove('hidden');
        window.postMessage({ type: 'start-text-to-date', mode:'bomb' }, '*');
        wordListSectionIframe.contentWindow.postMessage({ type: 'start-text-to-date', mode:'bomb' }, '*');
    }
    if(data.type === 'text-to-data-done'){
        //categories = data.categories;
        wordListSection.classList.add('hidden');
        setCategories(data.categories);
        startGame();
    }
  });


// Load saved players when page loads




function startGame() {
    if (players.length < 2) return;
    console.log("start")
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    
    isPlaying = true;
    wordCount = 0;
    roundNumber = 1;
    usedPlayers = [];
    currentInterval = 0;
    timeLeft = timeIntervals[currentInterval];
    
    bombDisplay.classList.remove('exploding');
    bombDisplay.textContent = '💣';
    bombDisplay.style.color = '#333';
    bombDisplay.style.fontSize = '4rem';

    updateRoundInfo();
    updateTimer();
    loadNewCategory();
    selectRandomPlayer();
    startTimer();
}

function loadNewCategory() {
    currentCategory = categories[Math.floor(Math.random() * categories.length)];
    categoryDisplay.textContent = currentCategory;
}

function selectRandomPlayer() {
    // If all players have been used, reset and start new round
    if (usedPlayers.length >= players.length) {
        usedPlayers = [];
        roundNumber++;
        updateRoundInfo();
    }
    
    // Select random player that hasn't been used this round
    let availablePlayers = players.filter(player => !usedPlayers.includes(player));
    let randomIndex = Math.floor(Math.random() * availablePlayers.length);
    let selectedPlayer = availablePlayers[randomIndex];
    
    usedPlayers.push(selectedPlayer);
    currentPlayerDisplay.textContent = selectedPlayer;
}

function nextPlayer() {
    if (!isPlaying) return;
    
    // Count the word (player said a word)
    wordCount++;
    updateRoundInfo();
    
    // Reset timer
    clearInterval(timer);
    if(wordCount / players.length > intervalSwitchCount[currentInterval]) {
        currentInterval++;
    }
    currentInterval = Math.min(currentInterval, timeIntervals.length - 1);
    timeLeft = timeIntervals[currentInterval];
    
    updateTimer();
   
    
    // Select next player
    selectRandomPlayer();
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 10) {
            bombDisplay.classList.add('exploding');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            bombDisplay.classList.remove('exploding');
            bombDisplay.textContent = '💥';
            bombDisplay.style.color = '#dc3545';
            bombDisplay.style.fontSize = '6rem';
            nextBtn.classList.add('hidden')
            
            setTimeout(() => {
                endGame();
            }, 2000);
        }
    }, 1000);
}

function updateTimer() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#dc3545';
    } else {
        timerDisplay.style.color = '#333';
    }
}

function updateRoundInfo() {
    roundNumberDisplay.textContent = roundNumber;
    wordCountDisplay.textContent = wordCount;
}

function restartGame() {
    // Reset game state
    nextBtn.classList.remove('hidden')
    startGame();
}

function endGame() {
    isPlaying = false;
    clearInterval(timer);
    
    const currentPlayer = currentPlayerDisplay.textContent;
    categoryDisplay.innerHTML = `<span class="game-over">💥 ${currentPlayer} hat die Bombe gehalten!</span>`;
    currentPlayerDisplay.textContent = `Spiel beendet - ${wordCount} Wörter gefunden`;
    timerDisplay.textContent = '0';
    
}

function resetGame() {
   
    setupSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    players = [];
    updatePlayersList();
    updateStartButton();
    savePlayers(); // Save empty array to localStorage
}
function setCategories(cats){
    cats.forEach((cat, i) => {
        const parts = cat.text.split(',')
        parts.forEach(element => {
            categories.push(element);
        });
        
      });
      console.log(categories)
}