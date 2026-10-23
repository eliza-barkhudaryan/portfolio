import type { PhotoObject } from '../types';

function arrowMark(direction: 'prev' | 'next'): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 12 20');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', direction === 'prev' ? 'M9 2 L3 10 L9 18' : 'M3 2 L9 10 L3 18');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.2');
  svg.appendChild(path);
  return svg;
}

export interface PhotoSliderProps {
  photos: PhotoObject[];
  seriesTitle: string;
}

export function PhotoSlider({ photos, seriesTitle }: PhotoSliderProps): HTMLElement {
  const container = document.createElement('div');
  container.className = 'photo-slider';

  let currentIndex = 0;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'photo-slider__image-container';

  const img = document.createElement('img');
  img.className = 'photo-slider__image';
  img.fetchPriority = 'high';
  img.src = photos[0]?.path || '';
  img.alt = photos[0]?.name || seriesTitle;
  imageContainer.appendChild(img);

  // Photo caption area (only created if needed)
  const captionContainer = document.createElement('div');
  captionContainer.className = 'photo-slider__caption';

  const photoTitle = document.createElement('h4');
  photoTitle.className = 'photo-slider__photo-title';

  const photoDescription = document.createElement('p');
  photoDescription.className = 'photo-slider__photo-description';

  function updateCaption(photo: PhotoObject): void {
    // Clear caption container
    captionContainer.innerHTML = '';
    
    // Only add title if it exists
    if (photo.name) {
      photoTitle.textContent = photo.name;
      captionContainer.appendChild(photoTitle);
    }
    
    // Only add description if it exists
    if (photo.description) {
      photoDescription.textContent = photo.description;
      captionContainer.appendChild(photoDescription);
    }
    
    // Show/hide caption container based on content
    captionContainer.hidden = !(photo.name || photo.description);
  }

  // Initialize caption
  updateCaption(photos[0]);

  const controls = document.createElement('div');
  controls.className = 'photo-slider__controls';

  const prevButton = document.createElement('button');
  prevButton.className = 'photo-slider__button photo-slider__button--prev';
  prevButton.appendChild(arrowMark('prev'));
  prevButton.setAttribute('aria-label', 'Previous image');

  const indicator = document.createElement('span');
  indicator.className = 'photo-slider__indicator';
  indicator.textContent = `${currentIndex + 1} / ${photos.length}`;

  const nextButton = document.createElement('button');
  nextButton.className = 'photo-slider__button photo-slider__button--next';
  nextButton.appendChild(arrowMark('next'));
  nextButton.setAttribute('aria-label', 'Next image');

  function updateSlider(): void {
    const currentPhoto = photos[currentIndex];
    img.src = currentPhoto.path;
    img.alt = currentPhoto.name || seriesTitle;
    updateCaption(currentPhoto);
    indicator.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  function step(delta: number): void {
    if (photos.length <= 1) return;
    currentIndex = (currentIndex + delta + photos.length) % photos.length;
    updateSlider();
  }

  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const showing = container.closest('.media-popup, .door.is-open');
    if (!showing || photos.length <= 1) return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  });

  // Hide controls if only one image
  if (photos.length <= 1) {
    controls.style.display = 'none';
  }

  controls.appendChild(prevButton);
  controls.appendChild(indicator);
  controls.appendChild(nextButton);

  container.appendChild(imageContainer);
  container.appendChild(captionContainer);
  container.appendChild(controls);

  return container;
}
