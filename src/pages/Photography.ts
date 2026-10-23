import { storageUrl } from '../storage';
import { WorkCard } from '../components/WorkCard';
import { PhotoSlider } from '../components/PhotoSlider';
import type { PhotographyItem } from '../types';

function isUrl(path: string): boolean {
  try {
    new URL(path);
    return true;
  } catch {
    return false;
  }
}

function getPhotoPath(path: string): string {
  return isUrl(path) ? path : `./data/photography/${path}`;
}

function preloadImages(urls: string[]): void {
  urls.forEach((url) => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.onload = image.onerror = () => {
      image.onload = null;
      image.onerror = null;
    };
    image.src = url;
  });
}

export async function renderPhotographyPage(container: HTMLElement): Promise<void> {
  try {
    const response = await fetch(storageUrl('photography/objects.json'));
    const items: PhotographyItem[] = await response.json();

    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'work-grid work-grid--scroll';

    const series = items.map((item) => ({
      ...item,
      photos: item.photo_objects.map((photo) => ({
        ...photo,
        path: getPhotoPath(photo.path),
      })),
    }));

    const showing = new Set(series.map((item) => item.photos[0]?.path).filter(Boolean));

    series.forEach((item) => {
      const photosWithPaths = item.photos;

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

    preloadImages(
      series.flatMap((item) => item.photos.map((photo) => photo.path)).filter((path) => !showing.has(path))
    );
  } catch (error) {
    container.innerHTML = '<p class="error">Unable to load photography collection.</p>';
    console.error('Failed to load photography data:', error);
  }
}
