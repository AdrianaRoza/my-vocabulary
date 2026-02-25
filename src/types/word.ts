import type { Image } from "./image";

export interface Word {
  id: string;
  english: string;
  portuguese: string;
  image: Image;
  urlAudio: string;
  categoryIds?: string[];
}
