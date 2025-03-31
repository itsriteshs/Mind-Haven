document.addEventListener("DOMContentLoaded", () => {
    
    const presetGrid = document.getElementById("presetGrid");
    const startMeditationBtn = document.getElementById("startMeditationBtn");
    const presetSelectionView = document.getElementById("presetSelection");
    const activeMeditationView = document.getElementById("activeMeditation");
    const timerText = document.getElementById("timerText");
    const timerProgressCircle = document.getElementById("timerProgressCircle");
    const instructionText = document.getElementById("instructionText");
    const meditationAudio = document.getElementById("meditationAudio");
    const activePlayPauseBtn = document.getElementById("activePlayPauseBtn");
    const stopMeditationBtn = document.getElementById("stopMeditationBtn");
    const playIcon = activePlayPauseBtn.querySelector(".play-icon");
    const pauseIcon = activePlayPauseBtn.querySelector(".pause-icon");

    
    const meditationPresets = [
        { id: "relax", title: "Relaxation", duration: 300, src: "audio/relax.mp3", instructions: ["Breathe in deeply...", "Hold for a moment...", "Exhale slowly..."] },
        { id: "focus", title: "Deep Focus", duration: 600, src: "audio/focus.mp3", instructions: ["Find your center...", "Let distractions fade...", "Stay present..."] },
        { id: "sleep", title: "Sleep Aid", duration: 900, src: "audio/sleep.mp3", instructions: ["Close your eyes...", "Feel your body relax...", "Drift into deep rest..."] }
    ];

    let currentSession = null;
    let timerInterval = null;
    let elapsedTime = 0;
    let totalTime = 0;

    

    function renderPresets() {
        presetGrid.innerHTML = "";
        meditationPresets.forEach(preset => {
            const card = document.createElement("div");
            card.classList.add("preset-card");
            card.dataset.id = preset.id;
            card.innerHTML = `<h3>${preset.title}</h3>`;
            card.addEventListener("click", () => selectPreset(preset));
            presetGrid.appendChild(card);
        });
    }

    function selectPreset(preset) {
        currentSession = preset;
        document.querySelectorAll(".preset-card").forEach(card => card.classList.remove("selected"));
        document.querySelector(`.preset-card[data-id="${preset.id}"]`).classList.add("selected");
        startMeditationBtn.disabled = false;
    }

    function startMeditation() {
        if (!currentSession) return;

        totalTime = currentSession.duration;
        elapsedTime = 0;
        timerText.textContent = formatTime(totalTime);
        updateTimerVisual(0);

        meditationAudio.src = currentSession.src;
        meditationAudio.play();

        presetSelectionView.classList.remove("view-active");
        activeMeditationView.classList.add("view-active");

        playIcon.style.display = "none";
        pauseIcon.style.display = "block";

        startTimer();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            elapsedTime += 1;
            const remainingTime = totalTime - elapsedTime;

            if (remainingTime <= 0) {
                stopMeditation();
                return;
            }

            timerText.textContent = formatTime(remainingTime);
            updateTimerVisual((elapsedTime / totalTime) * 100);

            if (currentSession.instructions && elapsedTime % 10 === 0) {
                const instructionIndex = Math.floor(elapsedTime / 10) % currentSession.instructions.length;
                instructionText.textContent = currentSession.instructions[instructionIndex];
            }
        }, 1000);
    }

    function togglePlayPause() {
        if (meditationAudio.paused) {
            meditationAudio.play();
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
            startTimer();
        } else {
            meditationAudio.pause();
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
            clearInterval(timerInterval);
        }
    }

    function stopMeditation() {
        clearInterval(timerInterval);
        meditationAudio.pause();
        meditationAudio.currentTime = 0;
        instructionText.textContent = "Session Complete.";

        presetSelectionView.classList.add("view-active");
        activeMeditationView.classList.remove("view-active");
        startMeditationBtn.disabled = true;
        currentSession = null;
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }

    function updateTimerVisual(percentage) {
        timerProgressCircle.style.strokeDashoffset = 100 - percentage;
    }

    
    startMeditationBtn.addEventListener("click", startMeditation);
    activePlayPauseBtn.addEventListener("click", togglePlayPause);
    stopMeditationBtn.addEventListener("click", stopMeditation);

    
    renderPresets();
});
