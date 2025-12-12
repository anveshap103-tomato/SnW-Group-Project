import podcasts from "../data/podcasts.json" assert { type: "json" };

// DOM Elements
const podcastGrid = document.getElementById("podcast-grid");
const playerWrapper = document.getElementById("player-wrapper");
const audio = document.getElementById("audio-element");

const playerCover = document.getElementById("player-cover");
const playerTitle = document.getElementById("player-title");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const playPauseBtn = document.getElementById("play-pause-btn");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

const volumeSlider = document.getElementById("volume-slider");

let currentTrackIndex = 0;


function loadPodcasts() {
    podcastGrid.innerHTML = podcasts.map(p => `
        <div class="podcast-card" data-index="${p.id - 1}">
            <div class="card-image-wrapper">
                <img src="${p.image}" class="card-image">
                <div class="play-overlay">
                    <div class="play-icon-circle"><i data-lucide="play"></i></div>
                </div>
            </div>
            <span class="card-category">${p.category}</span>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.description}</p>
        </div>
    `).join("");

    lucide.createIcons();
}
loadPodcasts();


podcastGrid.addEventListener("click", e => {
    const card = e.target.closest(".podcast-card");
    if (!card) return;

    currentTrackIndex = Number(card.dataset.index);
    loadTrack();
    playAudio();
});


function loadTrack() {
    const p = podcasts[currentTrackIndex];
    playerCover.src = p.image;
    playerTitle.innerText = p.title;

    audio.src = p.audio;
    playerWrapper.classList.remove("hidden");
}


playPauseBtn.addEventListener("click", () => {
    if (audio.paused) playAudio();
    else pauseAudio();
});

function playAudio() {
    audio.play();
    playPauseBtn.innerHTML = `<i data-lucide="pause"></i>`;
    lucide.createIcons();
}

function pauseAudio() {
    audio.pause();
    playPauseBtn.innerHTML = `<i data-lucide="play"></i>`;
    lucide.createIcons();
}


audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;

    currentTimeEl.textContent = format(audio.currentTime);
    durationEl.textContent = format(audio.duration);
});

function format(sec) {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}


progressContainer.addEventListener("click", e => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});


volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});


document.getElementById("next-btn").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % podcasts.length;
    loadTrack();
    playAudio();
});

document.getElementById("prev-btn").addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + podcasts.length) % podcasts.length;
    loadTrack();
    playAudio();
});

