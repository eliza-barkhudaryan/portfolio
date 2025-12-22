import { WorkCard } from '../components/WorkCard';
import { SongPlayer } from '../components/SongPlayer';
import { VideoPlayer } from '../components/VideoPlayer';
import type { MusicItem } from '../types';

function isVideoFile(path: string): boolean {
    const lowerPath = path.toLowerCase();
    return lowerPath.endsWith('.mp4') || lowerPath.endsWith('.webm') || lowerPath.endsWith('.mov');
}

export async function renderMusicPage(container: HTMLElement): Promise<void> {
    try {
        const response = await fetch('./data/music/objects.json');
        const items: MusicItem[] = await response.json();

        container.innerHTML = '';

        const pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';

        const title = document.createElement('h2');
        title.className = 'page-title';
        title.textContent = 'Music';

        const subtitle = document.createElement('p');
        subtitle.className = 'page-subtitle';
        subtitle.textContent = 'A Collection of Original Compositions';

        pageHeader.appendChild(title);
        pageHeader.appendChild(subtitle);
        container.appendChild(pageHeader);

        const grid = document.createElement('div');
        grid.className = 'work-grid';

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

            const mediaElement = isVideo
                ? VideoPlayer({
                    src: `./data/music/${item.path}`,
                    title: item.name,
                })
                : SongPlayer({
                    src: `./data/music/${item.path}`,
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
