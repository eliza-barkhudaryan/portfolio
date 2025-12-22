export interface WorkCardProps {
    name: string;
    description: string;
    mediaElement: HTMLElement;
}

export function WorkCard({ name, description, mediaElement }: WorkCardProps): HTMLElement {
    const card = document.createElement('article');
    card.className = 'work-card';

    const header = document.createElement('header');
    header.className = 'work-card__header';

    const title = document.createElement('h3');
    title.className = 'work-card__title';
    title.textContent = name;

    const ornament = document.createElement('span');
    ornament.className = 'work-card__ornament';
    ornament.textContent = '§';

    header.appendChild(title);
    header.appendChild(ornament);

    const descriptionEl = document.createElement('p');
    descriptionEl.className = 'work-card__description';
    descriptionEl.textContent = description;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'work-card__media';
    mediaContainer.appendChild(mediaElement);

    card.appendChild(header);
    card.appendChild(descriptionEl);
    card.appendChild(mediaContainer);

    return card;
}

