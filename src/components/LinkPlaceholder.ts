export interface LinkPlaceholderProps {
    url: string;
    label?: string;
    name: string;
}

function readingCopy(label: string | undefined, url: string): { kicker: string; detail: string } {
    const raw = (label || '').trim();
    const language = /\[AM\]/i.test(raw) ? 'Armenian' : /\[EN\]/i.test(raw) ? 'English' : '';
    const kicker = language ? `Read in ${language}` : raw || 'Read';
    const isPdf = /\.pdf(?:$|\?)/i.test(url);

    let detail = isPdf ? 'PDF' : '';
    if (!isPdf) {
        try {
            detail = new URL(url).hostname.replace(/^www\./, '');
        } catch {
            detail = '';
        }
    }

    return { kicker, detail };
}

export function LinkPlaceholder({ url, label, name }: LinkPlaceholderProps): HTMLAnchorElement {
    const { kicker, detail } = readingCopy(label, url);

    const link = document.createElement('a');
    link.className = 'essay__link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', detail === 'PDF' ? `${kicker}, PDF: ${name}` : `${kicker}: ${name}`);

    const kickerEl = document.createElement('span');
    kickerEl.className = 'essay__link-name';
    kickerEl.textContent = kicker;

    link.appendChild(kickerEl);

    if (detail) {
        const detailEl = document.createElement('span');
        detailEl.className = 'essay__link-detail';
        detailEl.textContent = detail;
        link.appendChild(detailEl);
    }

    return link;
}
