export interface MusicItem {
  name: string;
  description: string;
  path: string;
}

export interface PhotoObject {
  name?: string;
  description?: string;
  path: string;
}

export interface PhotographyItem {
  name: string;
  description: string;
  photo_objects: PhotoObject[];
}

export interface WritingItem {
  name: string;
  description: string;
  url: string;
  linkLabel?: string;
}
