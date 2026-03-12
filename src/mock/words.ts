import type { Word } from "../types/word"
import run from "../assets/run.jpg"
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
    categoryIds: ["body"],
    userId: '01002'
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
    categoryIds: ["body"],
     userId: '01002'
  },


  {
    id: "axftri03",
    english: "run",
    portuguese: "correr",
    image: {
      id: "iddaimage",
      name: "run",
      url: run,
    },
    urlAudio: "pathOfSound",
    categoryIds: ["food"],
     userId: '01003'
  },
  {
    id: "axftri04",
    english: "api",
    portuguese: "api",
    image: {
      id: "iddaimage02",
      name: "api",
      url: api,
    },
    urlAudio: "pathOfSound",
    categoryIds: ["greeting"],
     userId: '01002'
  },
];

