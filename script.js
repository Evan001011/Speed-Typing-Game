  const btnStart = document.querySelector(".startBtn");
  const btnRestart = document.querySelector(".restartBtn");
  const timeDisplay = document.querySelector(".time");
  const scoreDisplay = document.querySelector(".score");
  const wpmDisplay = document.querySelector(".wpm");
  const testDisplay = document.querySelector(".test");
  const diffButtons = document.querySelectorAll(".diff-btn");
  const highScoreDisplay = document.querySelector(".highScore");

  let seconds = 60;
  let points = 0;
  let timer;
  let game_active = false;
  let selectedDifficulty = "easy";
  let wordsTyped = 0;
  let currentWordIndex = 0;
  let currentInputIndex = 0;
  let currentWords = [];

  const wordLists = {
    easy: [
      "cat", "dog", "sun", "hat", "cup", "book", "tree", "bird", "car", "fish",
      "ball", "pen", "star", "lamp", "shoe", "door", "milk", "rain", "frog", "cake",
      "bird", "leaf", "desk", "ring", "clock", "boat", "grass", "snow", "wind", "fire"
    ],
    medium: [
      "apple", "orange", "banana", "guitar", "window", "bottle", "planet", "school",
      "garden", "puzzle", "silver", "bridge", "friend", "yellow", "candle", "forest",
      "castle", "rocket", "button", "pencil", "coffee", "bicycle", "camera", "doctor",
      "jungle", "market", "purple", "river", "summer", "tablet"
    ],
    hard: [
      "algorithm", "butterfly", "dictionary", "elephant", "flamingo", "glacier",
      "hamburger", "jewelry", "kaleidoscope", "lighthouse", "microscope", "notebook",
      "oxygen", "photograph", "quarantine", "restaurant", "saxophone", "telephone",
      "umbrella", "vampire", "waterfall", "xylophone", "yesterday", "zeppelin",
      "zookeeper", "architecture", "biochemistry", "consequence", "determination",
      "enthusiasm"
    ]
  };

  function displayWord(word) {
    testDisplay.innerHTML = "";
    for (let i = 0; i < word.length; i++) {
      const span = document.createElement("span");
      span.textContent = word[i];
      span.classList.add("span");
      testDisplay.appendChild(span);
    }
  }

  function nextWord() {
    if (currentWordIndex >= currentWords.length) {
      currentWordIndex = 0;
    }
    displayWord(currentWords[currentWordIndex]);
    currentInputIndex = 0;
  }

  function startGame() {
    if (game_active) return;
    game_active = true;
    points = 0;
    wordsTyped = 0;
    currentWordIndex = 0;
    currentInputIndex = 0;
    scoreDisplay.textContent = points;
    wpmDisplay.textContent = 0;
    seconds = 60;
    timeDisplay.textContent = seconds;
    btnStart.disabled = true;
    btnStart.style.display = "none";
    btnRestart.style.display = "inline-flex";

    currentWords = [...wordLists[selectedDifficulty]];
    shuffleArray(currentWords);
    nextWord();

    timer = setInterval(() => {
      seconds--;
      timeDisplay.textContent = seconds;

      let timeElapsed = 60 - seconds;
      let wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
      wpmDisplay.textContent = wpm;

      if (seconds <= 0) {
        clearInterval(timer);
        game_active = false;
        btnStart.disabled = false;
        btnStart.style.display = "inline-flex";
        btnRestart.style.display = "none";

        alert(`Game Over! Your score was ${points}.\nWPM: ${wpm}`);

        if(points > highScore) {
          highScore = points;
          localStorage.setItem("highScore", highScore);
          highScoreDisplay.textContent = highScore;
          alert("🎉 New High Score! 🎉");
        }
      }
    }, 1000);
  }

  function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function resetGame() {
    clearInterval(timer);
    game_active = false;
    points = 0;
    wordsTyped = 0;
    currentWordIndex = 0;
    currentInputIndex = 0;
    scoreDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    timeDisplay.textContent = "60";
    testDisplay.innerHTML = "";
    btnStart.disabled = false;
    btnStart.style.display = "inline-flex";
    btnRestart.style.display = "none";
  }

  function typing(event) {
    if (!game_active) return;

    if (event.key.length !== 1 && event.key !== "Backspace") return;

    const currentSpans = testDisplay.querySelectorAll("span");
    if (event.key === "Backspace") {
      if (currentInputIndex > 0) {
        currentInputIndex--;
        currentSpans[currentInputIndex].classList.remove("background");
      }
      event.preventDefault();
      return;
    }

    const expectedChar = currentSpans[currentInputIndex].textContent;
    if (event.key === expectedChar) {
      currentSpans[currentInputIndex].classList.add("background");
      currentInputIndex++;
      points++;
      scoreDisplay.textContent = points;

      if (currentInputIndex === currentSpans.length) {
        wordsTyped++;
        currentWordIndex++;
        nextWord();
      }
    } else {
    }
    event.preventDefault();
  }

  diffButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (game_active) return;

      diffButtons.forEach(btn => {
        btn.classList.remove("selected");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      selectedDifficulty = button.getAttribute("data-difficulty");

      resetGame();
    });
  });

  btnStart.addEventListener("click", startGame);
  btnRestart.addEventListener("click", resetGame);
  document.addEventListener("keydown", typing);

  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  highScoreDisplay.textContent = highScore;

  currentWords = [...wordLists[selectedDifficulty]];
  shuffleArray(currentWords);
  nextWord();
