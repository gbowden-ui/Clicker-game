// Game State
let gameState = {
    score: 0,
    perClick: 1,
    perSecond: 0,
    upgrades: [
        { id: 1, name: 'Better Click', cost: 10, value: 1, type: 'click', owned: 0 },
        { id: 2, name: 'Auto Clicker', cost: 50, value: 1, type: 'second', owned: 0 },
        { id: 3, name: 'Power Click', cost: 100, value: 5, type: 'click', owned: 0 },
        { id: 4, name: 'Super Auto', cost: 200, value: 10, type: 'second', owned: 0 }
    ]
};

// DOM Elements
const scoreDisplay = document.getElementById('score');
const perClickDisplay = document.getElementById('perClick');
const perSecondDisplay = document.getElementById('perSecond');
const clickButton = document.getElementById('clickButton');
const clickFeedback = document.getElementById('clickFeedback');
const resetButton = document.getElementById('resetButton');
const upgradeBtns = document.querySelectorAll('.upgrade-btn');

// Load game state from localStorage
function loadGame() {
    const saved = localStorage.getItem('clickerGameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
    updateDisplay();
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('clickerGameState', JSON.stringify(gameState));
}

// Update all displays
function updateDisplay() {
    scoreDisplay.textContent = formatNumber(gameState.score);
    perClickDisplay.textContent = gameState.perClick;
    perSecondDisplay.textContent = gameState.perSecond;
    
    // Update upgrade buttons
    upgradeBtns.forEach((btn, index) => {
        const upgrade = gameState.upgrades[index];
        const costSpan = btn.querySelector('.upgrade-cost span');
        costSpan.textContent = upgrade.cost;
        
        if (gameState.score >= upgrade.cost) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// Click handler
function handleClick() {
    gameState.score += gameState.perClick;
    
    // Show click feedback
    clickFeedback.textContent = '+' + gameState.perClick;
    clickFeedback.classList.remove('show');
    void clickFeedback.offsetWidth; // Trigger reflow
    clickFeedback.classList.add('show');
    
    updateDisplay();
    saveGame();
}

// Upgrade handler
function handleUpgrade(upgradeIndex) {
    const upgrade = gameState.upgrades[upgradeIndex];
    
    if (gameState.score >= upgrade.cost) {
        gameState.score -= upgrade.cost;
        upgrade.owned++;
        
        if (upgrade.type === 'click') {
            gameState.perClick += upgrade.value;
        } else if (upgrade.type === 'second') {
            gameState.perSecond += upgrade.value;
        }
        
        // Increase cost for next purchase
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        
        updateDisplay();
        saveGame();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset the game? This cannot be undone!')) {
        gameState = {
            score: 0,
            perClick: 1,
            perSecond: 0,
            upgrades: [
                { id: 1, name: 'Better Click', cost: 10, value: 1, type: 'click', owned: 0 },
                { id: 2, name: 'Auto Clicker', cost: 50, value: 1, type: 'second', owned: 0 },
                { id: 3, name: 'Power Click', cost: 100, value: 5, type: 'click', owned: 0 },
                { id: 4, name: 'Super Auto', cost: 200, value: 10, type: 'second', owned: 0 }
            ]
        };
        updateDisplay();
        saveGame();
    }
}

// Passive income (per second)
function addPassiveIncome() {
    gameState.score += gameState.perSecond;
    if (gameState.perSecond > 0) {
        updateDisplay();
        saveGame();
    }
}

// Event listeners
clickButton.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);

upgradeBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => handleUpgrade(index));
});

// Passive income every second
setInterval(addPassiveIncome, 1000);

// Initialize game
loadGame();
