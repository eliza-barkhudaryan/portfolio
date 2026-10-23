export interface ButtonProps {
    label: string;
    hint?: string;
    isActive?: boolean;
    flame?: boolean;
    hintDismissed?: boolean;
    onClick: () => void;
    onMouseLeave?: () => void;
}

const flameSvg = `
<svg class="nav-button__flame" viewBox="0 0 20 28" aria-hidden="true">
  <path class="flame__outer" d="M10 27C4 21 2 16 5 11C6.2 14.5 7.2 13.2 7.4 9.5C7.6 6 10 1 10 1C10 1 12.4 6 12.6 9.5C12.8 13.2 13.8 14.5 15 11C18 16 16 21 10 27Z" />
  <path class="flame__core" d="M10 25C6.4 20.5 6 17 7.6 14C8.4 16 8.6 15 8.8 12.6C9 10 10 7 10 7C10 7 11 10 11.2 12.6C11.4 15 11.6 16 12.4 14C14 17 13.6 20.5 10 25Z" />
</svg>
`;

export function Button({
    label,
    hint,
    isActive = false,
    flame = false,
    hintDismissed = false,
    onClick,
    onMouseLeave,
}: ButtonProps): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `nav-button${isActive ? ' nav-button--active' : ''}${flame ? ' nav-button--flame' : ''}${hintDismissed ? ' nav-button--hint-dismissed' : ''}`;
    button.type = 'button';

    const text = document.createElement('span');
    text.className = 'nav-button__label';
    text.textContent = label;

    button.appendChild(text);
    if (flame) {
        text.insertAdjacentHTML('beforeend', flameSvg);
    }
    if (hint) {
        const hintEl = document.createElement('span');
        hintEl.className = 'nav-button__hint';
        hintEl.textContent = hint;
        text.appendChild(hintEl);
    }
    button.addEventListener('click', onClick);
    if (onMouseLeave) {
        button.addEventListener('mouseleave', onMouseLeave);
    }
    return button;
}
