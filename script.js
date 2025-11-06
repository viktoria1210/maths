let score = 0;
let timeLeft = 30;
let timer;
let currentQuestion;
let questionCount = 0;
const maxQuestions = 15;
let currentLevel;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionElem = document.getElementById('question');
const answersElem = document.getElementById('answers');
const timerElem = document.getElementById('timer');
const scoreElem = document.getElementById('score');
const finalScoreElem = document.getElementById('final-score');

const easyBtn = document.getElementById('start-easy');
const averageBtn = document.getElementById('start-average');
const difficultBtn = document.getElementById('start-difficult');
const compareBtn = document.getElementById('start-compare');
const restartBtn = document.getElementById('restart-btn');

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерація питань
function generateQuestion(level) {
    let a, b, op;
    let options = [];
    if(level === 'easy') {
        a = randomInt(1, 10);
        b = randomInt(1, 10);
        op = ['+', '-', '*'][randomInt(0,2)];
        const correct = eval(`${a} ${op} ${b}`);
        options = new Set([correct]);
        while(options.size < 5) {
            options.add(correct + randomInt(-5,5));
        }
        return {question:`${a} ${op} ${b}`, correct:correct, options:Array.from(options).sort(()=>Math.random()-0.5)};
    } 
    else if(level === 'average') {
        a = randomInt(10, 99);
        b = randomInt(1, 20);
        op = ['+', '-', '*', '/'][randomInt(0,3)];
        let correct = (op === '/') ? Math.floor(a/b) : eval(`${a} ${op} ${b}`);
        options = new Set([correct]);
        while(options.size < 5) {
            options.add(correct + randomInt(-5,5));
        }
        return {question:`${a} ${op} ${b}`, correct:correct, options:Array.from(options).sort(()=>Math.random()-0.5)};
    }
    else if(level === 'difficult') {
        a = randomInt(100, 999);
        b = randomInt(1, 9); // легше множення
        op = ['+', '-', '*', '/'][randomInt(0,3)];
        let correct = (op === '/') ? Math.floor(a/b) : eval(`${a} ${op} ${b}`);
        options = new Set([correct]);
        while(options.size < 5) {
            options.add(correct + randomInt(-10,10));
        }
        return {question:`${a} ${op} ${b}`, correct:correct, options:Array.from(options).sort(()=>Math.random()-0.5)};
    }
    else if(level === 'compare') {
        a = randomInt(1,50);
        b = randomInt(1,50);
        op = ['>','<','==='][randomInt(0,2)];
        const correct = eval(`${a} ${op} ${b}`);
        // Для порівняння варіанти тільки true/false
        options = [true,false];
        return {question:`${a} ${op} ${b}`, correct:correct, options:options};
    }
}

// Завантаження наступного питання
function loadNext(level) {
    if(questionCount >= maxQuestions) {
        endQuiz();
        return;
    }
    questionCount++;
    currentQuestion = generateQuestion(level);
    questionElem.textContent = currentQuestion.question;
    answersElem.innerHTML = '';
    currentQuestion.options.forEach(opt => {
        const div = document.createElement('div');
        div.classList.add('answer');
        div.textContent = opt;
        div.onclick = () => handleAnswer(opt);
        answersElem.appendChild(div);
    });
}

function handleAnswer(answer) {
    let correct = answer;
    if(typeof currentQuestion.correct === "boolean") {
        correct = (answer === currentQuestion.correct);
    } else {
        correct = (Number(answer) === currentQuestion.correct);
    }

    const allAnswers = document.querySelectorAll('.answer');
    allAnswers.forEach(el => {
        if(el.textContent == currentQuestion.correct || el.textContent == String(currentQuestion.correct)) {
            el.classList.add('correct');
        } else {
            el.classList.add('wrong');
        }
    });

    if(correct) score++;
    updateScore();

    setTimeout(() => loadNext(currentLevel), 600);
}

function startQuiz(level) {
    currentLevel = level;
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');
    score = 0;
    questionCount = 0;
    timeLeft = 30;
    updateScore();
    startTimer();
    loadNext(level);
}

function startTimer() {
    clearInterval(timer);
    timerElem.textContent = `Час: ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        timerElem.textContent = `Час: ${timeLeft}`;
        if(timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

function updateScore() {
    scoreElem.textContent = `Балів: ${score}`;
}

function endQuiz() {
    clearInterval(timer);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    finalScoreElem.textContent = `Твій результат: ${score} з ${maxQuestions}`;
    easyBtn.style.display='none'
    averageBtn.style.display='none'
    difficultBtn.style.display='none'
    compareBtn.style.display='none'
}

// Прив'язка кнопок
easyBtn.onclick = () => startQuiz('easy');
averageBtn.onclick = () => startQuiz('average');
difficultBtn.onclick = () => startQuiz('difficult');
compareBtn.onclick = () => startQuiz('compare');
restartBtn.onclick = () => startQuiz(currentLevel);
