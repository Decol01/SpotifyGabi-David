const photos  = [
  "img/1.jpg",
  "img/2.jpg",
  "img/3.jpg",
  "img/4.jpg",
  "img/6.jpg",
  "img/7.jpg",
  "img/8.jpg",
  "img/9.jpg",
  "img/10.jpg",
  "img/11.jpg",
  "img/12.jpg",
  "img/13.jpg",
];

const photoGrid = document.getElementById("photoGrid");
const mainCover = document.getElementById("mainCover");
const playBtn = document.getElementById("playBtn");
const likeBtn = document.getElementById("likeBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const shareBtn = document.getElementById("shareBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const musicLink = document.getElementById("musicLink");
const audioPlayer = document.getElementById("audioPlayer");
const volumeSlider = document.getElementById("volumeSlider");

let isLiked = false;
let photosState = [...photos];
let currentIndex = 0;

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateMainCover() {
  mainCover.src = photosState[currentIndex];
}

function renderPhotos() {
  photoGrid.innerHTML = "";
  photosState.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Foto ${index + 1}`;
    img.addEventListener("click", async () => {
      currentIndex = index;
      updateMainCover();
      try {
        await audioPlayer.play();
        playBtn.textContent = "❚❚";
      } catch (e) {}
    });
    photoGrid.appendChild(img);
  });
}

renderPhotos();
mainCover.src = "./img/LoveCapa.jpg";
audioPlayer.volume = 0.75;

playBtn.addEventListener("click", async () => {
  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      playBtn.textContent = "❚❚";
    } catch (error) {
      alert("Não foi possível tocar o áudio. Verifique ./audio/iris.mp3.");
    }
  } else {
    audioPlayer.pause();
    playBtn.textContent = "▶";
  }
});

likeBtn.addEventListener("click", () => {
  isLiked = !isLiked;
  likeBtn.textContent = isLiked ? "♥" : "♡";
  likeBtn.classList.toggle("active", isLiked);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % photosState.length;
  updateMainCover();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + photosState.length) % photosState.length;
  updateMainCover();
});

shuffleBtn.addEventListener("click", () => {
  photosState = [...photos].sort(() => Math.random() - 0.5);
  currentIndex = 0;
  renderPhotos();
  updateMainCover();
});

repeatBtn.addEventListener("click", () => {
  audioPlayer.currentTime = 0;
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
});

shareBtn.addEventListener("click", async () => {
  const data = {
    title: document.getElementById("songTitle").innerText,
    text: "Confira esse player personalizado!",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch (e) {}
  } else {
    alert("Compartilhamento não disponível neste navegador.");
  }
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  if (isFinite(audioPlayer.duration)) audioPlayer.currentTime = percent * audioPlayer.duration;
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value / 100;
});

audioPlayer.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  if (isFinite(audioPlayer.duration)) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
});

audioPlayer.addEventListener("play", () => {
  playBtn.textContent = "❚❚";
});

audioPlayer.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

audioPlayer.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  audioPlayer.currentTime = 0;
});