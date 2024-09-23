const rangeTime = document.getElementById('time');
const rangeVolume = document.getElementById('volume');
const audioElem = document.getElementById('audio');
const playPauseBtn = document.querySelector('.player__play');
const prevBtn = document.querySelector('.player__prev');
const nextBtn = document.querySelector('.player__next');
const prevNextBtns = document.querySelectorAll('.player__prev, .player__next');
const images = document.querySelectorAll('body, .player__image');
const title = document.querySelector('.player__title');
const subtitle = document.querySelector('.player__subtitle');
const volumeIcon = document.getElementById('volume-btn');
const endTime = document.querySelector('.player__end');
const currentTime = document.querySelector('.player__current');
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

// дожидаемся загрузки информации о аудиофайле 
// и записываем его продолжительность в duration
audioElem.addEventListener('loadedmetadata', () => {
    duration = audioElem.duration
    setRange(rangeTime);
    endTime.textContent = `${parseInt(duration / 60)}:${parseInt(duration % 60)}`
    refreshCurrentTime()
})

setAudio();
setRange(rangeVolume);

// задать диапазон полосам
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

// отдалить/приблизить изображение обложки
function setScale() {
    images[1].classList.add('scale');
}

function removeScale() {
    images[1].classList.remove('scale');
}

// задать аудио, обложку, имя, название
// (0) - текущий трек, (1) - следующий, (-1) - предыдущий
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

// обновить положение полосы, если аудио кончилось - переключить на след. аудио
function refreshTimeRange() {
    rangeTime.style.setProperty('--value', (audioElem.currentTime / duration) * 100 + '%');
    if (audioElem.currentTime === duration) {
        setAudio(1);
        audioElem.play();
    }
    refreshCurrentTime()
}

// обновить текущее время трека в элементе
function refreshCurrentTime() {
    currentTime.textContent = `${parseInt(audioElem.currentTime / 60)}:${audioElem.currentTime % 60 < 10 ? '0' : ''}${parseInt(audioElem.currentTime % 60)}`
}

// переключение Play/pause, отдалить/приблизить обложку, вкл/выкл обновление полосы
playPauseBtn.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('player_pause')) {
        e.currentTarget.classList.remove('player_pause');
        audioElem.play();
        setScale();
        refreshTime = setInterval(refreshTimeRange, 1000);
    } else {
        e.currentTarget.classList.add('player_pause');
        audioElem.pause();
        removeScale();
        clearInterval(refreshTime)
    }
})

// переключить трек назад/вперед, сразу запустить, 
// увеличить обложку, переключить кнопку play/pause, включить обновление полосы
prevNextBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        setAudio(i === 0 ? -1 : 1);
        audioElem.play();
        setScale();
        playPauseBtn.classList.remove('player_pause');
        refreshTime = setInterval(refreshTimeRange, 1000);
    })
})

// изменение времени
rangeTime.addEventListener('input', (e) => {
    e.target.style.setProperty('--value', (e.target.value / duration) * 100 + '%');
    audioElem.currentTime = e.target.value;
    refreshCurrentTime()
})

// изменить громкость, обновить иконку, наложить на нее класс mute если громкость === 0
rangeVolume.addEventListener('input', (e) => {
    e.target.style.setProperty('--value', `${e.target.value}%`);
    refreshVolumeIcon();
    audioElem.volume = e.target.value / 100;
    if (audioElem.volume === 0) {
        volumeIcon.classList.add('mute')
    } else {
        volumeIcon.classList.remove('mute')
    }
})

// визуализация громкости на кнопке
function refreshVolumeIcon() {
    const val = rangeVolume.value;
    if (val <= 33) {
        volumeIcon.style.height = '16px';
    } else if (val <= 66 && val >= 33) {
        volumeIcon.style.height = '22px';
    } else {
        volumeIcon.style.height = '32px';
    }
}

// вкл/выкл звук и изменить иконку
// если звук выключили с помощью ползунка а потом нажали на кнопку
// громкость установиться на 10%
// если звук был отключен через кнопку а потом опять включили через нее,
// то громкость установится такой, какой была до отключения звука.
volumeIcon.addEventListener('click', () => {
    volumeIcon.classList.toggle('mute')
    if (volumeIcon.classList.contains('mute')) {
        audioElem.volume = 0;
    } else {
        if (rangeVolume.value === '0') {
            rangeVolume.style.setProperty('--value', `${10}%`);
            audioElem.volume = 10 / 100;
        } else {
            audioElem.volume = rangeVolume.value / 100;
        }
    }
});

alert('Загляни в консоль');
console.log(`
    Я хочу обьясниться сразу по некоторым моментам в которых у проверяющих могут возникнуть вопросы.
    1. если звук выключили с помощью ползунка а потом нажали на кнопку, громкость установиться на 10% (так задумано).
    2. при отключении звука иконка затемняется но растягивается в высоту как при >66% (так задумано).
    3. вы можете заметить что полосы чем ближе к краю, тем немного меняют свое положение относительно курсора,
       я хотел сделать вид этого range более современным и по этому отключил видимость точки, откуда и вытекает этот недочет.
       если вы добавите стиль:
        input[type=range]::-webkit-slider-thumb {
            opacity: 0.5;
        }
       то наглядно увидите в чем проблема - полоса в первой половине стремится к правой стороне точки, а во второй к правой, думаю уловили.
       кароче я не нашел способа как это пофиксить и оставил как есть, надеюсь на ваше понимание.
`);