import { WorkCard } from '../components/WorkCard';
import { LinkPlaceholder } from '../components/LinkPlaceholder';
import type { WritingItem } from '../types';

export async function renderWritingPage(container: HTMLElement): Promise<void> {
  try {
    const response = await fetch('./data/writing/objects.json');
    const items: WritingItem[] = await response.json();

    container.innerHTML = '';

    const pageHeader = document.createElement('div');
    pageHeader.className = 'page-header';

    const title = document.createElement('h2');
    title.className = 'page-title';
    title.textContent = 'Writing';

    const subtitle = document.createElement('p');
    subtitle.className = 'page-subtitle';
    subtitle.textContent = 'Articles, Essays, and Stories';

    pageHeader.appendChild(title);
    pageHeader.appendChild(subtitle);
    container.appendChild(pageHeader);

    const grid = document.createElement('div');
    grid.className = 'work-grid';

    items.forEach((item) => {
      const linkPlaceholder = LinkPlaceholder({
        url: item.url,
        label: item.linkLabel,
      });

      const card = WorkCard({
        name: item.name,
        description: item.description,
        mediaElement: linkPlaceholder,
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  } catch (error) {
    container.innerHTML = '<p class="error">Unable to load writing collection.</p>';
    console.error('Failed to load writing data:', error);
  }
}

