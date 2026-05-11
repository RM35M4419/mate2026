document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos del DOM
    const loadingEl = document.getElementById('loading');
    const problemContentEl = document.getElementById('problem-content');
    const categorySelect = document.getElementById('category-select');
    const problemCategoryEl = document.getElementById('problem-category');
    const problemTextEl = document.getElementById('problem-text');
    const userAnswerEl = document.getElementById('user-answer');
    const feedbackMessageEl = document.getElementById('feedback-message');
    
    const btnSubmit = document.getElementById('btn-submit');
    const btnHint = document.getElementById('btn-hint');
    const btnShowAnswer = document.getElementById('btn-show-answer');
    const btnNext = document.getElementById('btn-next');
    const inkFillEl = document.getElementById('ink-fill');
    const quoteEl = document.getElementById('quote');

    // Estado de la aplicación
    let allProblems = [];
    let currentFilteredProblems = [];
    let currentProblemIndex = 0;
    let currentProblem = null;
    let correctAnswersCount = 0;
    let failedAttempts = 0;

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

    // --- CARGA DE DATOS ---
    async function fetchProblems() {
        try {
            const response = await fetch('data/problems.json');
            if (!response.ok) throw new Error("No se pudo cargar el archivo");
            allProblems = await response.json();
        } catch (error) {
            console.error("Error cargando problemas:", error);
            problemTextEl.textContent = "Error al cargar los hechizos. Por favor, asegúrate de que el servidor esté activo.";
        }

        populateCategories(allProblems);
        filterProblems();
    }

    function populateCategories(problems) {
        const categories = [...new Set(problems.map(p => p.category))].sort();
        categories.forEach(cat => {
            if(cat) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            }
        });
    }

    function filterProblems() {
        const selectedCategory = categorySelect.value;
        if (selectedCategory === "all") {
            currentFilteredProblems = [...allProblems];
        } else {
            currentFilteredProblems = allProblems.filter(p => p.category === selectedCategory);
        }
        
        currentFilteredProblems.sort(() => Math.random() - 0.5);
        currentProblemIndex = 0;
        correctAnswersCount = 0;
        updateInkProgress();
        loadProblem();
    }

    function loadProblem() {
        if (currentFilteredProblems.length === 0) {
            loadingEl.textContent = "No hay problemas disponibles en esta categoría.";
            return;
        }

        currentProblem = currentFilteredProblems[currentProblemIndex];
        
        // Tematización y Visualización
        problemCategoryEl.textContent = currentProblem.category || "General";
        problemTextEl.innerHTML = tematize(currentProblem.question);
        
        // Cambiar frase del personaje
        const character = characters[Math.floor(Math.random() * characters.length)];
        quoteEl.innerHTML = `"${character.quote}" <br><strong>— ${character.name}</strong>`;
        
        // Si hay una imagen de personaje en el DOM (la añadiremos en index.html)
        const charImgEl = document.getElementById('character-img');
        if (charImgEl) {
            charImgEl.style.backgroundImage = `url(${character.image})`;
        }

        // Resetear UI
        failedAttempts = 0;
        userAnswerEl.value = "";
        hideFeedback();
        btnNext.classList.add('hidden');
        btnShowAnswer.classList.add('hidden');
        btnSubmit.disabled = false;
        userAnswerEl.disabled = false;
        loadingEl.classList.add('hidden');
        problemContentEl.classList.remove('hidden');

        problemContentEl.classList.remove('fade-in');
        void problemContentEl.offsetWidth; 
        problemContentEl.classList.add('fade-in');
        
        userAnswerEl.focus();
    }

    function checkAnswer() {
        const userAnswer = userAnswerEl.value.trim().toLowerCase();
        const correctAnswer = currentProblem.answer ? currentProblem.answer.toString().toLowerCase() : "";

        if (userAnswer === "") {
            showFeedback("Por favor, traza una respuesta en el pergamino.", "error");
            return;
        }

        if (userAnswer === correctAnswer) {
            showFeedback("¡Trazado perfecto! El hechizo se ha activado.", "success");
            btnSubmit.disabled = true;
            userAnswerEl.disabled = true;
            btnNext.classList.remove('hidden');
            btnShowAnswer.classList.add('hidden');
            
            correctAnswersCount++;
            updateInkProgress();
        } else {
            failedAttempts++;
            showFeedback("La tinta se ha corrido... El círculo está incompleto. Inténtalo de nuevo.", "error");
            
            if (failedAttempts >= 2) {
                btnShowAnswer.classList.remove('hidden');
            }
        }
    }

    function showFeedback(message, type) {
        feedbackMessageEl.textContent = message;
        feedbackMessageEl.className = 'feedback-message'; 
        feedbackMessageEl.classList.add(`feedback-${type}`);
        feedbackMessageEl.classList.remove('hidden');
    }

    function hideFeedback() {
        feedbackMessageEl.className = 'feedback-message hidden';
    }

    function updateInkProgress() {
        if(currentFilteredProblems.length === 0) return;
        const percentage = (correctAnswersCount / currentFilteredProblems.length) * 100;
        inkFillEl.style.width = `${percentage}%`;
    }

    // --- EVENTOS ---
    btnSubmit.addEventListener('click', checkAnswer);

    userAnswerEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    btnHint.addEventListener('click', () => {
        // En los datos actuales no hay hints, así que damos uno genérico o Qifrey ayuda
        showFeedback("Qifrey te observa: 'Analiza los números con cuidado, el dibujo debe ser preciso'.", "hint");
    });

    btnShowAnswer.addEventListener('click', () => {
        showFeedback(`La respuesta correcta es: ${currentProblem.answer}`, "hint");
        btnNext.classList.remove('hidden');
        btnSubmit.disabled = true;
        userAnswerEl.disabled = true;
        btnShowAnswer.classList.add('hidden');
    });

    btnNext.addEventListener('click', () => {
        currentProblemIndex++;
        if (currentProblemIndex < currentFilteredProblems.length) {
            loadProblem();
        } else {
            problemTextEl.textContent = "¡Has completado todos los hechizos de esta prueba!";
            problemCategoryEl.textContent = "Prueba Superada";
            userAnswerEl.classList.add('hidden');
            document.querySelector('.action-buttons').classList.add('hidden');
            btnShowAnswer.classList.add('hidden');
            btnNext.classList.add('hidden');
            hideFeedback();
        }
    });

    categorySelect.addEventListener('change', filterProblems);

    fetchProblems();
});
