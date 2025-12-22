export interface SongPlayerProps {
    src: string;
    title: string;
}

export function SongPlayer({ src, title }: SongPlayerProps): HTMLElement {
    const container = document.createElement('div');
    container.className = 'song-player';

    const playButton = document.createElement('button');
    playButton.className = 'song-player__button';
    playButton.setAttribute('aria-label', `Play ${title}`);
    playButton.innerHTML = '▶';

    const progressContainer = document.createElement('div');
    progressContainer.className = 'song-player__progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'song-player__progress';
    progressContainer.appendChild(progressBar);

    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'song-player__time';
    timeDisplay.textContent = '0:00 / 0:00';

    const audio = document.createElement('audio');
    audio.src = src;
    audio.preload = 'metadata';

    let isPlaying = false;

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    audio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playButton.innerHTML = '▶';
        playButton.classList.remove('song-player__button--playing');
    });

    playButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playButton.innerHTML = '▶';
            playButton.classList.remove('song-player__button--playing');
        } else {
            audio.play();
            playButton.innerHTML = '❚❚';
            playButton.classList.add('song-player__button--playing');
        }
        isPlaying = !isPlaying;
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    container.appendChild(playButton);
    container.appendChild(progressContainer);
    container.appendChild(timeDisplay);
    container.appendChild(audio);

    return container;
}

