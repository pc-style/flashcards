const wordPairs = [
    ["borówka amerykańska", "blueberries"],
    ["praca mózgu", "brain function"],
    ["spokojny", "calm"],
    ["uspokoić się", "calm down"],
    ["podnieść na duchu", "cheer up"],
    ["skupić się", "concentrate"],
    ["uwalniać energię", "give energy"],
    ["bogaty w (magnez)", "high in (magnesium)"],
    ["rosnąć", "go up"],
    ["wprowadzać zmiany", "make changes"],
    ["zmiany nastroju", "mood changes"],
    ["groszek", "peas"],
    ["zmniejszać stres", "reduce stress"],
    ["nasiona, pestki", "seeds"],
    ["opuszczać posiłki", "skip meals"],
    ["produkty pełnoziarniste", "wholegrains"],
    ["soczewica", "lentils"],
    ["umysł", "mind"],
    ["reakcja alergiczna", "allergic reaction"],
    ["ból pleców", "backache"],
    ["mieć alergię (na coś)", "be allergic (to sth)"],
    ["wzmocnić układ odpornościowy", "boost the immune system"],
    ["przeziębić się", "catch a cold"],
    ["apteka", "chemist's"],
    ["zachorować na grypę", "come down with the flu"],
    ["kaszel; kasłać", "cough"],
    ["odwodnienie", "dehydration"],
    ["źle się czuć", "feel ill/unwell"],
    ["zwalczać infekcje", "fight off infections"],
    ["sezon grypowy", "flu season"],
    ["zatrucie pokarmowe", "food poisoning"],
    ["zarazki", "germs"],
    ["internista, lekarz rodzinny", "GP (general practitioner)"],
    ["płyn do dezynfekcji rąk", "hand sanitiser"],
    ["zawał serca", "heart attack"],
    ["boleć; obolały", "hurt"],
    ["umówić się na wizytę (u dentysty)", "make an appointment (with the dentist)"],
    ["zapobiegać chorobom", "prevent illnesses"],
    ["wysypka", "red spots/rash"],
    ["katar", "runny nose"],
    ["kichać", "sneeze"],
    ["bolące gardło", "sore throat"],
    ["objaw (czegoś)", "symptom (of sth)"],
    ["wziąć aspirynę", "take an aspirin"],
    ["brać leki/środki przeciwbólowe", "take medicine/painkillers"],
    ["leczenie", "treatment"],
    ["zapuszczać krople do nosa", "use nose drops"],
    ["ostrzeżenie", "warning"],
    ["ograniczyć", "cut down on"],
    ["zacząć się ruszać", "get active"],
    ["wysypiać się", "get enough sleep"],
    ["zrezygnować z czegoś", "give sth up"],
    ["mieć swój rytuał", "have a routine"],
    ["dbać o kondycję", "keep fit"],
    ["odpocząć", "rest"],
    ["pospać dłużej", "sleep in"],
    ["spędzać czas na świeżym powietrzu", "spend time outdoors"],
    ["nie kłaść się spać późno", "stay up"],
    ["dbać o siebie", "take care of yourself"],
    ["organizacja dobroczynna", "charity"],
    ["impreza, wydarzenie", "event"],
    ["bieg charytatywny", "fun run"],
    ["warsztaty", "workshop"]
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




// // Load tokens from tokens.json
// let tokens = {};

// fetch('tokens.json')
// .then(response => response.json())
// .then(data => tokens = data.tokens);

// // Hash function (e.g. SHA-256)
// function hashToken(token) {
// // Implement your own hash function here
// // For demonstration purposes, I'll use a simple hash function
// return crypto.createHash('sha256').update(token).digest('hex');
// }

// // Check if token is valid
// function isValidToken(hashedToken) {
// // Check if hashed token is in the tokens object
// return tokens[hashedToken] !== undefined;
// }

// // Process image with token
// async function processImage(file, hashedToken) {
// if (isValidToken(hashedToken)) {
//     // Process image with token
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('token', hashedToken);

//     try {
//     const response = await fetch('http://localhost:3003/process-image', {
//         method: 'POST',
//         body: formData
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return `const wordPairs = ${JSON.stringify(data.wordPairs, null, 2)};`;
//     } catch (error) {
//     console.error('Error:', error);
//     return null;
//     }
// } else {
//     alert('Invalid token');
// }
// }