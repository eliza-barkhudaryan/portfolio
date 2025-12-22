import type { PhotoObject } from '../types';

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
    captionContainer.style.display = (photo.name || photo.description) ? 'block' : 'none';
  }

  // Initialize caption
  updateCaption(photos[0]);

  const controls = document.createElement('div');
  controls.className = 'photo-slider__controls';

  const prevButton = document.createElement('button');
  prevButton.className = 'photo-slider__button photo-slider__button--prev';
  prevButton.innerHTML = '◀';
  prevButton.setAttribute('aria-label', 'Previous image');

  const indicator = document.createElement('span');
  indicator.className = 'photo-slider__indicator';
  indicator.textContent = `${currentIndex + 1} / ${photos.length}`;

  const nextButton = document.createElement('button');
  nextButton.className = 'photo-slider__button photo-slider__button--next';
  nextButton.innerHTML = '▶';
  nextButton.setAttribute('aria-label', 'Next image');

  function updateSlider(): void {
    const currentPhoto = photos[currentIndex];
    img.src = currentPhoto.path;
    img.alt = currentPhoto.name || seriesTitle;
    updateCaption(currentPhoto);
    indicator.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  prevButton.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    updateSlider();
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
