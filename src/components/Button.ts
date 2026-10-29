export interface ButtonProps {
    label: string;
    index: string;
    hint?: string;
    isActive?: boolean;
    cue?: boolean;
    hintDismissed?: boolean;
    onClick: () => void;
    onMouseLeave?: () => void;
}

export function Button({
    label,
    index,
    hint,
    isActive = false,
    cue = false,
    hintDismissed = false,
    onClick,
    onMouseLeave,
}: ButtonProps): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `nav-button${isActive ? ' nav-button--active' : ''}${cue ? ' nav-button--cue' : ''}${hintDismissed ? ' nav-button--hint-dismissed' : ''}`;
    button.type = 'button';

    const indexEl = document.createElement('span');
    indexEl.className = 'nav-button__index';
    indexEl.textContent = index;

    const text = document.createElement('span');
    text.className = 'nav-button__label';
    text.textContent = label;
    if (cue) {
        const mark = document.createElement('span');
        mark.className = 'nav-button__cue';
        mark.setAttribute('aria-hidden', 'true');
        text.appendChild(mark);
    }

    button.append(indexEl, text);
    if (hint) {
        const hintEl = document.createElement('span');
        hintEl.className = 'nav-button__hint';
        hintEl.textContent = hint;
        button.appendChild(hintEl);
    }
    button.addEventListener('click', onClick);
    if (onMouseLeave) {
        button.addEventListener('mouseleave', onMouseLeave);
    }
    return button;
}
