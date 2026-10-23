import { Button } from './components/Button';
import { renderMusicPage } from './pages/Music';
import { renderPhotographyPage } from './pages/Photography';
import { renderWritingPage } from './pages/Writing';
import { renderContactsPage } from './pages/Contacts';
import './style.css';

type PageType = 'music' | 'photography' | 'writing' | 'contacts';

const pages: { id: PageType; label: string; hint: string }[] = [
    { id: 'music', label: 'Music', hint: 'A Collection of Original Compositions' },
    { id: 'photography', label: 'Photography', hint: 'Visual Stories Through the Lens' },
    { id: 'writing', label: 'Writing', hint: 'Articles, Essays, and Stories' },
    { id: 'contacts', label: 'Contacts', hint: 'Get in Touch' },
];

let currentPage: PageType = 'music';
let dismissedHint: PageType | null = null;

function renderNavigation(): void {
    const navContainer = document.getElementById('nav-buttons');
    if (!navContainer) return;

    navContainer.innerHTML = '';

    pages.forEach((page) => {
        const button = Button({
            label: page.label,
            hint: page.hint,
            isActive: currentPage === page.id,
            flame: page.id === 'contacts',
            hintDismissed: dismissedHint === page.id,
            onClick: () => {
                dismissedHint = page.id;
                navigateTo(page.id);
            },
            onMouseLeave: () => {
                if (dismissedHint === page.id) {
                    dismissedHint = null;
                }
            },
        });
        navContainer.appendChild(button);
    });
}

async function renderPage(): Promise<void> {
    const contentContainer = document.getElementById('content');
    if (!contentContainer) return;

    contentContainer.innerHTML = '<p class="loading">Loading...</p>';

    try {
        switch (currentPage) {
            case 'music':
                await renderMusicPage(contentContainer);
                break;
            case 'photography':
                await renderPhotographyPage(contentContainer);
                break;
            case 'writing':
                await renderWritingPage(contentContainer);
                break;
            case 'contacts':
                await renderContactsPage(contentContainer);
                break;
        }
    } catch (error) {
        contentContainer.innerHTML = '<p class="error">Failed to load content.</p>';
        console.error(error);
    }
}

function navigateTo(page: PageType): void {
    currentPage = page;
    window.location.hash = page;
    renderNavigation();
    renderPage();
}

function init(): void {
    // Check URL hash for initial page
    const hash = window.location.hash.slice(1) as PageType;
    if (pages.some((p) => p.id === hash)) {
        currentPage = hash;
    }

    renderNavigation();
    renderPage();

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) as PageType;
        if (pages.some((p) => p.id === hash) && hash !== currentPage) {
            currentPage = hash;
            renderNavigation();
            renderPage();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

