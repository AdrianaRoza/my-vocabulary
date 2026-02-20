import type { Word } from "../types/word";
import run from "../assets/run.jpg";
import api from "../assets/api-integration-logistics.png"

export const words: Word[] = [
  {
    id: "axftri01",
    english: "run",
    portuguese: "correr",
    image: {
      id: "iddaimage",
      name: "run",
      url: run,
    },
    urlAudio: "pathOfSound",
  },
  {
    id: "axftri02",
    english: "api",
    portuguese: "api",
    image: {
      id: "iddaimage02",
      name: "api",
      url: api,
    },
    urlAudio: "pathOfSound",
  },
];