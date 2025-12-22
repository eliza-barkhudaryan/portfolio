export interface LinkPlaceholderProps {
    url: string;
    label?: string;
}

export function LinkPlaceholder({ url, label }: LinkPlaceholderProps): HTMLElement {
    const container = document.createElement('div');
    container.className = 'link-placeholder';

    const link = document.createElement('a');
    link.className = 'link-placeholder__link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const icon = document.createElement('span');
    icon.className = 'link-placeholder__icon';
    icon.innerHTML = '☞';

    const text = document.createElement('span');
    text.className = 'link-placeholder__text';
    text.textContent = label || 'Read More';

    const arrow = document.createElement('span');
    arrow.className = 'link-placeholder__arrow';
    arrow.innerHTML = '→';

    link.appendChild(icon);
    link.appendChild(text);
    link.appendChild(arrow);
    container.appendChild(link);

    return container;
}

