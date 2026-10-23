const STORAGE_ORIGIN = 'https://storage.elizabarkhudaryan.me';

export function storageUrl(path: string): string {
    const clean = path.replace(/^\//, '');
    if (import.meta.env.DEV) {
        return `/storage/${clean}`;
    }
    return `${STORAGE_ORIGIN}/${clean}`;
}
