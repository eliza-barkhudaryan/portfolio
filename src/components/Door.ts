export type DoorKind = 'music' | 'video' | 'photos' | 'writing' | 'contact';

export interface DoorProps {
    content: HTMLElement;
    kind: DoorKind;
    label: string;
    light?: boolean;
}

const openDoors = new Set<HTMLElement>();

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

function ensureArchClip(): void {
    if (document.getElementById('door-arch-clip')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = `
      <defs>
        <clipPath id="door-arch-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.36 C0,0.18 0.22,0.05 0.5,0 C0.78,0.05 1,0.18 1,0.36 L1,1 Z" />
        </clipPath>
      </defs>`;
    document.body.appendChild(svg);
}

function panel(side: 'left' | 'right'): HTMLElement {
    const door = document.createElement('div');
    door.className = `door__panel door__panel--${side}`;
    door.innerHTML = `
      <span class="door__tracery" aria-hidden="true"></span>
      <span class="door__handle" aria-hidden="true"></span>`;
    return door;
}

export function Door({ content, kind, label, light = true }: DoorProps): HTMLElement {
    ensureArchClip();

    const root = document.createElement('div');
    root.className = `door door--${kind}${light ? ' door--lit' : ''}`;

    const stage = document.createElement('div');
    stage.className = 'door__stage';

    const frame = document.createElement('div');
    frame.className = 'door__frame';

    const inside = document.createElement('div');
    inside.className = 'door__inside';
    inside.appendChild(content);

    const left = panel('left');
    const right = panel('right');

    const latch = document.createElement('button');
    latch.type = 'button';
    latch.className = 'door__latch';
    latch.setAttribute('aria-expanded', 'false');
    latch.setAttribute('aria-label', `Open ${label}`);

    if (light) {
        const glow = document.createElement('div');
        glow.className = 'door__glow';
        frame.appendChild(glow);
    }
    frame.append(inside, left, right, latch);
    stage.appendChild(frame);
    root.appendChild(stage);

    let generation = 0;
    let popup: { overlay: HTMLElement; zoom: HTMLElement } | null = null;

    function applyOpen(open: boolean): void {
        if (open === root.classList.contains('is-open')) return;
        root.classList.toggle('is-open', open);
        latch.setAttribute('aria-expanded', open ? 'true' : 'false');
        latch.setAttribute('aria-label', `${open ? 'Close' : 'Open'} ${label}`);
        content.dispatchEvent(new CustomEvent('door-toggle', { detail: { open } }));
        if (open) {
            [...openDoors].forEach((other) => {
                if (other !== root) {
                    other.dispatchEvent(new CustomEvent('door-request-close'));
                }
            });
            openDoors.add(root);
        } else {
            openDoors.delete(root);
        }
    }

    function zoomFromDoor(zoom: HTMLElement): string {
        const origin = frame.getBoundingClientRect();
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
        if (popup || !root.classList.contains('is-open')) return;

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

        bar.append(title, dismiss);
        zoom.append(bar, body);
        popupFrame.appendChild(zoom);
        overlay.appendChild(popupFrame);
        document.body.appendChild(overlay);
        document.documentElement.classList.add('has-media-popup');
        popup = { overlay, zoom };

        const parked = zoomFromDoor(zoom);
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
            });
        });

        dismiss.addEventListener('click', (event) => {
            event.stopPropagation();
            setOpen(false);
        });
        document.addEventListener('keydown', onPopupKey);
    }

    function onPopupKey(event: KeyboardEvent): void {
        if (event.key !== 'Escape' || !popup) return;
        event.preventDefault();
        setOpen(false);
    }

    function dismissPopup(done: () => void): void {
        if (!popup) {
            done();
            return;
        }
        const { overlay, zoom } = popup;
        popup = null;
        document.removeEventListener('keydown', onPopupKey);
        overlay.classList.remove('is-shown');
        zoom.style.transform = zoomFromDoor(zoom);

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            inside.appendChild(content);
            overlay.remove();
            document.documentElement.classList.remove('has-media-popup');
            done();
        };
        zoom.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform') finish();
        });
        window.setTimeout(finish, 1100);
    }

    function setOpen(open: boolean): void {
        const ticket = ++generation;
        if (open) {
            if (root.classList.contains('is-open')) return;
            applyOpen(true);
            if (popsOut(kind)) {
                window.setTimeout(() => {
                    if (ticket !== generation) return;
                    showPopup();
                }, 120);
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

    function isControl(target: EventTarget | null): boolean {
        return target instanceof Element && !!target.closest(
            'a, button, video, audio, input, .song-player__progress-container, .photo-slider__controls'
        );
    }

    function closeFromDoor(event: Event): void {
        if (!root.classList.contains('is-open') || popup) return;
        if (isControl(event.target)) return;
        event.stopPropagation();
        setOpen(false);
    }

    root.addEventListener('door-request-close', () => setOpen(false));

    latch.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!root.classList.contains('is-open'));
    });

    left.addEventListener('click', closeFromDoor);
    right.addEventListener('click', closeFromDoor);
    inside.addEventListener('click', closeFromDoor);

    document.addEventListener('click', (event) => {
        if (!root.classList.contains('is-open') || popup) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (root.contains(target)) return;
        setOpen(false);
    });

    return root;
}
