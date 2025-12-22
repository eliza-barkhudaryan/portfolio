import { WorkCard } from '../components/WorkCard';
import { PhotoSlider } from '../components/PhotoSlider';
import type { PhotographyItem } from '../types';

export async function renderPhotographyPage(container: HTMLElement): Promise<void> {
  try {
    const response = await fetch('./data/photography/objects.json');
    const items: PhotographyItem[] = await response.json();

    container.innerHTML = '';

    const pageHeader = document.createElement('div');
    pageHeader.className = 'page-header';
    
    const title = document.createElement('h2');
    title.className = 'page-title';
    title.textContent = 'Photography';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'page-subtitle';
    subtitle.textContent = 'Visual Stories Through the Lens';

    pageHeader.appendChild(title);
    pageHeader.appendChild(subtitle);
    container.appendChild(pageHeader);

    const grid = document.createElement('div');
    grid.className = 'work-grid work-grid--stacked';

    items.forEach((item) => {
      // Add full path prefix to each photo object
      const photosWithPaths = item.photo_objects.map((photo) => ({
        ...photo,
        path: `./data/photography/${photo.path}`,
      }));
      
      const photoSlider = PhotoSlider({
        photos: photosWithPaths,
        seriesTitle: item.name,
      });

      const card = WorkCard({
        name: item.name,
        description: item.description,
        mediaElement: photoSlider,
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  } catch (error) {
    container.innerHTML = '<p class="error">Unable to load photography collection.</p>';
    console.error('Failed to load photography data:', error);
  }
}
