const EMAIL = 'eliza.barkhudaryan@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/eliza-barkhudaryan/';

function passage(href: string, name: string, detail: string, external = false): HTMLAnchorElement {
    const link = document.createElement('a');
    link.className = 'contact-portal__link';
    link.href = href;
    if (external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    const nameEl = document.createElement('span');
    nameEl.className = 'contact-portal__name';
    nameEl.textContent = name;

    const detailEl = document.createElement('span');
    detailEl.className = 'contact-portal__detail';
    detailEl.textContent = detail;

    link.append(nameEl, detailEl);
    return link;
}

export async function renderContactsPage(container: HTMLElement): Promise<void> {
    container.innerHTML = '';

    const stage = document.createElement('section');
    stage.className = 'contact-stage';

    const portal = document.createElement('div');
    portal.className = 'contact-portal';
    portal.append(
        passage(`mailto:${EMAIL}`, 'Email', EMAIL),
        passage(LINKEDIN_URL, 'LinkedIn', 'eliza-barkhudaryan', true)
    );

    const copy = document.createElement('div');
    copy.className = 'contact-stage__copy';

    const line = document.createElement('p');
    line.className = 'contact-stage__line';
    line.textContent = 'For a score, a picture, or a story.';

    copy.append(line, portal);
    stage.append(copy);
    container.appendChild(stage);
}
