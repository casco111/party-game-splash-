document.title = "Find the Imposter - Questions";

// Game variables
let players = [];
let currentPlayerIndex = -1;
let imposterPlayers = [];
let timeLeft = 20;
let timer;
let isPlaying = false;
let wordCount = 0;
let roundNumber = 1;
let currentQuestions = [];
let answers = [];
let imposterItems = [];

let options = {
    timeMultiplier: 1.0,
    useDefaultPack:true

};
// Categories
let categories = [
];


// DOM elements
const setupSection = document.getElementById('setupSection');
const wordListSection = document.getElementById('wordListSection');
const wordListSectionIframe = document.getElementById('text-to-data-iframe');
const gameSection = document.getElementById('gameSection');
const categoryDisplay = document.getElementById('question');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const roundNumberDisplay = document.getElementById('roundNumber');
const wordCountDisplay = document.getElementById('wordCount');
const revealButton = document.getElementById('showButton');
const asnwerInput = document.getElementById('answer');
const listContainer = document.getElementById('listContainer');
const revealImposterButton = document.getElementById('revealImposter');
const revealSection = document.getElementById('revealSection');
const settingsIframe = document.getElementById('settingsIframe');


nextBtn.addEventListener('click', nextPlayer);
restartBtn.addEventListener('click', restartGame);
revealButton.addEventListener('click', revealQuestion);
revealImposterButton.addEventListener('click', revealImposter);

window.addEventListener('message', (event) => {
    // Optionally check event.origin here for security
    const data = event.data;

    if (data.type === 'playerSelectDone') {
        players = data.players;
        setupSection.classList.add('hidden');
        wordListSection.classList.remove('hidden');
        wordListSectionIframe.classList.remove("hidden")
        wordListSectionIframe.contentWindow.postMessage({ type: 'start-text-to-date', mode: 'questions' }, '*');
    }
    if (data.type === 'text-to-data-done') {
        //categories = data.categories;
        wordListSectionIframe.classList.add("hidden")
        settingsIframe.classList.remove('hidden')
        setCategories(data.categories);
        settingsIframe.contentWindow.postMessage({ type: 'startSettings', mode: 'questions', settings:options}, '*');
    }
    if (data.type === 'settingsDone') {
        //categories = data.categories;
        wordListSection.classList.add('hidden');
        settingsIframe.classList.add('hidden')
        options = data.settings;
        console.log(options);
        startGame();
    }
});


// Load saved players when page loads







function startGame() {
    if (players.length < 2) return;
    console.log("start")
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    revealSection.classList.add("hidden")
   
    isPlaying = true;
    roundNumber = 1;
    currentPlayerIndex = -1;
    answers = [];
    listContainer.innerHTML="";

    hideQuestion();
    selectNextPlayer();
    loadNewQuestionCategory()
}

function nextPlayer() {
    if (!isPlaying) return;
    answers.push({player:players[currentPlayerIndex], answer:asnwerInput.value, isImposter:imposterPlayers.includes(currentPlayerIndex)})
    hideQuestion();
    selectNextPlayer();
}



function revealQuestion() {
    revealButton.classList.add('hidden');
    asnwerInput.classList.remove('hidden');
    asnwerInput.value = "";
    nextBtn.classList.remove('hidden');
    const q = currentQuestions[currentPlayerIndex]
    categoryDisplay.textContent = q;

}

function hideQuestion() {
    revealButton.classList.remove('hidden');
    asnwerInput.classList.add('hidden');
    nextBtn.classList.add('hidden');
    categoryDisplay.textContent = "Question is hidden";
}

function loadNewQuestionCategory() {
    let currentCategory = categories[Math.floor(Math.random() * categories.length)];
    currentQuestions = [];
    imposterPlayers = [];
    if (currentCategory.length < 2) loadNewQuestionCategory();
    let r = Math.floor(Math.random() * currentCategory.length)
    let s = r;
    while (r == s) s = Math.floor(Math.random() * currentCategory.length)
    let t = Math.floor(Math.random() * players.length)
    for (let i = 0; i < players.length; i++) {
        if (i == t) currentQuestions.push(currentCategory[r]);
        else currentQuestions.push(currentCategory[s]);
    }
    imposterPlayers.push(t);
}

function selectNextPlayer() {
    // If all players have been used, reset and start new round
    if (++currentPlayerIndex >= players.length) {
        revealAnswers();

    }

    let selectedPlayer = players[currentPlayerIndex]
    currentPlayerDisplay.textContent = selectedPlayer;
}




function updateRoundInfo() {
    roundNumberDisplay.textContent = roundNumber;
}


function revealAnswers() {
    nextBtn.classList.add('hidden')
    nextBtn.classList.add('hidden')

    let imposters = [];
    answers.forEach((e)=>{
        const newItem = document.createElement('span');
        newItem.classList.add('list-item');
        newItem.textContent = e.player + ": " + e.answer;
        listContainer.appendChild(newItem);
        if(e.isImposter)imposters.push(newItem);
    });
   imposterItems = imposters;
   revealSection.classList.remove("hidden")
   gameSection.classList.add("hidden");
    // Append it to the container
    
}

function revealImposter(){
    imposterItems.forEach((e)=>{
        console.log(e)
        e.style.backgroundColor = '#dc3545'
    })

}

function restartGame() {
    startGame();
}

function endGame() {
    isPlaying = false;

}

function setCategories(cats) {
    cats.forEach((cat, i) => {
        const parts = cat.text.split(',')
        categories.push(parts);

    });
    console.log(categories)
}