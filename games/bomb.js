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
let intervalSwitchCount = [2, 3]; //per player

// Categories
const categories = [
    "Fliegende Dinge",
    "Tiere",
    "Farben",
    "Berufe",
    "Sportarten",
    "Essen & Trinken",
    "Städte & Länder",
    "Filme & Serien",
    "Musikinstrumente",
    "Körperteile",
    "Pflanzen",
    "Fahrzeuge",
    "Technologie",
    "Möbel",
    "Wetter",
    "Gefühle",
    "Schulfächer",
    "Spiele",
    "Werkzeuge",
    "Naturphänomene",
    "Kleidung",
    "Baumaterialien",
    "Hobby & Freizeit",
    "Getränke",
    "Bücher & Literatur",
    "Berühmte Persönlichkeiten",
    "Mythologie",
    "Raum & Planeten",
    "Feiertage",
    "Instrumente",
    "Tanzstile",
    "Märchen & Fabelwesen",
    "Elektronik",
    "Wissenschaft",
    "Politik",
    "Religion",
    "Märkte & Geschäfte",
    "Verkehrsmittel",
    "Sprachen",
    "Musikgenres",
    "Kunstformen",
    "Bauwerke",
    "Mathematik",
    "Gesundheit & Medizin",
    "Haustiere",
    "Meerestiere",
    "Insekten",
    "Berufe im Krankenhaus",
    "Camping & Outdoor",
    "Superhelden",
    "Automarken"
  ];
  

// DOM elements
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const playerNameInput = document.getElementById('playerNameInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const startGameBtn = document.getElementById('startGameBtn');
const categoryDisplay = document.getElementById('category');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const timerDisplay = document.getElementById('timer');
const bombDisplay = document.getElementById('bomb');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const roundNumberDisplay = document.getElementById('roundNumber');
const wordCountDisplay = document.getElementById('wordCount');

// Load saved players from localStorage
function loadSavedPlayers() {
    const savedPlayers = localStorage.getItem('bombGamePlayers');
    console.log(savedPlayers);
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
        updatePlayersList();
        updateStartButton();
        restartGame()
    }

}

// Save players to localStorage
function savePlayers() {
    localStorage.setItem('bombGamePlayers', JSON.stringify(players));
}

// Event listeners
addPlayerBtn.addEventListener('click', addPlayer);
startGameBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextPlayer);
restartBtn.addEventListener('click', restartGame);

playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});
// Load saved players when page loads
document.addEventListener('DOMContentLoaded', loadSavedPlayers);
function addPlayer() {
    const name = playerNameInput.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        playerNameInput.value = '';
        updatePlayersList();
        updateStartButton();
        savePlayers(); // Save to localStorage
    }
}

function removePlayer(name) {
    players = players.filter(player => player !== name);
    updatePlayersList();
    updateStartButton();
    savePlayers(); // Save to localStorage
}

function updatePlayersList() {
    playersList.innerHTML = '';
    players.forEach(player => {
        const playerTag = document.createElement('span');
        playerTag.className = 'player-tag';
        playerTag.innerHTML = `
            ${player}
            <button class="remove-player" onclick="removePlayer('${player}')">×</button>
        `;
        playersList.appendChild(playerTag);
    });
}

function updateStartButton() {
    startGameBtn.disabled = players.length < 2;
}

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
    
    updateRoundInfo();
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
    currentPlayerDisplay.textContent = `Aktueller Spieler: ${selectedPlayer}`;
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
    bombDisplay.classList.remove('exploding');
    bombDisplay.textContent = '💣';
    bombDisplay.style.color = '#333';
    bombDisplay.style.fontSize = '4rem';
    
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
    isPlaying = true;
    wordCount = 0;
    roundNumber = 1;
    usedPlayers = [];
    currentInterval = 0;
    
    // Reset UI
    updateRoundInfo();
    loadNewCategory();
    selectRandomPlayer();
    startTimer();
    
    // Reset bomb display
    bombDisplay.classList.remove('exploding');
    bombDisplay.textContent = '💣';
    bombDisplay.style.color = '#333';
    bombDisplay.style.fontSize = '4rem';
    
    // Reset timer
    timeLeft = 20;
    updateTimer();
    
    // Reset category and player display
    categoryDisplay.textContent = currentCategory;
    currentPlayerDisplay.textContent = `Aktueller Spieler: ${usedPlayers[usedPlayers.length - 1]}`;
}

function endGame() {
    isPlaying = false;
    clearInterval(timer);
    
    const currentPlayer = currentPlayerDisplay.textContent.replace('Aktueller Spieler: ', '');
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
