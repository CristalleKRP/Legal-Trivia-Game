const startButton = document.getElementById('start-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20; // 20 seconds per question

// Define questions for each category
const questions = {
    tort: [
        {
            question: "Which case established the modern law of negligence?",
            answers: [
                { text: "Mabo v Queensland", correct: false },
                { text: "Donoghue v Stevenson", correct: true },
                { text: "Carlill v Carbolic Smoke Ball Co", correct: false },
                { text: "R v Tang", correct: false }
            ]
        },
        {
            question: "What must be proven for negligence?",
            answers: [
                { text: "Duty of care, breach, causation, damage", correct: true },
                { text: "Mens rea and actus reus", correct: false },
                { text: "Offer and acceptance", correct: false },
                { text: "Intention to defraud", correct: false }
            ]
        }
    ],
    criminal: [
        {
            question: "Which case confirmed the principle of mens rea?",
            answers: [
                { text: "Woolmington v DPP", correct: true },
                { text: "Mabo v Queensland", correct: false },
                { text: "Donoghue v Stevenson", correct: false },
                { text: "Cole v Whitfield", correct: false }
            ]
        },
        {
            question: "Which Australian case ruled on provocation in criminal law?",
            answers: [
                { text: "R v Lindsay", correct: true },
                { text: "R v Tang", correct: false },
                { text: "R v Brown", correct: false },
                { text: "Carlill v Carbolic Smoke Ball Co", correct: false }
            ]
        }
    ],
    contract: [
        {
            question: "Which case established the concept of unilateral contracts?",
            answers: [
                { text: "Carlill v Carbolic Smoke Ball Co", correct: true },
                { text: "Mabo v Queensland", correct: false },
                { text: "Donoghue v Stevenson", correct: false },
                { text: "Woolmington v DPP", correct: false }
            ]
        },
        {
            question: "What is required to form a legally binding contract?",
            answers: [
                { text: "Offer, acceptance, consideration, intention", correct: true },
                { text: "Mens rea and actus reus", correct: false },
                { text: "Negligence and breach of duty", correct: false },
                { text: "Tortious conduct and damages", correct: false }
            ]
        },
        {
            question: "What principle was established in Balfour v Balfour?",
            answers: [
                { text: "Domestic agreements are not legally binding", correct: true },
                { text: "Promissory estoppel applies", correct: false },
                { text: "Consideration must move from the promisee", correct: false },
                { text: "A contract must be in writing", correct: false }
            ]
        }
    ]
};

// Event listener for category selection
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        currentQuestions = questions[category];
        startGame();
    });
});

// Function to start the game
function startGame() {
    categoryButtons.forEach(button => button.classList.add('hidden'));
    startButton.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 20; // Reset the timer
    scoreDisplay.innerText = `Score: ${score}`;
    setNextQuestion();
}

// Function to set the next question
function setNextQuestion() {
    resetState();
    startTimer(); // Start the timer for the next question
    showQuestion(currentQuestions[currentQuestionIndex]);
}

// Function to display the question and answers
function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });
}

// Function to reset the answer buttons
function resetState() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Function to handle answer selection
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;

    // Stop the timer when an answer is selected
    clearInterval(timer);

    // Show feedback for the answer
    if (correct) {
        selectedButton.classList.add('correct');
        score++; // Increase score for correct answers
    } else {
        selectedButton.classList.add('incorrect');
    }

    // Disable all buttons after an answer is selected
    const allButtons = answerButtons.querySelectorAll('button');
    allButtons.forEach(button => {
        button.disabled = true;
        if (button.dataset.correct) {
            button.classList.add('correct');
        }
    });

    // Update the score display
    scoreDisplay.innerText = `Score: ${score}`;

    // Move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            setNextQuestion();
        } else {
            startButton.innerText = 'Restart';
            startButton.classList.remove('hidden');
            questionContainer.classList.add('hidden');
            categoryButtons.forEach(button => button.classList.remove('hidden'));
        }
    }, 1000); // 1 second delay before next question
}

// Function to start the countdown timer
function startTimer() {
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer when time is up
            selectAnswer({ target: { dataset: { correct: false } } }); // Automatically mark it as wrong and move to the next question
        }
    }, 1000); // Update the timer every second
}
