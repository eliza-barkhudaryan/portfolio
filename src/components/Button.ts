export interface ButtonProps {
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

export function Button({ label, isActive = false, onClick }: ButtonProps): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `nav-button ${isActive ? 'nav-button--active' : ''}`;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

