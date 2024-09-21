const rangeTime = document.getElementById('time');
const rangeVolume = document.getElementById('volume');
const audioElem = document.getElementById('audio');
const playPauseBtn = document.querySelector('.player__play');
const prevBtn = document.querySelector('.player__prev');
const nextBtn = document.querySelector('.player__next');
const images = document.querySelectorAll('body, .player__top');
const title = document.querySelector('.player__title');
const subtitle = document.querySelector('.player__subtitle');
let currentAudio = 0;
let duration
let refreshTime
const data = [
    {
        audio: 'assets/audio/beyonce.mp3',
        img: 'assets/img/lemonade.png',
        title: 'Beyonce',
        subtitle: "Don't Hurt Yourself"
    },
    {
        audio: 'assets/audio/dontstartnow.mp3',
        img: 'assets/img/dontstartnow.png',
        title: 'Dua Lipa',
        subtitle: "Don't Start Now"
    }
];

function setAudio(direction = 0) {
    if ((currentAudio + direction) < 0) {
        currentAudio = data.length - 1;
    } else if ((currentAudio + direction) > data.length - 1) {
        currentAudio = 0;
    } else {
        currentAudio += direction;
    }
    images.forEach(image => {
        image.style.backgroundImage = `url(${data[currentAudio].img})`
    })
    title.textContent = data[currentAudio].title;
    subtitle.textContent = data[currentAudio].subtitle;
    audioElem.setAttribute('src', data[currentAudio].audio);
    audioElem.load();
}

playPauseBtn.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('player_pause')) {
        e.currentTarget.classList.remove('player_pause');
        audioElem.play();
        refreshTime = setInterval(refreshTimeRange, 1000);
    } else {
        e.currentTarget.classList.add('player_pause');
        audioElem.pause();
        clearInterval(refreshTime)
    }
})

prevBtn.addEventListener('click', () => {
    setAudio(-1);
    audioElem.play();
    playPauseBtn.classList.remove('player_pause');
    refreshTime = setInterval(refreshTimeRange, 1000);
})

nextBtn.addEventListener('click', () => {
    setAudio(1);
    audioElem.play();
    playPauseBtn.classList.remove('player_pause');
    refreshTime = setInterval(refreshTimeRange, 1000);
})

function setRange(rangeInput) {
    rangeInput.min = 0
    if (rangeInput.id === 'time') {
        rangeInput.max = duration;
        rangeInput.style.setProperty('--value', 0 + '%');
    } else if (rangeInput.id === 'volume') {
        rangeInput.max = 100;
        audioElem.volume = 0.5;
        rangeInput.style.setProperty('--value', 75 + '%');
    }
}

rangeTime.addEventListener('input', (e) => {
    e.target.style.setProperty('--value', (e.target.value / duration) * 100 + '%');
    audioElem.currentTime = e.target.value;
})
rangeVolume.addEventListener('input', (e) => {
    e.target.style.setProperty('--value', `${e.target.value}%`);
    audioElem.volume = e.target.value / 100;
})

function refreshTimeRange() {
    rangeTime.style.setProperty('--value', (audioElem.currentTime / duration) * 100 + '%');
    if (audioElem.currentTime === duration) {
        setAudio(1);
        audioElem.play();
    }
}

setAudio();
setRange(rangeVolume);

audioElem.addEventListener('loadedmetadata', () => {
    duration = audioElem.duration
    setRange(rangeTime);
})