export type DoorKind = 'music' | 'video' | 'photos' | 'writing' | 'contact';

export interface DoorProps {
    content: HTMLElement;
    kind: DoorKind;
    label: string;
    light?: boolean;
}

const openDoors = new Set<HTMLElement>();

function reduceMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function closeMark(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 3 L13 13 M13 3 L3 13');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.15');
    svg.appendChild(path);
    return svg;
}

function popsOut(kind: DoorKind): boolean {
    return kind === 'photos' || kind === 'video';
}

export function Door({ content, kind, label }: DoorProps): HTMLElement {
    if (kind === 'writing' || kind === 'contact') {
        const plate = document.createElement('div');
        plate.className = 'read-plate';
        plate.appendChild(content);
        return plate;
    }

    if (kind === 'music') return mountTurntable(content, label);
    return mountStage(content, kind, label);
}

function mountTurntable(content: HTMLElement, label: string): HTMLElement {
    const root = document.createElement('div');
    root.className = 'turntable';

    const well = document.createElement('div');
    well.className = 'turntable__well';

    const disc = document.createElement('div');
    disc.className = 'turntable__disc';
    disc.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('div');
    labelEl.className = 'turntable__label';
    const labelText = document.createElement('span');
    labelText.textContent = label;
    labelEl.appendChild(labelText);

    const spindle = document.createElement('div');
    spindle.className = 'turntable__spindle';

    disc.append(labelEl, spindle);

    const sheen = document.createElement('div');
    sheen.className = 'turntable__sheen';
    sheen.setAttribute('aria-hidden', 'true');

    const arm = document.createElement('div');
    arm.className = 'turntable__arm';
    arm.setAttribute('aria-hidden', 'true');
    arm.innerHTML = `
      <span class="turntable__arm-head"></span>
      <span class="turntable__arm-beam"></span>
      <span class="turntable__arm-pivot"></span>`;

    const hit = document.createElement('button');
    hit.type = 'button';
    hit.className = 'turntable__hit';
    hit.setAttribute('aria-label', `Play ${label}`);

    const readout = document.createElement('div');
    readout.className = 'turntable__readout';
    readout.appendChild(content);

    well.append(disc, sheen, arm, hit);
    root.append(well, readout);

    const audio = content.querySelector('audio');
    wireExclusive(root, content, hit, label, () => audio ?? null, null);

    if (audio) {
        const trackArm = () => {
            const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
            root.style.setProperty('--arm-angle', `${-8 - Math.min(1, Math.max(0, ratio)) * 26}deg`);
        };
        audio.addEventListener('timeupdate', trackArm);
        audio.addEventListener('play', () => {
            root.classList.add('is-playing');
            hit.setAttribute('aria-label', `Pause ${label}`);
        });
        audio.addEventListener('pause', () => {
            root.classList.remove('is-playing');
            hit.setAttribute('aria-label', `Play ${label}`);
        });
    }

    return root;
}

function mountStage(content: HTMLElement, kind: DoorKind, label: string): HTMLElement {
    const root = document.createElement('div');
    root.className = `stage stage--${kind}`;

    const frame = document.createElement('div');
    frame.className = kind === 'video' ? 'stage__lens' : 'stage__print';

    const holder = document.createElement('div');
    holder.className = 'stage__holder';
    holder.appendChild(content);
    frame.appendChild(holder);

    const hit = document.createElement('button');
    hit.type = 'button';
    hit.className = 'stage__hit';
    hit.setAttribute('aria-label', `Open ${label}`);

    if (kind === 'photos') {
        const imageBox = content.querySelector('.photo-slider__image-container');
        (imageBox ?? frame).appendChild(hit);
    } else {
        frame.appendChild(hit);
    }

    root.appendChild(frame);

    const video = content.querySelector('video');
    if (video) {
        video.controls = false;
        video.playsInline = true;
        video.preload = 'metadata';
        video.addEventListener('loadeddata', () => {
            if (video.currentTime < 0.05) video.currentTime = 0.1;
        });
    }

    wireExclusive(root, content, hit, label, () => null, {
        frame,
        onShow: () => {
            if (video) video.controls = true;
        },
        onHide: () => {
            if (video) video.controls = false;
        },
    });

    return root;
}

interface PopupHooks {
    frame: HTMLElement;
    onShow: () => void;
    onHide: () => void;
}

function wireExclusive(
    root: HTMLElement,
    content: HTMLElement,
    hit: HTMLButtonElement,
    label: string,
    audioOf: () => HTMLAudioElement | null,
    popupHooks: PopupHooks | null
): void {
    let generation = 0;
    let popup: { overlay: HTMLElement; zoom: HTMLElement } | null = null;
    const home = content.parentElement;

    function applyOpen(open: boolean): void {
        if (open === root.classList.contains('is-open')) return;
        root.classList.toggle('is-open', open);
        hit.setAttribute('aria-expanded', open ? 'true' : 'false');
        content.dispatchEvent(new CustomEvent('door-toggle', { detail: { open } }));
        if (open) {
            [...openDoors].forEach((other) => {
                if (other !== root) other.dispatchEvent(new CustomEvent('door-request-close'));
            });
            openDoors.add(root);
        } else {
            openDoors.delete(root);
        }
    }

    function originRect(): DOMRect {
        return (popupHooks?.frame ?? root).getBoundingClientRect();
    }

    function zoomFromOrigin(zoom: HTMLElement): string {
        const origin = originRect();
        const final = zoom.getBoundingClientRect();
        const scale = Math.min(
            final.width ? origin.width / final.width : 1,
            final.height ? origin.height / final.height : 1
        );
        const dx = origin.left + origin.width / 2 - (final.left + final.width / 2);
        const dy = origin.top + origin.height / 2 - (final.top + final.height / 2);
        return `translate(${dx}px, ${dy}px) scale(${scale})`;
    }

    function showPopup(): void {
        if (!popupHooks || popup || !root.classList.contains('is-open')) return;

        const overlay = document.createElement('div');
        overlay.className = 'media-popup';

        const popupFrame = document.createElement('div');
        popupFrame.className = 'media-popup__frame';
        popupFrame.setAttribute('role', 'dialog');
        popupFrame.setAttribute('aria-modal', 'true');
        popupFrame.setAttribute('aria-label', label);

        const zoom = document.createElement('div');
        zoom.className = 'media-popup__zoom';

        const bar = document.createElement('div');
        bar.className = 'media-popup__bar';

        const title = document.createElement('p');
        title.className = 'media-popup__title';
        title.textContent = label;

        const dismiss = document.createElement('button');
        dismiss.type = 'button';
        dismiss.className = 'media-popup__close';
        dismiss.setAttribute('aria-label', 'Close');
        dismiss.appendChild(closeMark());

        const body = document.createElement('div');
        body.className = 'media-popup__body';
        body.appendChild(content);
        popupHooks.onShow();

        bar.append(title, dismiss);
        zoom.append(bar, body);
        popupFrame.appendChild(zoom);
        overlay.appendChild(popupFrame);
        document.body.appendChild(overlay);
        document.documentElement.classList.add('has-media-popup');
        popup = { overlay, zoom };

        const parked = zoomFromOrigin(zoom);
        zoom.style.transition = 'none';
        zoom.style.transform = parked;
        void zoom.offsetWidth;

        requestAnimationFrame(() => {
            if (!popup || popup.zoom !== zoom) return;
            zoom.style.transition = '';
            requestAnimationFrame(() => {
                if (!popup || popup.zoom !== zoom) return;
                overlay.classList.add('is-shown');
                zoom.style.transform = 'translate(0px, 0px) scale(1)';
                dismiss.focus();
            });
        });

        dismiss.addEventListener('click', (event) => {
            event.stopPropagation();
            setOpen(false);
        });
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) setOpen(false);
        });
        document.addEventListener('keydown', onPopupKey);
    }

    function onPopupKey(event: KeyboardEvent): void {
        if (event.key !== 'Escape' || !popup) return;
        event.preventDefault();
        setOpen(false);
    }

    function dismissPopup(done: () => void): void {
        if (!popup || !popupHooks) {
            done();
            return;
        }
        const { overlay, zoom } = popup;
        popup = null;
        document.removeEventListener('keydown', onPopupKey);
        overlay.classList.remove('is-shown');
        zoom.style.transform = zoomFromOrigin(zoom);

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            popupHooks.onHide();
            (home ?? popupHooks.frame).appendChild(content);
            overlay.remove();
            document.documentElement.classList.remove('has-media-popup');
            hit.focus();
            done();
        };
        zoom.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform') finish();
        });
        window.setTimeout(finish, reduceMotion() ? 0 : 1100);
    }

    function setOpen(open: boolean): void {
        const ticket = ++generation;
        if (open) {
            if (root.classList.contains('is-open')) return;
            applyOpen(true);
            if (popupHooks && popsOut(root.classList.contains('stage--video') ? 'video' : 'photos')) {
                showPopup();
            }
            return;
        }
        if (popup) {
            dismissPopup(() => {
                if (ticket !== generation) return;
                applyOpen(false);
            });
            return;
        }
        applyOpen(false);
    }

    hit.addEventListener('click', (event) => {
        event.stopPropagation();
        if (popup) return;
        const audio = audioOf();
        if (audio && !audio.paused) {
            setOpen(false);
            return;
        }
        if (!root.classList.contains('is-open')) {
            setOpen(true);
            return;
        }
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => undefined);
        }
    });

    root.addEventListener('door-request-close', () => setOpen(false));
}
