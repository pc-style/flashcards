const wordPairs = [
    ["dodać", "add"],
    ["wołowina", "beef"],
    ["zmiksować", "blend"],
    ["miska", "bowl"],
    ["brokuły", "broccoli"],
    ["pudełko, opakowanie", "box"],
    ["karton", "carton"],
    ["płatki śniadaniowe", "cereal"],
    ["chili w proszku", "chilli powder"],
    ["śmietana", "cream"],
    ["serek kanapkowy", "cream cheese"],
    ["chipsy", "crisps"],
    ["ogórek", "cucumber"],
    ["pokroić", "cut"],
    ["produkty mleczne", "dairy"],
    ["pyszny", "delicious"],
    ["mąka", "flour"],
    ["smażyć", "fry"],
    ["zdrowy", "healthy"],
    ["miód", "honey"],
    ["składniki", "ingredients"],
    ["słoik", "jar"],
    ["oliwa z oliwek", "olive oil"],
    ["cebula", "onion"],
    ["paczka", "packet"],
    ["naleśnik", "pancake"],
    ["obrać", "peel"],
    ["szczypta (czegoś)", "pinch (of sth)"],
    ["papryka", "pepper"],
    ["pojemnik, kubeczek (np. jogurtu)", "pot"],
    ["krewetki", "prawns"],
    ["dynia", "pumpkin"],
    ["przepis", "recipe"],
    ["bułka", "roll"],
    ["łosoś", "salmon"],
    ["sól", "salt"],
    ["sos", "sauce"],
    ["owoce morza", "seafood"],
    ["podawać", "serve"],
    ["kwaśna śmietana", "sour cream"],
    ["przyprawy", "spices/seasoning"],
    ["szpinak", "spinach"],
    ["wycisnąć", "squeeze"],
    ["słodycze", "sweets"],
    ["muszle do taco", "taco shells"],
    ["smak", "taste"],
    ["smaczny", "tasty"],
    ["weganin; wegański", "vegan"],
    ["wegetarianin; wegetariański", "vegetarian"],
    ["jogurt", "yoghurt"],
    ["apka do liczenia kalorii", "calorie counter app"],
    ["liczyć kalorie", "count calories"],
    ["tłuszcz", "fat"],
    ["przestrzegać diety", "follow a diet"],
    ["schudnąć", "lose weight"],
    ["minerały", "minerals"],
    ["witaminy", "vitamins"],
    ["gotować", "boil"],
    ["posiekać", "chop"],
    ["schłodzić", "cool"],
    ["jednostka objętości równa ok, 240 ml", "cup (AmE)"],
    ["wymieszać", "mix"],
    ["płatki owsiane", "oats"],
    ["wlać", "pour"],
    ["przygotować", "prepare"],
    ["koktajl", "smoothie"],
    ["łyżka (czegoś)", "tablespoon (of sth)"],
    ["łyżeczka (czegoś)", "teaspoon (of sth)"],
];

let currentWords = [...wordPairs];
let successCount = 0;
let totalCount = 0;
let highScore = localStorage.getItem('highScore') || 0;
let streak = 0;
let isFlipping = false;
let soundEnabled = true;
const flipSound = document.getElementById('flipSound');
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');

const cardEl = document.querySelector('.card');
const polishWordEl = document.getElementById('polishWord');
const englishWordEl = document.getElementById('englishWord');
const successRateEl = document.getElementById('successRate');
const highScoreEl = document.getElementById('highScore');
const cardsLeftEl = document.getElementById('cardsLeft');
const failBtn = document.getElementById('failBtn');
const successBtn = document.getElementById('successBtn');
const newSessionBtn = document.getElementById('newSessionBtn');
const streakEl = document.getElementById('streakCount');
const progressEl = document.querySelector('.progress');

const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettings = document.getElementById('closeSettings');
const soundToggle = document.getElementById('soundToggle');
const themeSelect = document.getElementById('themeSelect');


function updateStats() {
    const successRate = totalCount === 0 ? 0 : Math.round((successCount / totalCount) * 100);
    successRateEl.textContent = `${successRate}%`;
    cardsLeftEl.textContent = currentWords.length;
    highScoreEl.textContent = `${highScore}%`;
    streakEl.textContent = streak;
    
    const progress = ((wordPairs.length - currentWords.length) / wordPairs.length) * 100;
    progressEl.style.width = `${progress}%`;
}

function showNewWord() {
    if (currentWords.length === 0) {
        endSession();
        return;
    }

    const randomIndex = Math.floor(Math.random() * currentWords.length);
    const [polish, english] = currentWords[randomIndex];
    
    cardEl.classList.add('flipping');
    
    setTimeout(() => {
        polishWordEl.textContent = polish;
        englishWordEl.textContent = english;
        cardEl.classList.remove('flipping');
    }, 300);

    currentWords.splice(randomIndex, 1);
    updateStats();
    if (cardEl.classList.contains('flipped')) {
        cardEl.classList.remove('flipped');
    }
}

function endSession() {
    const successRate = Math.round((successCount / totalCount) * 100);
    if (successRate > highScore) {
        highScore = successRate;
        localStorage.setItem('highScore', highScore);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    alert(`Session ended!\nSuccess rate: ${successRate}%\nTotal words: ${totalCount}\nStreak: ${streak}`);
}

function startNewSession() {
    currentWords = [...wordPairs];
    successCount = 0;
    totalCount = 0;
    streak = 0;
    updateStats();
    showNewWord();
}

function updateStreak(success) {
    if (success) {
        streak++;
    } else {
        streak = 0;
    }
    streakEl.textContent = streak;
}

function playSound(sound) {
    if (soundEnabled) {
        sound.currentTime = 0; // Reset the audio to the beginning
        sound.play();
    }
}

settingsBtn.addEventListener('click', () => {
    settingsPopup.style.display = 'block';
});

closeSettings.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
});

soundToggle.addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
});

themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.className = selectedTheme === 'animated' ? 'animated-bg' : `theme-${selectedTheme}`;
});

cardEl.addEventListener('click', () => {
    if (!isFlipping) {
        isFlipping = true;
        playSound(flipSound);
        cardEl.classList.add('flipping');
        
        setTimeout(() => {
            cardEl.classList.toggle('flipped');
            
            setTimeout(() => {
                cardEl.classList.remove('flipping');
                isFlipping = false;
            }, 100);
        }, 100);
    }
});

failBtn.addEventListener('click', () => {
    playSound(failSound);
    totalCount++;
    updateStreak(false);
    showNewWord();
});

successBtn.addEventListener('click', () => {
    playSound(successSound);
    successCount++;
    totalCount++;
    updateStreak(true);
    showNewWord();
});

newSessionBtn.addEventListener('click', startNewSession);

// Theme selector
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.body.className = `theme-${button.dataset.theme}`;
    });
});

startNewSession();