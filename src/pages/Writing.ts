import { storageUrl } from '../storage';
import { LinkPlaceholder } from '../components/LinkPlaceholder';
import type { WritingItem } from '../types';

export async function renderWritingPage(container: HTMLElement): Promise<void> {
  try {
    const response = await fetch(storageUrl('writing/objects.json'));
    const items: WritingItem[] = await response.json();

    container.innerHTML = '';

    const index = document.createElement('div');
    index.className = 'essay-index';

    items.forEach((item) => {
      const essay = document.createElement('article');
      essay.className = 'essay';

      const title = document.createElement('h3');
      title.className = 'essay__title';
      title.textContent = item.name;

      const description = document.createElement('p');
      description.className = 'essay__description';
      description.textContent = item.description;

      essay.appendChild(title);
      essay.appendChild(description);
      essay.appendChild(
        LinkPlaceholder({
          url: item.url,
          label: item.linkLabel,
          name: item.name,
        })
      );

      index.appendChild(essay);
    });

    container.appendChild(index);
  } catch (error) {
    container.innerHTML = '<p class="error">Unable to load writing collection.</p>';
    console.error('Failed to load writing data:', error);
  }
}
