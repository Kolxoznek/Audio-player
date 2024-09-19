 const rangeTime = document.getElementById('time');
 const rangeVolume = document.getElementById('volume');

    function updateBackground(rangeInput) {
        const value = rangeInput.value;
        const min = rangeInput.min || 0;
        const max = rangeInput.max || 100;
        const percentage = (value - min) / (max - min) * 100;
        rangeInput.style.setProperty('--value', percentage + '%');
    }

    rangeTime.addEventListener('input', () => {
        updateBackground(rangeTime);
    });
    rangeVolume.addEventListener('input', () => {
        updateBackground(rangeVolume);
    });
    updateBackground(rangeTime);
    updateBackground(rangeVolume);

const data = [
    {
        audio: 'assets/audio/beyonce.mp3',
        img: '/assets/img/lemonade.png',
        title: 'Beyonce',
        subtitle: "Don't Hurt Yourself"
    },
    {
        audio: 'assets/audio/dontstartnow.mp3',
        img: '/assets/img/dontstartnow.png',
        title: 'Dua Lipa',
        subtitle: "Don't Start Now"
    }
];
let currentAudio = 0;
const audioElem = document.querySelector('audio');
const playPauseBtn = document.querySelector('.player__play');
const prevBtn = document.querySelector('.player__prev');
const nextBtn = document.querySelector('.player__next');
const images = document.querySelectorAll('body, .player__top');
const title = document.querySelector('.player__title');
const subtitle = document.querySelector('.player__subtitle');

audioElem.setAttribute('src', data[currentAudio].audio);

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
    audioElem.play();
    playPauseBtn.classList.remove('player_pause');
}

playPauseBtn.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('player_pause')) {
        e.currentTarget.classList.remove('player_pause');
        audioElem.play();
    } else {
        e.currentTarget.classList.add('player_pause');
        audioElem.pause();
    }
})
prevBtn.addEventListener('click', () => {
    setAudio(-1);
})
nextBtn.addEventListener('click', () => {
    setAudio(1);
})

console.dir(audioElem)

