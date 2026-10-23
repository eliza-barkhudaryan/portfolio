import { Door } from '../components/Door';

const EMAIL = 'eliza.barkhudaryan@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/eliza-barkhudaryan/';

function flameIcon(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 28');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('contact-portal__flame');

    const outer = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outer.setAttribute('class', 'flame__outer');
    outer.setAttribute(
        'd',
        'M10 27C4 21 2 16 5 11C6.2 14.5 7.2 13.2 7.4 9.5C7.6 6 10 1 10 1C10 1 12.4 6 12.6 9.5C12.8 13.2 13.8 14.5 15 11C18 16 16 21 10 27Z'
    );

    const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    core.setAttribute('class', 'flame__core');
    core.setAttribute(
        'd',
        'M10 25C6.4 20.5 6 17 7.6 14C8.4 16 8.6 15 8.8 12.6C9 10 10 7 10 7C10 7 11 10 11.2 12.6C11.4 15 11.6 16 12.4 14C14 17 13.6 20.5 10 25Z'
    );

    svg.append(outer, core);
    return svg;
}

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
        flameIcon(),
        passage(`mailto:${EMAIL}`, 'Letter', EMAIL),
        passage(LINKEDIN_URL, 'LinkedIn', 'eliza-barkhudaryan', true)
    );

    const copy = document.createElement('div');
    copy.className = 'contact-stage__copy';

    const line = document.createElement('p');
    line.className = 'contact-stage__line';
    line.textContent = 'For a score, a picture, or a story.';

    const aside = document.createElement('p');
    aside.className = 'contact-stage__aside';
    aside.textContent = 'Open the door.';

    copy.append(line, aside);
    stage.append(Door({ content: portal, kind: 'contact', label: 'Correspondence', light: false }), copy);
    container.appendChild(stage);
}
