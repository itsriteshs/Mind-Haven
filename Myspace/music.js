document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const albumArt = document.getElementById('albumArt');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressSlider = document.getElementById('progressSlider');
    const currentTimeEl = document.getElementById('currentTime');
    const totalDurationEl = document.getElementById('totalDuration');
    const prevButton = document.getElementById('prevButton');
    const playPauseButton = document.getElementById('playPauseButton');
    const nextButton = document.getElementById('nextButton');
    const playIcon = playPauseButton.querySelector('.play-icon');
    const pauseIcon = playPauseButton.querySelector('.pause-icon');
    const playerContainer = document.querySelector('.player-container');

    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;

    function loadSong(song) {
        if (!song || !song.src) {
            console.error("Attempted to load invalid or undefined song data:", song);
            song = {
                title: "Error Loading Track",
                artist: "Unknown Artist",
                src: "",
                imageSrc: "assets/images/default-cover.png"
            };
        }

        console.log("Loading song:", song.title);
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        albumArt.src = song.imageSrc || 'assets/images/default-cover.png';
        albumArt.alt = `${song.title} - ${song.artist}`;
        audio.src = song.src;
        progressBar.style.width = '0%';
        progressSlider.value = 0;

        audio.onloadedmetadata = () => {
            if (!isNaN(audio.duration)) {
                updateDurationDisplay();
                progressSlider.max = audio.duration;
            } else {
                totalDurationEl.textContent = "0:00";
                progressSlider.max = 0;
            }
        };

        audio.onerror = (e) => {
            console.error(`Error loading audio source: ${audio.src}`, e);
            songTitle.textContent = "Error Loading Track";
            songArtist.textContent = "Could not load audio file";
            pauseSongVisuals();
            progressBar.style.width = '0%';
            progressSlider.value = 0;
            currentTimeEl.textContent = "0:00";
            totalDurationEl.textContent = "0:00";
        };

        pauseSongVisuals();
        playerContainer.classList.remove('playing');
        isPlaying = false;
    }

    function updateDurationDisplay() {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
            totalDurationEl.textContent = formatTime(audio.duration);
        } else {
            totalDurationEl.textContent = "0:00";
        }
    }

    function playSong() {
        isPlaying = true;
        playerContainer.classList.add('playing');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        playPauseButton.setAttribute('aria-label', 'Pause');
        audio.play().catch(e => console.error("Error playing audio:", e));
    }

    function pauseSong() {
        isPlaying = false;
        playerContainer.classList.remove('playing');
        pauseSongVisuals();
        audio.pause();
    }

    function pauseSongVisuals() {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playPauseButton.setAttribute('aria-label', 'Play');
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            if (!audio.src || audio.src === window.location.href || audio.readyState < 1) {
                console.warn("No valid song source loaded or ready. Loading current/first song.");
                if (songs && songs.length > 0) {
                    loadSong(songs[currentSongIndex]);
                    setTimeout(playSong, 150);
                } else {
                    console.error("Cannot play, song list is empty.");
                }
            } else {
                playSong();
            }
        }
    }

    function prevSong() {
        if (songs.length === 0) return;
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function nextSong() {
        if (songs.length === 0) return;
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration && !isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            if (!progressSlider.matches(':active')) {
                progressSlider.value = currentTime;
            }
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }

    function setProgress(e) {
        if (!isNaN(audio.duration)) {
            audio.currentTime = parseFloat(e.target.value);
        }
    }

    function setProgressOnClick(e) {
        const width = e.currentTarget.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        if (duration && !isNaN(duration)) {
            const newTime = (clickX / width) * duration;
            audio.currentTime = newTime;
            if (!isPlaying) {
                progressBar.style.width = `${(newTime / duration) * 100}%`;
                progressSlider.value = newTime;
                currentTimeEl.textContent = formatTime(newTime);
            }
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    async function initializePlayer() {
        try {
            const response = await fetch('songs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            songs = await response.json();

            if (songs && songs.length > 0) {
                playPauseButton.addEventListener('click', togglePlayPause);
                prevButton.addEventListener('click', prevSong);
                nextButton.addEventListener('click', nextSong);
                audio.addEventListener('timeupdate', updateProgress);
                audio.addEventListener('ended', nextSong);
                audio.addEventListener('loadedmetadata', updateDurationDisplay);
                progressSlider.addEventListener('input', setProgress);
                progressContainer.addEventListener('click', setProgressOnClick);
                loadSong(songs[currentSongIndex]);
            } else {
                console.error("No songs found in songs.json or file is empty/invalid.");
                songTitle.textContent = "Error";
                songArtist.textContent = "Music library empty.";
                prevButton.disabled = true;
                playPauseButton.disabled = true;
                nextButton.disabled = true;
                progressSlider.disabled = true;
            }
        } catch (error) {
            console.error("Could not load or parse song data:", error);
            songTitle.textContent = "Error";
            songArtist.textContent = "Failed to load library.";
            prevButton.disabled = true;
            playPauseButton.disabled = true;
            nextButton.disabled = true;
            progressSlider.disabled = true;
        }
    }

    initializePlayer();
});
