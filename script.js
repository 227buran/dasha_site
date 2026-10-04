// ===== ДАТЫ =====
const startDate = new Date("2026-04-03T15:00:00");

// ===== СЧЁТЧИК =====
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");
    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = hours;
    if (mEl) mEl.textContent = minutes;
    if (sEl) sEl.textContent = seconds;

    const introCount = document.getElementById("introCounterBig");
    if (introCount) introCount.textContent = days;
}
setInterval(updateCounter, 1000);
updateCounter();

// ===== КУРСОР =====
const cursor = document.getElementById("customCursor");
const trail = document.getElementById("cursorTrail");
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    }
});

function animateTrail() {
    if (trail) {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        trail.style.left = trailX + "px";
        trail.style.top = trailY + "px";
    }
    requestAnimationFrame(animateTrail);
}
animateTrail();

document.addEventListener("click", (e) => {
    for (let i = 0; i < 5; i++) createSpark(e.clientX, e.clientY);
});

function createSpark(x, y) {
    const spark = document.createElement("div");
    spark.textContent = Math.random() > 0.5 ? "✨" : "🌸";
    spark.style.position = "fixed";
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.fontSize = "16px";
    spark.style.pointerEvents = "none";
    spark.style.zIndex = "9999999";
    spark.style.transition = "all 0.8s ease-out";
    document.body.appendChild(spark);
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 40;
    requestAnimationFrame(() => {
        spark.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
        spark.style.opacity = "0";
    });
    setTimeout(() => spark.remove(), 800);
}

// ===== ИНТРО =====
const introNames = ["DASKSIV", "Дашуля", "Любимая", "Дашка", "Котик", "Зая", "Любовь моя"];
let introIndex = 0;

const introNamesEl = document.getElementById("introNames");
const introScreen = document.getElementById("introScreen");
const introFade = document.querySelector(".intro-fade");
const mainSite = document.getElementById("mainSite");

let namesInterval = null;

function changeIntroName() {
    if (!introNamesEl) return;
    introNamesEl.classList.add("glitch");
    setTimeout(() => {
        introIndex = (introIndex + 1) % introNames.length;
        introNamesEl.textContent = introNames[introIndex];
        introNamesEl.classList.remove("glitch");
    }, 200);
}

function startNamesAnimation() {
    if (namesInterval) clearInterval(namesInterval);
    namesInterval = setInterval(changeIntroName, 1200);
}

function stopNamesAnimation() {
    if (namesInterval) {
        clearInterval(namesInterval);
        namesInterval = null;
    }
}

const flowersReplies = {
    yes: "Я знал, что тебе понравится ❤️",
    no: "Ничего, в следующий раз удивлю сильнее ❤️"
};

document.querySelectorAll(".intro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const answer = btn.dataset.answer;
        const replyEl = document.getElementById("flowersReply");
        if (replyEl) replyEl.textContent = flowersReplies[answer];
        goToStep(2);
    });
});

document.querySelectorAll(".intro-next").forEach(btn => {
    btn.addEventListener("click", () => {
        const next = btn.dataset.next;
        if (next === "end") {
            endIntro();
        } else {
            goToStep(parseInt(next));
        }
    });
});

function goToStep(step) {
    const steps = document.querySelectorAll(".intro-step");
    steps.forEach(s => s.classList.remove("active"));

    const target = document.querySelector(`.intro-step[data-step="${step}"]`);
    if (target) target.classList.add("active");

    if (step > 1) stopNamesAnimation();
}

function endIntro() {
    if (introFade) introFade.classList.add("active");

    setTimeout(() => {
        if (introScreen) introScreen.classList.add("hidden");
        document.body.classList.remove("intro-active");

        if (mainSite) {
            mainSite.classList.remove("hidden");
            setTimeout(() => mainSite.classList.add("visible"), 100);
        }
    }, 1200);
}

startNamesAnimation();

// ===== ПАДАЮЩИЕ ЛЕПЕСТКИ =====
const petalEmojis = ["🌸", "🌸", "🌸", "💮", "🌺"];

function createPetals() {
    const container = document.getElementById("petals");
    if (!container) return;
    setInterval(() => {
        const petal = document.createElement("div");
        petal.className = "petal";
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + "%";
        petal.style.fontSize = (Math.random() * 15 + 14) + "px";
        petal.style.animationDuration = (Math.random() * 10 + 12) + "s";
        petal.style.animationDelay = Math.random() * 3 + "s";
        container.appendChild(petal);
        setTimeout(() => petal.remove(), 25000);
    }, 700);
}
createPetals();

// ===== ПАДАЮЩИЕ СЛОВА =====
const loveWordsList = [
    "люблю", "люблю тебя", "очень люблю", "люблю сильно",
    "ты моя", "ты мой самый любимый", "люблю ❤️",
    "моя родная", "самый лучший", "люблю до безумия"
];

function createLoveWords() {
    const container = document.getElementById("loveWords");
    if (!container) return;
    setInterval(() => {
        const word = document.createElement("div");
        word.className = "love-word";
        word.textContent = loveWordsList[Math.floor(Math.random() * loveWordsList.length)];
        word.style.left = Math.random() * 90 + "%";
        word.style.fontSize = (Math.random() * 10 + 14) + "px";
        word.style.animationDuration = (Math.random() * 10 + 14) + "s";
        container.appendChild(word);
        setTimeout(() => word.remove(), 25000);
    }, 1200);
}
createLoveWords();

// ===== АНИМАЦИЯ БЛОКОВ =====
const blocks = document.querySelectorAll(".block");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
    });
}, { threshold: 0.1 });
blocks.forEach(b => observer.observe(b));

// ===== ФОНОВЫЕ СЕРДЕЧКИ =====
function createFloatingHearts() {
    const container = document.getElementById("heartsBg");
    if (!container) return;
    const hearts = ["❤️", "💕", "💖"];
    setInterval(() => {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = (Math.random() * 15 + 12) + "px";
        heart.style.animationDuration = (Math.random() * 12 + 14) + "s";
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 28000);
    }, 2000);
}
createFloatingHearts();

// ===== ЧАСТИЦЫ =====
const canvas = document.getElementById("particlesCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.35 + 0.1;
            this.color = Math.random() > 0.5 ? "255, 20, 147" : "255, 255, 255";
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ===== СЕКРЕТЫ =====
const secretMessages = {
    sad: "Даша, если тебе грустно — знай, я рядом. Всегда. Ты не одна. Я обниму тебя так крепко, что все печали уйдут. ❤️",
    miss: "Скучаешь? Я тоже. Каждую секунду. Ты — моя мысль №1 с утра до ночи. 💭",
    angry: "Если злишься — это нормально. Я всё равно тебя люблю. Давай поговорим, когда будешь готова. Я никуда не денусь. ❤️",
    happy: "Когда ты счастлива — я счастлив вдвойне. Твоя улыбка — лучшее, что я видел. 😊",
    fight: "Даша, если мы поссорились — я всё равно тебя люблю. Я никогда не уйду. Ты — мой человек. Мы справимся, как всегда. ❤️",
    work: "Устала на работе? Ты — лучший мастер. Твои ручки делают людей счастливее. А я горжусь тобой. Отдохни, солнышко. 💅❤️",
    future: "Ты думаешь о будущем? Я тоже. И в моём будущем — только ты. Армия, переезд, дом, семья. Всё с тобой. 🌅❤️"
};

document.querySelectorAll(".secret-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.dataset.secret;
        const msgEl = document.getElementById("secretMessage");
        if (!msgEl) return;
        msgEl.textContent = secretMessages[key] || "";
        msgEl.classList.add("show");
    });
});

// ===== КОМПЛИМЕНТЫ =====
const compliments = [
    "Ты — самая красивая, когда просто ты. Без фильтров, без масок.",
    "Твоя улыбка — это отдельный вид искусства. Я серьёзно.",
    "Ты умеешь делать ногти, но главное — ты умеешь делать меня счастливым.",
    "Рядом с тобой я стал пикмихой. И мне это нравится.",
    "Ты всегда помогаешь. Даже когда мы ругаемся. Это бесценно.",
    "Ты хочешь наших детей. И я хочу. Однажды. С тобой.",
    "Ты — моё тепло. Моё всё. Моя Даша.",
    "Разные вкусы — это ерунда. Главное — одно сердце на двоих.",
    "Ты — самая сильная, самая красивая, самая родная."
];

const complimentBtn = document.getElementById("complimentBtn");
const complimentMessage = document.getElementById("complimentMessage");

if (complimentBtn && complimentMessage) {
    complimentBtn.addEventListener("click", () => {
        const random = compliments[Math.floor(Math.random() * compliments.length)];
        complimentMessage.textContent = random;
        complimentMessage.classList.add("show");
    });
}

// ===== ПРОГРЕСС =====
let gameProgress = {
    game1: false, game2: false, game3: false,
    game4: false, game5: false, game6: false, game7: false
};

let secretScreenShown = false;

function loadProgress() {
    localStorage.removeItem("dashaProgressV10");
    gameProgress = {
        game1: false, game2: false, game3: false,
        game4: false, game5: false, game6: false, game7: false
    };
    secretScreenShown = false;
    updateGameUI();
    updateLetterUI();
}

function saveProgress() {
    updateGameUI();
    updateLetterUI();
    checkAllGames();
}

function checkAllGames() {
    const allDone = Object.values(gameProgress).every(v => v === true);
    if (allDone && !secretScreenShown) {
        secretScreenShown = true;
        setTimeout(() => showSecretScreen(), 1500);
    }
}

function showSecretScreen() {
    const screen = document.getElementById("secretScreen");
    if (!screen) return;
    screen.classList.add("active");

    const line1 = document.getElementById("secretLine1");
    const line2 = document.getElementById("secretLine2");
    const line3 = document.getElementById("secretLine3");
    const date = document.getElementById("secretDate");
    const closeBtn = document.getElementById("secretClose");

    setTimeout(() => { if (line1) line1.classList.add("show"); }, 500);
    setTimeout(() => {
        if (line1) { line1.classList.remove("show"); line1.classList.add("hide"); }
    }, 4500);
    setTimeout(() => { if (line2) line2.classList.add("show"); }, 5500);
    setTimeout(() => {
        if (line2) { line2.classList.remove("show"); line2.classList.add("hide"); }
    }, 9500);
    setTimeout(() => { if (line3) line3.classList.add("show"); }, 10500);
    setTimeout(() => { if (date) date.classList.add("show"); }, 12500);
    setTimeout(() => { if (closeBtn) closeBtn.classList.add("show"); }, 15000);
}

const secretClose = document.getElementById("secretClose");
if (secretClose) {
    secretClose.addEventListener("click", () => {
        const screen = document.getElementById("secretScreen");
        if (screen) screen.classList.remove("active");
    });
}

// ===== ОБРЫВКИ ПИСЬМА =====
const letterFragments = {
    game1: {
        text: "Даша, я помню день, когда мы познакомились — 22 марта. Я тогда ещё не знал, что ты станешь моим всем. Но что-то внутри уже тогда сказало: «Она — та самая».",
        fact: "💡 22 марта 2026 — наша точка отсчёта"
    },
    game2: {
        text: "28 марта — наша первая прогулка. Я был грубый, чёрствый, закрытый. А ты не ушла. Ты увидела во мне то, что я сам в себе не видел. Спасибо.",
        fact: "💡 28 марта 2026 — ты осталась"
    },
    game3: {
        text: "Ты сделала меня пикмихой. Из грубого и злого парня — в того, кто хочет становиться лучше ради тебя. Это твоя магия.",
        fact: "💡 Ты изменила меня в лучшую сторону"
    },
    game4: {
        text: "Были трудные дни. Но мы не разбежались — мы стали только сильнее. И это дороже всего.",
        fact: "💡 Мы прошли через трудности вместе"
    },
    game5: {
        text: "Я хочу наших детей. Я хочу просыпаться рядом с тобой. Я хочу всё. С тобой. Не когда-нибудь. А однажды. Скоро.",
        fact: "💡 Я хочу будущее с тобой"
    },
    game6: {
        text: "Мы прошли через расстояние, через ссоры, через трудности. И мы всё ещё вместе. Значит, это — настоящее.",
        fact: "💡 Мы сильнее, чем кажется"
    },
    game7: {
        text: "18 сентября ты ещё не знала, что я начал делать это. Для тебя. Тихо. Чтобы удивить. И вот — ты читаешь это. Значит, всё получилось.",
        fact: "💡 18 сентября 2026 — я начал это для тебя"
    }
};

function updateLetterUI() {
    let count = 0;
    const keys = ["game1", "game2", "game3", "game4", "game5", "game6", "game7"];
    keys.forEach((key, i) => {
        const fragEl = document.getElementById("fragment" + (i + 1));
        if (!fragEl) return;
        if (gameProgress[key]) {
            count++;
            if (!fragEl.classList.contains("unlocked")) {
                const data = letterFragments[key];
                fragEl.innerHTML = `
                    <p>${data.text}</p>
                    <span class="fragment-fact">${data.fact}</span>
                `;
                fragEl.classList.add("unlocked");
            }
        }
    });

    const progressText = document.getElementById("letterProgressText");
    const progressFill = document.getElementById("letterProgressFill");
    if (progressText) progressText.textContent = `Собрано: ${count} / 7`;
    if (progressFill) progressFill.style.width = (count / 7 * 100) + "%";
}

function updateGameUI() {
    ["game1", "game2", "game3", "game4", "game5", "game6", "game7"].forEach(key => {
        const statusEl = document.getElementById(key + "Status");
        const cardEl = document.getElementById(key + "Card");
        if (!statusEl || !cardEl) return;
        if (gameProgress[key]) {
            statusEl.textContent = "✅";
            cardEl.classList.add("completed");
        } else {
            statusEl.textContent = "🔒";
            cardEl.classList.remove("completed");
        }
    });
}

function openGame() {
    const m = document.getElementById("gameModal");
    if (m) m.classList.add("active");
}
function closeGame() {
    const m = document.getElementById("gameModal");
    const a = document.getElementById("gameArea");
    if (m) m.classList.remove("active");
    if (a) a.innerHTML = "";
}

// ===== ИГРА 1 =====
function startGame1() {
    openGame();
    const area = document.getElementById("gameArea");
    let score = 0;
    const target = 15;
    let timeLeft = 30;
    let gameActive = true;

    area.innerHTML = `
        <div class="game-info">
            <span>❤️ Сердечки: <span id="g1Score">0</span> / ${target}</span>
            <span>⏱ Время: <span id="g1Time">${timeLeft}</span> сек</span>
        </div>
        <div class="hearts-game-area" id="heartsArea"></div>
        <div class="game-result" id="g1Result"></div>
    `;

    const heartsArea = document.getElementById("heartsArea");
    const scoreEl = document.getElementById("g1Score");
    const timeEl = document.getElementById("g1Time");
    const resultEl = document.getElementById("g1Result");

    const timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) { clearInterval(timer); endGame1(); }
    }, 1000);

    const spawnInterval = setInterval(() => {
        if (!gameActive) return;
        const heart = document.createElement("div");
        heart.className = "game-heart";
        heart.textContent = "❤️";
        heart.style.left = Math.random() * (heartsArea.offsetWidth - 50) + "px";
        heart.style.top = Math.random() * (heartsArea.offsetHeight - 50) + "px";
        heart.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
        heart.addEventListener("click", () => {
            if (!gameActive) return;
            score++;
            scoreEl.textContent = score;
            heart.remove();
            if (score >= target) { clearInterval(timer); clearInterval(spawnInterval); endGame1(); }
        });
        heartsArea.appendChild(heart);
        setTimeout(() => { if (heart.parentNode) heart.remove(); }, 2000);
    }, 600);

    function endGame1() {
        gameActive = false;
        clearInterval(timer);
        clearInterval(spawnInterval);
        heartsArea.innerHTML = "";
        if (score >= target) {
            resultEl.textContent = "🎉 Победа! Обрывок письма разблокирован!";
            gameProgress.game1 = true;
            saveProgress();
            setTimeout(() => closeGame(), 2200);
        } else {
            resultEl.textContent = `😢 Поймано ${score} из ${target}. Попробуй ещё раз!`;
        }
    }
}

// ===== ИГРА 2 =====
function startGame2() {
    openGame();
    const area = document.getElementById("gameArea");
    const emojis = ["🥤", "🪖", "🍂", "🤠", "🏡", "🌿"];
    let cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let lockBoard = false;

    area.innerHTML = `
        <div class="game-info">
            <span>Найдено пар: <span id="g2Matched">0</span> / 6</span>
        </div>
        <div class="memory-grid" id="memoryGrid"></div>
        <div class="game-result" id="g2Result"></div>
    `;

    const grid = document.getElementById("memoryGrid");
    const matchedEl = document.getElementById("g2Matched");
    const resultEl = document.getElementById("g2Result");

    cards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.className = "memory-card";
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = emoji;
        card.addEventListener("click", () => {
            if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;
            card.classList.add("flipped");
            flipped.push(card);
            if (flipped.length === 2) {
                lockBoard = true;
                const [a, b] = flipped;
                if (a.dataset.emoji === b.dataset.emoji) {
                    a.classList.add("matched"); b.classList.add("matched");
                    matched++;
                    matchedEl.textContent = matched;
                    flipped = []; lockBoard = false;
                    if (matched === 6) {
                        resultEl.textContent = "🎉 Победа! Обрывок письма разблокирован!";
                        gameProgress.game2 = true;
                        saveProgress();
                        setTimeout(() => closeGame(), 2200);
                    }
                } else {
                    setTimeout(() => {
                        a.classList.remove("flipped"); b.classList.remove("flipped");
                        flipped = []; lockBoard = false;
                    }, 800);
                }
            }
        });
        grid.appendChild(card);
    });
}

// ===== ИГРА 3 =====
const quizQuestions = [
    { question: "Какой напиток я люблю больше всего?", options: ["Кола", "Пепси", "Фанта", "Квас"], correct: 1 },
    { question: "Моё любимое время года?", options: ["Весна", "Лето", "Осень", "Зима"], correct: 2 },
    { question: "Мой любимый цвет?", options: ["Розовый", "Оливковый", "Синий", "Бордовый"], correct: 1 },
    { question: "О чём я мечтаю?", options: ["Квартира в центре Москвы", "Яхта в море", "Дом на Кубани", "Остров в океане"], correct: 2 },
    { question: "Какая тематика мне ближе всего?", options: ["Вестерн и Дикий Запад", "Космос", "Киберпанк", "Средневековье"], correct: 0 },
    { question: "Какой стиль мне нравится?", options: ["Гламур", "Классика", "Милитари", "Спорт-шик"], correct: 2 },
    { question: "Кого я люблю безумно?", options: ["Дашу", "Дашу ❤️", "Только Дашу", "Дашу, и точка"], correct: -1 }
];

function startGame3() {
    openGame();
    const area = document.getElementById("gameArea");
    let currentQuestion = 0;
    let correctAnswers = 0;

    function renderQuestion() {
        if (currentQuestion >= quizQuestions.length) { endQuiz(); return; }
        const q = quizQuestions[currentQuestion];
        area.innerHTML = `
            <div class="game-info">
                <span>Вопрос: ${currentQuestion + 1} / ${quizQuestions.length}</span>
                <span>✅ Правильно: ${correctAnswers}</span>
            </div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options" id="quizOptions"></div>
            <div class="game-result" id="g3Result"></div>
        `;
        const optionsEl = document.getElementById("quizOptions");
        const resultEl = document.getElementById("g3Result");
        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option";
            btn.textContent = opt;
            btn.addEventListener("click", () => {
                if (q.correct === -1 || i === q.correct) {
                    btn.classList.add("correct");
                    correctAnswers++;
                    resultEl.textContent = "✅ Правильно!";
                } else {
                    btn.classList.add("wrong");
                    resultEl.textContent = "❌ Неправильно";
                }
                document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
                setTimeout(() => { currentQuestion++; renderQuestion(); }, 1000);
            });
            optionsEl.appendChild(btn);
        });
    }

    function endQuiz() {
        if (correctAnswers >= 5) {
            area.innerHTML = `
                <div class="game-result" style="font-size: 24px; margin-top: 40px;">
                    🎉 Ты ответила на ${correctAnswers} из ${quizQuestions.length}!<br><br>
                    Обрывок письма разблокирован ❤️
                </div>
            `;
            gameProgress.game3 = true;
            saveProgress();
            setTimeout(() => closeGame(), 2500);
        } else {
            area.innerHTML = `
                <div class="game-result" style="font-size: 20px; margin-top: 40px;">
                    😢 Правильно ${correctAnswers} из ${quizQuestions.length}.<br>
                    Нужно хотя бы 5. Попробуй ещё раз!
                </div>
            `;
        }
    }
    renderQuestion();
}

// ===== ИГРА 4: ТИР НА ДИКОМ ЗАПАДЕ =====
function startGame4() {
    openGame();
    const area = document.getElementById("gameArea");
    const target = 12;
    let score = 0, timeLeft = 30, active = true;
    area.innerHTML = `
        <div class="game-info"><span>🎯 Мишени: <span id="g4Score">0</span> / ${target}</span><span>⏱ Время: <span id="g4Time">${timeLeft}</span> сек</span></div>
        <div class="range-area" id="rangeArea"><div class="range-decor">🌵 🤠 🌵</div></div>
        <div class="game-result" id="g4Result">Не стреляй в сердечки ❤️ — минус 2</div>`;
    const range = document.getElementById("rangeArea");
    const scoreEl = document.getElementById("g4Score");
    const timeEl = document.getElementById("g4Time");
    const resultEl = document.getElementById("g4Result");
    const timer = setInterval(() => {
        if (!range.isConnected) { stop(); return; }
        timeLeft--; timeEl.textContent = timeLeft;
        if (timeLeft <= 0) end();
    }, 1000);
    const spawn = setInterval(() => {
        if (!range.isConnected) { stop(); return; }
        if (!active) return;
        const bad = Math.random() < 0.2;
        const t = document.createElement("div");
        t.className = "range-t";
        t.textContent = bad ? "❤️" : ["🍾", "🥫", "🎯", "🪖"][Math.floor(Math.random() * 4)];
        t.style.left = Math.random() * (range.offsetWidth - 56) + "px";
        t.style.top = Math.random() * (range.offsetHeight - 110) + "px";
        t.addEventListener("pointerdown", () => {
            if (!active) return;
            score = Math.max(0, score + (bad ? -2 : 1));
            scoreEl.textContent = score;
            t.textContent = bad ? "💔" : "💥";
            t.style.pointerEvents = "none";
            setTimeout(() => t.remove(), 250);
            if (score >= target) end();
        });
        range.appendChild(t);
        setTimeout(() => t.remove(), 1300);
    }, 550);
    function stop() { active = false; clearInterval(timer); clearInterval(spawn); }
    function end() {
        stop();
        range.innerHTML = "";
        if (score >= target) {
            resultEl.textContent = "🎉 Меткий стрелок! Обрывок письма разблокирован!";
            gameProgress.game4 = true;
            saveProgress();
            setTimeout(() => closeGame(), 2200);
        } else {
            resultEl.textContent = `Попал ${score} из ${target}. Попробуй ещё раз!`;
        }
    }
}

// ===== ИГРА 5: ДУЭЛЬ =====
function startGame5() {
    openGame();
    const area = document.getElementById("gameArea");
    const maxAttempts = 3;
    let attempts = 0, bestTime = Infinity, state = "idle", startTime = 0, timer = null;

    area.innerHTML = `
        <div class="game-info">
            <span>Раунд: <span id="g5Attempt">1</span> / ${maxAttempts}</span>
            <span>Лучшее: <span id="g5Best">—</span> мс</span>
        </div>
        <div class="reaction-area"><div class="reaction-target" id="reactionTarget">🌵</div></div>
        <div class="game-result" id="g5Result">Жми на ковбоя, когда увидишь 💥</div>`;

    const target = document.getElementById("reactionTarget");
    const resultEl = document.getElementById("g5Result");
    const attemptEl = document.getElementById("g5Attempt");
    const bestEl = document.getElementById("g5Best");

    function startAttempt() {
        if (!target.isConnected || attempts >= maxAttempts) return;
        state = "wait";
        target.textContent = "🌵";
        resultEl.textContent = "Жди сигнала... не торопись!";
        timer = setTimeout(() => {
            if (!target.isConnected) return;
            target.textContent = "💥";
            startTime = performance.now();
            state = "go";
            resultEl.textContent = "ОГОНЬ!";
        }, Math.random() * 2000 + 1500);
    }

    target.addEventListener("click", () => {
        if (state === "wait") {
            clearTimeout(timer);
            state = "idle";
            target.textContent = "😵";
            resultEl.textContent = "Фальстарт! Ковбой оказался быстрее.";
            setTimeout(startAttempt, 1400);
            return;
        }
        if (state !== "go") return;
        const time = Math.round(performance.now() - startTime);
        state = "idle";
        attempts++;
        attemptEl.textContent = Math.min(attempts + 1, maxAttempts);
        if (time < bestTime) bestTime = time;
        bestEl.textContent = bestTime;

        if (time < 500) {
            target.textContent = "🤠";
            resultEl.textContent = `⚡ ${time} мс! Ты быстрее всех на Диком Западе. Обрывок письма разблокирован!`;
            gameProgress.game5 = true;
            saveProgress();
            setTimeout(() => closeGame(), 2400);
        } else if (attempts < maxAttempts) {
            target.textContent = "😢";
            resultEl.textContent = `${time} мс. Медленно. Попробуй ещё!`;
            setTimeout(startAttempt, 1500);
        } else {
            target.textContent = "😢";
            resultEl.textContent = `${time} мс. Раунды кончились. Закрой и попробуй снова!`;
        }
    });

    startAttempt();
}

// ===== ИГРА 6 =====
function startGame6() {
    openGame();
    const area = document.getElementById("gameArea");
    const correctOrder = [
        "22 марта 2026 — Познакомились",
        "28 марта 2026 — Первая прогулка",
        "3 апреля 2026 — Начали встречаться",
        "18 апреля 2026 — Москва",
        "10 мая 2026 — Зарница",
        "17 сентября 2026 — Снова в строю",
        "18 сентября 2026 — Ты не подозревала"
    ];
    let shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    let placed = [];

    area.innerHTML = `
        <div class="game-info"><span>Расставь события по порядку</span></div>
        <div class="dates-slots" id="datesSlots"></div>
        <div class="dates-container" id="datesBank"></div>
        <div class="game-result" id="g6Result"></div>
        <button class="game-btn" id="resetG6" style="margin-top: 15px;">Сбросить</button>
    `;

    const slotsEl = document.getElementById("datesSlots");
    const bankEl = document.getElementById("datesBank");
    const resultEl = document.getElementById("g6Result");

    function renderSlots() {
        slotsEl.innerHTML = "";
        for (let i = 0; i < correctOrder.length; i++) {
            const slot = document.createElement("div");
            slot.className = "date-slot";
            if (placed[i] !== undefined) {
                slot.classList.add("filled");
                slot.textContent = shuffled[placed[i]];
                slot.addEventListener("click", () => {
                    placed.splice(i, 1);
                    renderSlots();
                    renderBank();
                });
            } else {
                slot.textContent = `Слот ${i + 1}`;
            }
            slotsEl.appendChild(slot);
        }
    }

    function renderBank() {
        bankEl.innerHTML = "";
        shuffled.forEach((date, i) => {
            if (placed.includes(i)) return;
            const btn = document.createElement("button");
            btn.className = "date-item";
            btn.textContent = date;
            btn.addEventListener("click", () => {
                if (placed.length >= correctOrder.length) return;
                placed.push(i);
                renderSlots();
                renderBank();
                checkWin();
            });
            bankEl.appendChild(btn);
        });
    }

    function checkWin() {
        if (placed.length === correctOrder.length) {
            const result = placed.map(i => shuffled[i]);
            if (result.join("|") === correctOrder.join("|")) {
                resultEl.textContent = "🎉 Победа! Обрывок письма разблокирован!";
                gameProgress.game6 = true;
                saveProgress();
                setTimeout(() => closeGame(), 2200);
            } else {
                resultEl.textContent = "❌ Не совсем. Попробуй другой порядок!";
            }
        }
    }

    document.getElementById("resetG6").addEventListener("click", () => {
        placed = [];
        renderSlots();
        renderBank();
        resultEl.textContent = "";
    });

    renderSlots();
    renderBank();
}

// ===== ИГРА 7: ТЕТРИС =====
function startGame7() {
    openGame();
    const area = document.getElementById("gameArea");
    const C = 10, R = 20, S = 22, GOAL = 5;
    const SH = [[[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]]];
    const COL = ["#f4c9d3", "#e8c892", "#e0587c", "#8a9a4b", "#b58bd0", "#ff8fa8", "#d9a05b"];
    area.innerHTML = `
        <div class="game-info"><span>Линий: <span id="tLines">0</span> / ${GOAL}</span><span>← → ↑ ↓ пробел</span></div>
        <canvas id="tetris" class="tetris-canvas" width="${C * S}" height="${R * S}"></canvas>
        <div class="tetris-pad">
            <button data-a="l" aria-label="Влево">◀</button><button data-a="t" aria-label="Повернуть">⟳</button><button data-a="r" aria-label="Вправо">▶</button><button data-a="d" aria-label="Вниз">▼</button><button data-a="s" aria-label="Сбросить вниз">⤓</button>
        </div>
        <div class="game-result" id="g7Result"></div>`;
    const cv = document.getElementById("tetris"), cx = cv.getContext("2d");
    const resultEl = document.getElementById("g7Result");
    let board = Array.from({ length: R }, () => Array(C).fill(0)), cur = null, lines = 0, over = false, last = 0;

    const rot = m => m[0].map((_, i) => m.map(r => r[i]).reverse());
    const hit = (m, x, y) => m.some((row, j) => row.some((v, i) => v && (x + i < 0 || x + i >= C || y + j >= R || (y + j >= 0 && board[y + j][x + i]))));
    function spawn() {
        const i = Math.floor(Math.random() * SH.length);
        cur = { m: SH[i], c: i + 1, x: Math.floor((C - SH[i][0].length) / 2), y: 0 };
        if (hit(cur.m, cur.x, cur.y)) finish(false);
    }
    function lock() {
        cur.m.forEach((row, j) => row.forEach((v, i) => { if (v && cur.y + j >= 0) board[cur.y + j][cur.x + i] = cur.c; }));
        let n = 0;
        board = board.filter(r => { if (r.every(v => v)) { n++; return false; } return true; });
        while (board.length < R) board.unshift(Array(C).fill(0));
        lines += n;
        document.getElementById("tLines").textContent = lines;
        if (lines >= GOAL) finish(true); else spawn();
    }
    function mv(dx, dy) {
        if (over) return false;
        if (!hit(cur.m, cur.x + dx, cur.y + dy)) { cur.x += dx; cur.y += dy; return true; }
        if (dy) lock();
        return false;
    }
    function turn() {
        if (over) return;
        const m = rot(cur.m);
        for (const k of [0, -1, 1, -2, 2]) if (!hit(m, cur.x + k, cur.y)) { cur.m = m; cur.x += k; return; }
    }
    function slam() { while (mv(0, 1)); }
    function cell(x, y, c) {
        cx.fillStyle = COL[c - 1]; cx.beginPath();
        if (cx.roundRect) cx.roundRect(x * S + 1, y * S + 1, S - 2, S - 2, 5); else cx.rect(x * S + 1, y * S + 1, S - 2, S - 2);
        cx.fill();
    }
    function draw() {
        cx.fillStyle = "#0d0610"; cx.fillRect(0, 0, C * S, R * S);
        board.forEach((r, y) => r.forEach((v, x) => { if (v) cell(x, y, v); }));
        if (cur && !over) cur.m.forEach((row, j) => row.forEach((v, i) => { if (v) cell(cur.x + i, cur.y + j, cur.c); }));
    }
    function finish(win) {
        over = true;
        document.removeEventListener("keydown", onKey);
        draw();
        if (win) {
            resultEl.textContent = "🎉 Победа! Обрывок письма разблокирован!";
            gameProgress.game7 = true;
            saveProgress();
            setTimeout(() => closeGame(), 2200);
        } else {
            resultEl.innerHTML = '😢 Стакан переполнен.<br><button class="game-btn" id="tRetry" style="margin-top:12px">Ещё раз</button>';
            document.getElementById("tRetry").addEventListener("click", startGame7);
        }
    }
    function onKey(e) {
        if (!cv.isConnected) { over = true; document.removeEventListener("keydown", onKey); return; }
        const k = e.key;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(k)) e.preventDefault();
        if (k === "ArrowLeft") mv(-1, 0); else if (k === "ArrowRight") mv(1, 0);
        else if (k === "ArrowDown") mv(0, 1); else if (k === "ArrowUp") turn(); else if (k === " ") slam();
    }
    document.addEventListener("keydown", onKey);
    const acts = { l: () => mv(-1, 0), r: () => mv(1, 0), t: turn, d: () => mv(0, 1), s: slam };
    area.querySelectorAll(".tetris-pad button").forEach(b => b.addEventListener("pointerdown", e => { e.preventDefault(); acts[b.dataset.a](); }));
    function loop(t) {
        if (over || !cv.isConnected) { over = true; document.removeEventListener("keydown", onKey); return; }
        if (t - last > Math.max(180, 650 - lines * 80)) { last = t; mv(0, 1); }
        draw();
        requestAnimationFrame(loop);
    }
    spawn();
    requestAnimationFrame(loop);
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
loadProgress();