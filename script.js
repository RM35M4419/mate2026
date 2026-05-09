let problems = [];
let currentProblemIndex = 0;

const characters = [
    { name: "Qifrey", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-1843900064.jpg", quote: "El dibujo de un círculo es la base de toda magia, y el cálculo su corazón." },
    { name: "Olruggio", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-1962014057.jpg", quote: "Incluso los objetos mágicos más complejos se rigen por las leyes de los números." },
    { name: "Coco", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-1485654334.jpg", quote: "¡He aprendido un nuevo hechizo de suma! ¿Puedes ayudarme?" },
    { name: "Agott", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-11443936.jpg", quote: "La precisión es fundamental en el dibujo de runas. No te equivoques." },
    { name: "Tetia", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-1945622719.jpg", quote: "¡Felicidades! Cada problema resuelto es como una nueva estrella en el cielo." },
    { name: "Richeh", image: "https://ami.animecharactersdatabase.com/uploads/chars/thumbs/200/41903-795371726.jpg", quote: "Solo busco la magia que es única para mí, y eso requiere entender sus formas." }
];

const nameMapping = {
    "María": "Coco",
    "Juan": "Qifrey",
    "Ana": "Agott",
    "Pedro": "Olruggio",
    "Lucía": "Tetia",
    "Luis": "Richeh",
    "Tomás": "Qifrey",
    "Sofía": "Coco",
    "Carlos": "Olruggio",
    "Eva": "Agott",
    "Mateo": "Richeh",
    "Sandra": "Tetia",
    "Pablo": "Olruggio"
};

const objectMapping = {
    "manzanas": "tinteros mágicos",
    "caramelos": "sellos rúnicos",
    "gatos": "dragones de papel",
    "perros": "pinceles mágicos",
    "bolitas": "gemas de luz",
    "lápices": "pinceles de varita",
    "flores": "flores de cristal de nieve",
    "figuritas": "cartas mágicas",
    "pesos": "monedas de plata",
    "libros": "grimorios",
    "estantes": "anaqueles de hechizos",
    "galletas": "bayas mágicas",
    "cinta": "cinta de conjuro",
    "cuerda": "cordel de plata",
    "chocolates": "pociones de energía"
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
        problems = await response.json();
        shuffle(problems);
        showProblem();
    } catch (err) {
        problemText.innerText = "Error al cargar los hechizos (problemas). Asegúrate de que el servidor esté activo.";
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
    
    // Reemplazar nombres
    for (const [oldName, newName] of Object.entries(nameMapping)) {
        const regex = new RegExp(oldName, 'g');
        newText = newText.replace(regex, newName);
    }
    
    // Reemplazar objetos
    for (const [oldObj, newObj] of Object.entries(objectMapping)) {
        const regex = new RegExp(oldObj, 'g');
        newText = newText.replace(regex, newObj);
    }
    
    return newText;
}

function showProblem() {
    const problem = problems[currentProblemIndex];
    problemText.innerText = tematize(problem.question);
    
    // Cambiar frase del personaje e imagen
    const character = characters[Math.floor(Math.random() * characters.length)];
    teacherQuote.innerText = `"${character.quote}" — ${character.name}`;
    characterImg.style.backgroundImage = `url(${character.image})`;
    
    // Reset UI
    answerInput.value = '';
    feedback.innerText = '';
    feedback.className = 'feedback-msg';
    nextBtn.classList.add('hidden');
    checkBtn.disabled = false;
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = problems[currentProblemIndex].answer.trim().toLowerCase();
    
    // Limpieza básica de la respuesta del usuario para permitir formatos como "1/2" o decimales
    // pero enfocándose en que el núcleo sea el número.
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
    const correctAnswer = problems[currentProblemIndex].answer;
    feedback.innerText = `La respuesta correcta es: ${correctAnswer}`;
    feedback.className = "feedback-msg";
    nextBtn.classList.remove('hidden');
}

checkBtn.addEventListener('click', checkAnswer);
hintBtn.addEventListener('click', showHint);
nextBtn.addEventListener('click', () => {
    currentProblemIndex = (currentProblemIndex + 1) % problems.length;
    showProblem();
});

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

init();
