export interface VideoPlayerProps {
    src: string;
    title: string;
}

export function VideoPlayer({ src, title }: VideoPlayerProps): HTMLElement {
    const container = document.createElement('div');
    container.className = 'video-player';

    const video = document.createElement('video');
    video.className = 'video-player__video';
    video.src = src;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('aria-label', title);

    container.appendChild(video);

    return container;
}

