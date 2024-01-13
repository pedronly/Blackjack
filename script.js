let playerHand = [];
let dealerHand = [];
let roundEnded = false;
let initialPlayerMoney = 100;
let playerMoney = initialPlayerMoney;
let currentBet = 0;
let deck = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const suits = ['♠', '♣', '♥', '♦'];

for (const suit of suits) {
    for (let i = 2; i <= 10; i++) {
        deck.push({ value: i, suit });
    }
    deck.push({ value: 'J', suit });
    deck.push({ value: 'Q', suit });
    deck.push({ value: 'K', suit });
    deck.push({ value: 'A', suit });
}

function calculateHandScore(hand) {
    let score = 0;
    let numAces = 0;

    for (const card of hand) {
        if (card.value === 'A') {
            numAces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += card.value;
        }
    }

    while (numAces > 0 && score > 21) {
        score -= 10;
        numAces--;
    }

    return score;
}


function renderHands() {
    renderHand(dealerHand, 'dealer-hand', roundEnded);
    renderHand(playerHand, 'player-hand');


    const dealerScoreElement = document.getElementById('dealer-score');
    const playerScoreElement = document.getElementById('player-score');

    dealerScoreElement.textContent = `Pontuação: ${calculateHandScore(dealerHand)}`;
    playerScoreElement.textContent = `Pontuação: ${calculateHandScore(playerHand)}`;
}


function renderHand(hand, containerId, hideDealerHand) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

  
        if (hideDealerHand && containerId === 'dealer-hand' && i === 1) {
            cardElement.textContent = '🂠';
            cardElement.classList.add('face-down');
        } else {
            cardElement.textContent = card.value + card.suit;
        }

        container.appendChild(cardElement);
    }
}

function deal() {
    roundEnded = false;

    shuffleArray(deck);

    playerHand = [];
    dealerHand = [];

    if (playerMoney >= currentBet) {
        playerMoney -= currentBet;

        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());

        renderHands();

        const dealerSecondCard = document.querySelector('#dealer-hand .card:nth-child(2)');
        if (dealerSecondCard) {
            dealerSecondCard.classList.add('face-down');
        }

        const playerMoneyElement = document.getElementById('player-money');
        playerMoneyElement.textContent = `Dinheiro: $${playerMoney}`;

        const dealButton = document.getElementById('deal-button');
        const hitButton = document.getElementById('hit-button');
        const standButton = document.getElementById('stand-button');
        
        dealButton.disabled = true;
        hitButton.disabled = false;
        standButton.disabled = false;
    } else {
        console.log('Saldo insuficiente para a aposta.');
    }
}

function endGame(message) {
    const dealerSecondCard = document.querySelector('#dealer-hand .card:nth-child(2)');
    if (dealerSecondCard) {
        dealerSecondCard.classList.remove('face-down');
    }

    const resultElement = document.getElementById('result');
    resultElement.textContent = message;


    const dealButton = document.getElementById('deal-button');
    dealButton.disabled = false;


    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    
    hitButton.disabled = true;
    standButton.disabled = true;


    if (message.includes('Jogador vence!')) {
        playerMoney += currentBet * 2; 
    } else if (message.includes('Empate!')) {
        playerMoney += currentBet;  
    }

    currentBet = 0;

    const playerMoneyElement = document.getElementById('player-money');
    playerMoneyElement.textContent = `Dinheiro: $${playerMoney}`;
}

function hit() {
    if (!roundEnded) {
        playerHand.push(deck.pop());


        renderHands();

        if (calculateHandScore(playerHand) > 21) {
            endGame('Jogador estourou! Dealer vence.');
        }
    }
}

function dealerHit() {
    while (calculateHandScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }

    renderHands();

    if (calculateHandScore(dealerHand) > 21) {
        endGame('Dealer estourou! Jogador vence.');
    } else {
        determineWinner();
    }
}

function stand() {
    const dealerSecondCard = document.querySelector('#dealer-hand .card:nth-child(2)');
    if (dealerSecondCard) {
        dealerSecondCard.classList.remove('face-down');
    }

    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    
    hitButton.disabled = true;
    standButton.disabled = true;


    dealerHit();
}

function determineWinner() {
    roundEnded = true; // A rodada terminou

    const playerScore = calculateHandScore(playerHand);
    const dealerScore = calculateHandScore(dealerHand);

    if (playerScore > 21) {
        endGame('Jogador estourou! Dealer vence.');
    } else if (dealerScore > 21) {
        endGame('Dealer estourou! Jogador vence.');
    } else if (playerScore > dealerScore) {
        endGame('Jogador vence!');
    } else if (dealerScore > playerScore) {
        endGame('Dealer vence!');
    } else {
        endGame('Empate!');
    }
}

// Event Listeners
document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);

// Iniciar o jogo
const resultElement = document.getElementById('result');
const playerMoneyElement = document.getElementById('player-money');

// Atualizar a exibição inicial do dinheiro do jogador
playerMoneyElement.textContent = `Dinheiro: $${initialPlayerMoney}`;
deal();
