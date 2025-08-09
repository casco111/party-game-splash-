const playerNameInput = document.getElementById('playerNameInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const startGameBtn = document.getElementById('startGameBtn');

let players = [];

// Event listeners
addPlayerBtn.addEventListener('click', addPlayer);
startGameBtn.addEventListener('click', startGame);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});
document.addEventListener('DOMContentLoaded', loadSavedPlayers);

// Load saved players from localStorage
function loadSavedPlayers() {
    const savedPlayers = localStorage.getItem('bombGamePlayers');
    console.log(savedPlayers);
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
        updatePlayersList();
        updateStartButton();

    }

}

// Save players to localStorage
function savePlayers() {
    localStorage.setItem('bombGamePlayers', JSON.stringify(players));
}



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

function startGame(){
    console.log("start game")
    window.parent.postMessage({ type: 'playerSelectDone', players }, '*');
}