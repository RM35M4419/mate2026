let allProblems = [];
let filteredProblems = [];
let currentProblemIndex = 0;

const characters = [
    { name: "Qifrey", image: "img/Qifrey.png", quote: "El dibujo de un círculo es la base de toda magia, y el cálculo su corazón." },
    { name: "Coco", image: "img/Coco.png", quote: "¡He aprendido un nuevo hechizo de suma! ¿Puedes ayudarme?" },
    { name: "Agott", image: "img/Agott.png", quote: "La precisión es fundamental en el dibujo de runas. No te equivoques." },
    { name: "Tetia", image: "img/Tetia.png", quote: "¡Felicidades! Cada problema resuelto es como una nueva estrella en el cielo." },
    { name: "Richeh", image: "img/Richeh.png", quote: "Solo busco la magia que es única para mí, y eso requiere entender sus formas." }
];

const nameMapping = {
    "María": "Coco", "Juan": "Qifrey", "Ana": "Agott", "Pedro": "Olruggio", "Lucía": "Tetia", "Luis": "Richeh",
    "Tomás": "Qifrey", "Sofía": "Coco", "Carlos": "Olruggio", "Eva": "Agott", "Mateo": "Richeh", "Sandra": "Tetia",
    "Pablo": "Olruggio", "Laura": "Tetia"
};

const objectMapping = {
    "manzanas": "tinteros mágicos", "caramelos": "sellos rúnicos", "gatos": "dragones de papel", "perros": "pinceles mágicos",
    "bolitas": "gemas de luz", "lápices": "pinceles de varita", "flores": "flores de cristal de nieve", "figuritas": "cartas mágicas",
    "pesos": "monedas de plata", "libros": "grimorios", "estantes": "anaqueles de hechizos", "galletas": "bayas mágicas",
    "cinta": "cinta de conjuro", "cuerda": "cordel de plata", "chocolates": "pociones de energía"
};

// UI Elements
const problemText = document.getElementById('problem-text');
const answerInput = document.getElementById('answer-input');
const checkBtn = document.getElementById('check-btn');
const hintBtn = document.getElementById('hint-btn');
const nextBtn = document.getElementById('next-btn');
const feedback = document.getElementById('feedback');
const teacherQuote = document.getElementById('teacher-quote');
const characterImg = document.getElementById('character-img');

async function init() {
    try {
        const response = await fetch('data/problems.json');
        allProblems = await response.json();
        shuffle(allProblems);
        showProblem();
    } catch (err) {
        problemText.innerText = "Error al cargar los hechizos. Asegúrate de que el servidor esté activo.";
        console.error(err);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function tematize(text) {
    let newText = text;
    for (const [oldName, newName] of Object.entries(nameMapping)) {
        newText = newText.replace(new RegExp(oldName, 'g'), newName);
    }
    for (const [oldObj, newObj] of Object.entries(objectMapping)) {
        newText = newText.replace(new RegExp(oldObj, 'g'), newObj);
    }
    return newText;
}

function showProblem() {
    if (allProblems.length === 0) {
        problemText.innerText = "No hay problemas cargados.";
        return;
    }
    const problem = allProblems[currentProblemIndex];
    problemText.innerText = tematize(problem.question);
    
    const character = characters[Math.floor(Math.random() * characters.length)];
    teacherQuote.innerText = `"${character.quote}" — ${character.name}`;
    characterImg.style.backgroundImage = `url(${character.image})`;
    
    answerInput.value = '';
    feedback.innerText = '';
    feedback.className = 'feedback-msg';
    nextBtn.classList.add('hidden');
    checkBtn.disabled = false;
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = allProblems[currentProblemIndex].answer.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
        feedback.innerText = "¡Excelente! El hechizo ha funcionado a la perfección.";
        feedback.className = "feedback-msg correct";
        nextBtn.classList.remove('hidden');
        checkBtn.disabled = true;
    } else {
        feedback.innerText = "Algo ha fallado en el trazo. Inténtalo de nuevo.";
        feedback.className = "feedback-msg incorrect";
    }
}

function showHint() {
    feedback.innerText = `La respuesta correcta es: ${allProblems[currentProblemIndex].answer}`;
    feedback.className = "feedback-msg";
    nextBtn.classList.remove('hidden');
}

checkBtn.addEventListener('click', checkAnswer);
hintBtn.addEventListener('click', showHint);
nextBtn.addEventListener('click', () => {
    currentProblemIndex = (currentProblemIndex + 1) % allProblems.length;
    showProblem();
});
answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });

init();
