// State management
let currentQuestionIndex = 0;
let yesCount = 0;

// Questions array
const questions = [
    "Are you absolutely sure? 🥺",
    "But think about all the chocolates! 🍫",
    "And the roses! 🌹",
    "And the romantic dinners! 🍝",
    "One last chance to change your mind? 💕"
];

// DOM Elements
const landingPage = document.getElementById('landingPage');
const questionsPage = document.getElementById('questionsPage');
const loadingPage = document.getElementById('loadingPage');
const destinyPage = document.getElementById('destinyPage');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionYesBtn = document.getElementById('questionYesBtn');
const questionNoBtn = document.getElementById('questionNoBtn');
const questionText = document.getElementById('questionText');
const questionCounter = document.getElementById('questionCounter');
const acceptDestinyBtn = document.getElementById('acceptDestinyBtn');

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = Math.random() * 30 + 10 + 'px';
    heart.style.setProperty('--duration', Math.random() * 4 + 3 + 's');
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Create hearts periodically
setInterval(createHeart, 500);

// Confetti function
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = -10 + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = `hsl(${Math.random() * 60 + 300}, 100%, 50%)`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear`;
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
`;
document.head.appendChild(style);

// Show loading page function
function showLoadingPage() {
    landingPage.classList.add('hidden');
    questionsPage.classList.add('hidden');
    destinyPage.classList.add('hidden');
    loadingPage.classList.remove('hidden');

    // Create more hearts during loading
    const heartInterval = setInterval(createHeart, 100);

    setTimeout(() => {
        clearInterval(heartInterval);
        // You can redirect to your actual page here
        // For now, we'll just show a message
        window.location.href = 'valentine-page.html';
        loadingPage.classList.add('hidden');
        landingPage.classList.remove('hidden');
    }, 5000);
}

// Reset questions
function resetQuestions() {
    currentQuestionIndex = 0;
    yesCount = 0;
}

// Show next question or destiny
function showNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex];
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    } else {
        // All questions answered
        questionsPage.classList.add('hidden');
        destinyPage.classList.remove('hidden');
        resetQuestions();
    }
}

// Event Listeners
yesBtn.addEventListener('click', () => {
    createConfetti();
    showLoadingPage();
});

noBtn.addEventListener('click', () => {
    landingPage.classList.add('hidden');
    questionsPage.classList.remove('hidden');
    showNextQuestion();
});

questionYesBtn.addEventListener('click', () => {
    yesCount++;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showNextQuestion();
    } else {
        // All questions answered with at least one Yes
        questionsPage.classList.add('hidden');
        destinyPage.classList.remove('hidden');
        resetQuestions();
    }
});

questionNoBtn.addEventListener('click', () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showNextQuestion();
    } else {
        // All questions answered with all No's
        // But we still show the destiny page as per requirement
        questionsPage.classList.add('hidden');
        destinyPage.classList.remove('hidden');
        resetQuestions();
    }
});

acceptDestinyBtn.addEventListener('click', () => {
    createConfetti();
    showLoadingPage();
});

// Add hover effects for No button to make it playful
noBtn.addEventListener('mouseover', () => {
    const randomX = Math.random() * 100 - 50;
    const randomY = Math.random() * 100 - 50;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
});

noBtn.addEventListener('mouseout', () => {
    noBtn.style.transform = 'translate(0, 0)';
});

// Add floating animation to all buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Initialize with some hearts
for (let i = 0; i < 10; i++) {
    setTimeout(createHeart, i * 200);
}

// Add resize handler for responsive hearts
window.addEventListener('resize', () => {
    // Recalculate heart positions if needed
});