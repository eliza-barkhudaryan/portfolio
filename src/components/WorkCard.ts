import { Door, type DoorKind } from './Door';

export interface WorkCardProps {
    name: string;
    description: string;
    mediaElement: HTMLElement;
}

function doorKind(media: HTMLElement): DoorKind {
    if (media.classList.contains('song-player')) return 'music';
    if (media.classList.contains('video-player')) return 'video';
    if (media.classList.contains('photo-slider')) return 'photos';
    return 'writing';
}

const inViewObserver =
    typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
              (entries) => {
                  entries.forEach((entry) => {
                      entry.target.classList.toggle(
                          'is-in-view',
                          entry.isIntersecting && entry.intersectionRatio >= 0.45
                      );
                  });
              },
              { threshold: [0.25, 0.45, 0.7] }
          )
        : null;

export function WorkCard({ name, description, mediaElement }: WorkCardProps): HTMLElement {
    const card = document.createElement('article');
    card.className = 'work-card';

    const play = document.createElement('div');
    play.className = 'work-card__play';
    play.appendChild(
        Door({
            content: mediaElement,
            kind: doorKind(mediaElement),
            label: name,
        })
    );

    const copy = document.createElement('div');
    copy.className = 'work-card__copy';

    const header = document.createElement('header');
    header.className = 'work-card__header';

    const title = document.createElement('h3');
    title.className = 'work-card__title';
    title.textContent = name;

    header.appendChild(title);

    const descriptionEl = document.createElement('p');
    descriptionEl.className = 'work-card__description';
    descriptionEl.textContent = description;

    copy.appendChild(header);
    copy.appendChild(descriptionEl);

    card.appendChild(play);
    card.appendChild(copy);

    inViewObserver?.observe(card);

    return card;
}
