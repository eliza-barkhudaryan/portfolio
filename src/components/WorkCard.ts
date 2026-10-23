export interface WorkCardProps {
    name: string;
    description: string;
    mediaElement: HTMLElement;
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
    play.appendChild(mediaElement);

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
