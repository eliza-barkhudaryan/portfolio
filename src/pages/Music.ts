import { storageUrl } from '../storage';
import { WorkCard } from '../components/WorkCard';
import { SongPlayer } from '../components/SongPlayer';
import { VideoPlayer } from '../components/VideoPlayer';
import type { MusicItem } from '../types';

function isVideoFile(path: string): boolean {
    const lowerPath = path.toLowerCase();
    return lowerPath.endsWith('.mp4') || lowerPath.endsWith('.webm') || lowerPath.endsWith('.mov');
}

function isUrl(path: string): boolean {
    try {
        new URL(path);
        return true;
    } catch {
        return false;
    }
}

function getMediaSrc(path: string): string {
    return isUrl(path) ? path : `./data/music/${path}`;
}

export async function renderMusicPage(container: HTMLElement): Promise<void> {
    try {
        const response = await fetch(storageUrl('music/objects.json'));
        const items: MusicItem[] = await response.json();

        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'work-grid work-grid--scroll';

        // Sort items: audio first, video last
        const sortedItems = [...items].sort((a, b) => {
            const aIsVideo = isVideoFile(a.path);
            const bIsVideo = isVideoFile(b.path);
            if (aIsVideo && !bIsVideo) return 1;
            if (!aIsVideo && bIsVideo) return -1;
            return 0;
        });

        sortedItems.forEach((item) => {
            const isVideo = isVideoFile(item.path);
            const mediaSrc = getMediaSrc(item.path);

            const mediaElement = isVideo
                ? VideoPlayer({
                    src: mediaSrc,
                    title: item.name,
                })
                : SongPlayer({
                    src: mediaSrc,
                    title: item.name,
                });

            const card = WorkCard({
                name: item.name,
                description: item.description,
                mediaElement: mediaElement,
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);
    } catch (error) {
        container.innerHTML = '<p class="error">Unable to load music collection.</p>';
        console.error('Failed to load music data:', error);
    }
}
